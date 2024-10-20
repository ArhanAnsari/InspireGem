// app/profile/page.tsx
"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData, updateUserData, Plan } from "@/firebaseFunctions";

// Define UserData interface based on the structure returned from getUserData
interface UserData {
  name: string;
  email: string;
  plan: Plan;
  requestCount: number;
  usage: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.email) {
        return;
      }
      const data = await getUserData(session.user.email);
      // Check if all required fields are present
      if (data && data.name && data.email) {
        setUserData(data);
      } else {
        console.error("Incomplete user data");
      }
    }
    fetchData();
  }, [session]);

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdatedUserData(userData);
  };

  const handleSaveClick = async () => {
    if (!updatedUserData) return;

    try {
      await updateUserData(updatedUserData);
      setUserData(updatedUserData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user data", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setUpdatedUserData(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!updatedUserData) return;

    const { name, value } = e.target;
    setUpdatedUserData({
      ...updatedUserData,
      [name]: value,
    });
  };

  if (!session) {
    return (
      <div>
        <p>Please sign in to view your profile.</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Profile Page</h1>
      {userData ? (
        <div>
          {isEditing ? (
            <div>
              <input
                type="text"
                name="name"
                value={updatedUserData?.name || ""}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                value={updatedUserData?.email || ""}
                onChange={handleChange}
              />
              <button onClick={handleSaveClick}>Save</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>Name: {userData.name}</p>
              <p>Email: {userData.email}</p>
              <p>Plan: {userData.plan}</p>
              <p>Request Count: {userData.requestCount}</p>
              <p>Usage: {userData.usage}</p>
              <button onClick={handleEditClick}>Edit Profile</button>
            </div>
          )}
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
