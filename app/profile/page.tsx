// app/profile/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserData, updateUserData } from "@/firebaseFunctions"; 
import { UserData } from "@/types";

const ProfilePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "" });

  useEffect(() => {
    if (!session) {
      // Redirect unauthenticated users to the signin page
      router.push("/auth/signin");
      return;
    }

    const fetchData = async () => {
      const userEmail = session.user?.email || "";
      const data = await getUserData(userEmail);

      // Ensure the fetched data has all necessary fields
      if (data && "name" in data && "email" in data && "plan" in data && "requestCount" in data) {
        setUserData(data);
        setFormState({ name: data.name, email: data.email });
      } else {
        console.error("Incomplete or no user data found");
      }
      setLoading(false);
    };

    fetchData();
  }, [session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    if (userData) {
      const updatedData = { ...userData, ...formState };
      await updateUserData(updatedData);
      setUserData(updatedData);
      setEditMode(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Error loading user data.</div>;
  }

  // Calculate usage percentage
  const { requestCount, plan } = userData;
  const planLimit = plan === "free" ? 50 : plan === "pro" ? 500 : null;
  const usagePercentage = planLimit ? (requestCount / planLimit) * 100 : "Unlimited";

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <strong>Name:</strong>
        {editMode ? (
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            className="ml-2 p-1 border rounded"
          />
        ) : (
          <span className="ml-2">{userData.name}</span>
        )}
      </div>
      <div className="mb-4">
        <strong>Email:</strong>
        {editMode ? (
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            className="ml-2 p-1 border rounded"
          />
        ) : (
          <span className="ml-2">{userData.email}</span>
        )}
      </div>
      <div className="mb-4">
        <strong>Plan:</strong> {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </div>
      <div className="mb-4">
        <strong>Request Count:</strong> {requestCount}
      </div>
      <div className="mb-4">
        <strong>Usage:</strong>{" "}
        {typeof usagePercentage === "string" ? usagePercentage : `${usagePercentage.toFixed(2)}%`}
      </div>
      <div className="mt-4">
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
