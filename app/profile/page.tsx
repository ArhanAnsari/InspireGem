//app/profile/page.tsx

"use client";

import { useState, useEffect } from "react";
import { getAuth, signOut, GoogleAuthProvider, GithubAuthProvider, linkWithPopup } from "firebase/auth";
import { getUserData, connectProvider, getConnectedProviders, updateUserData } from "@/firebaseFunctions";
import Image from "next/image";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        try {
          // Fetch user data from Firestore
          const data = await getUserData(currentUser.email!);
          setUserData(data);

          // Fetch connected providers
          const providers = await getConnectedProviders(currentUser.email!);
          setConnectedProviders(providers);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [auth]);

  const calculateUsage = (requestCount: number, plan: string) => {
    if (plan === "enterprise") {
      return "Unlimited";
    } else {
      const totalLimit = plan === "free" ? 50 : 500;
      return ((requestCount / totalLimit) * 100).toFixed(2) + "%";
    }
  };

  const handleConnectProvider = async (provider: "google" | "github") => {
    try {
      const providerInstance = provider === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();
      await linkWithPopup(auth.currentUser!, providerInstance);

      // Update connected providers in Firestore
      await connectProvider(auth.currentUser!.email!, provider);

      // Refresh connected providers list
      const providers = await getConnectedProviders(auth.currentUser!.email!);
      setConnectedProviders(providers);
      alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} connected successfully!`);
    } catch (error: any) {
      if (error.code === "auth/provider-already-linked") {
        alert("This provider is already linked to your account.");
      } else if (error.code === "auth/credential-already-in-use") {
        alert("This account is already associated with a different user. Please sign in with that provider to confirm your identity.");
      } else {
        console.error(`Error connecting ${provider}:`, error);
        alert("Failed to connect provider. Please try again.");
      }
    }
  };

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.error("Sign out error:", error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <div className="profile-info">
        {user.photoURL ? (
          <Image src={user.photoURL} alt="Profile Photo" className="profile-photo" width={100} height={100} />
        ) : (
          <div className="profile-placeholder">No Profile Photo</div>
        )}
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Plan:</strong> {userData?.plan}</p>
        <p><strong>Request Count:</strong> {userData?.requestCount}</p>
        <p><strong>Usage:</strong> {calculateUsage(userData?.requestCount, userData?.plan)}</p>
        <p><strong>Connected Providers:</strong> {connectedProviders.join(", ") || "None"}</p>
      </div>

      <div className="provider-actions">
        <h2>Connect Additional Providers</h2>
        {!connectedProviders.includes("google") && (
          <button onClick={() => handleConnectProvider("google")}>Connect to Google</button>
        )}
        {!connectedProviders.includes("github") && (
          <button onClick={() => handleConnectProvider("github")}>Connect to GitHub</button>
        )}
      </div>

      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default ProfilePage;
