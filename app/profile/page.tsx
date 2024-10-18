// app/profile/page.tsx
"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData, updateUserData } from "@/firebaseFunctions";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        const data = await getUserData(session.user.email);
        setUserData(data);
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    } else {
      router.push("/auth/signin"); // Redirect to sign-in page if not authenticated
    }
  }, [session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (session?.user?.email) {
      try {
        await updateUserData(session.user.email, userData);
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Error updating profile. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <div className="profile-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={userData?.name || ""}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userData?.email || ""}
            onChange={handleInputChange}
            disabled
          />
        </label>
        <label>
          Plan:
          <input
            type="text"
            name="plan"
            value={userData?.plan || ""}
            onChange={handleInputChange}
            disabled
          />
        </label>
        <button onClick={handleUpdateProfile}>Update Profile</button>
      </div>
      <button onClick={() => signOut()}>Sign Out</button>
      <button onClick={() => signIn("github")}>Connect to GitHub</button>
    </div>
  );
}
