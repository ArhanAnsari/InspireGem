// app/profile/page.tsx
"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData, updateUserData } from "@/firebaseFunctions";

// Define UserData interface based on the structure returned from getUserData
interface UserData {
  name: string;
  email: string;
  plan: "free" | "pro" | "enterprise"; // Adjust these based on your actual plan structure
  requestCount: number;
  usage: number; // This may or may not be needed based on your structure
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null); // Use UserData instead of any
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
    setUserData((prevData) => ({ ...prevData!, [name]: value })); // Use non-null assertion since userData is checked to be not null
  };

  const handleUpdateProfile = async () => {
    if (session?.user?.email) {
      try {
        await updateUserData(session.user.email, userData!); // Use non-null assertion since userData is checked to be not null
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
            readOnly // Make the plan field read-only
          />
        </label>
        <button onClick={handleUpdateProfile}>Update Profile</button>
      </div>
      <button onClick={() => signOut()}>Sign Out</button>
      <button onClick={() => signIn("github")}>Connect to GitHub</button>
    </div>
  );
}
