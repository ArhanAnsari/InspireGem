// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getAuth, signOut, updateProfile, User } from "firebase/auth";
import { getUserData, updateUserData } from "@/firebaseFunctions"; // Custom Firebase functions
import { useSession, signIn, getProviders } from "next-auth/react";

// UserData interface with optional name
interface UserData {
  plan: "free" | "pro" | "enterprise";
  requestCount: number;
  name?: string;
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [nameEditMode, setNameEditMode] = useState<boolean>(false);
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [availableProviders, setAvailableProviders] = useState<any>(null);
  const auth = getAuth();

  useEffect(() => {
    if (!session) return;

    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || "");

        try {
          const data = await getUserData(currentUser.email!);
          setUserData(data ?? { plan: "free", requestCount: 0, name: currentUser.displayName || "" });
          const providers = await getProviders();
          setAvailableProviders(providers);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [auth, session]);

  const calculateUsage = (requestCount: number, plan: string): string => {
    if (plan === "enterprise") {
      return "Unlimited";
    } else {
      const totalLimit = plan === "free" ? 50 : 500;
      return ((requestCount / totalLimit) * 100).toFixed(2) + "%";
    }
  };

  const handleNameChange = async () => {
    if (!user) return;

    try {
      await updateProfile(user, { displayName: name });
      // Ensure that the name is updated in Firestore through the custom function
      await updateUserData(user.email!, { ...userData, name }); 
      setNameEditMode(false);
      alert("Name updated successfully!");
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name. Please try again.");
    }
  };

  const handleProviderLink = async (providerId: string) => {
    if (!session) return;
    try {
      await signIn(providerId, { callbackUrl: "/profile" });
      alert(`${providerId.charAt(0).toUpperCase() + providerId.slice(1)} has been successfully linked to your account.`);
      setConnectedProviders((prev) => [...prev, providerId]);
    } catch (error) {
      console.error("Error linking provider:", error);
      alert("Failed to link provider. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <p>Please sign in to view your profile.</p>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <div className="profile-info">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Plan:</strong> {userData?.plan}</p>
        <p><strong>Request Count:</strong> {userData?.requestCount}</p>
        <p><strong>Usage:</strong> {calculateUsage(userData?.requestCount || 0, userData?.plan || "free")}</p>
        <div className="name-edit">
          <strong>Name:</strong>
          {nameEditMode ? (
            <div>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter new name" />
              <button onClick={handleNameChange}>Save</button>
              <button onClick={() => setNameEditMode(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <span>{name || "Not set"}</span>
              <button onClick={() => setNameEditMode(true)}>Edit</button>
            </div>
          )}
        </div>
        <div className="provider-links">
          <h3>Connect Providers:</h3>
          {availableProviders && Object.keys(availableProviders).map((providerId) => (
            <button key={providerId} onClick={() => handleProviderLink(providerId)} disabled={connectedProviders.includes(providerId)}>
              {connectedProviders.includes(providerId) ? `${providerId} (Connected)` : `Connect ${providerId}`}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => signOut(auth).catch((error) => console.error("Sign out error:", error))}>Sign Out</button>
    </div>
  );
};

export default ProfilePage;
