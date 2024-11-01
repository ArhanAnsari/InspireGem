//app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  signOut,
  updateProfile,
  linkWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "@/firebaseFunctions";
import { useSession, signIn } from "next-auth/react";
import { getAuth } from "firebase/auth";

interface UserData {
  plan: "free" | "pro" | "enterprise";
  requestCount: number;
  name?: string;
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [nameEditMode, setNameEditMode] = useState<boolean>(false);
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const auth = getAuth();

  useEffect(() => {
    if (!session) return;

    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || "");

        try {
          // Fetch user data using the API route
          const response = await fetch("/api/getUserData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: currentUser.email }),
          });
          const data = await response.json();
          setUserData(data ?? { plan: "free", requestCount: 0, name: currentUser.displayName || "" });
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
      // Update name in Firestore using the API route
      await fetch("/api/updateUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email, data: { name } }),
      });
      setNameEditMode(false);
      alert("Name updated successfully!");
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name. Please try again.");
    }
  };

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.error("Sign out error:", error));
  };

  const handleProviderLink = async (provider: "google" | "github") => {
    if (!user) return;

    const providerInstance =
      provider === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();

    try {
      await linkWithPopup(user, providerInstance);
      alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} has been successfully linked to your account.`);
      setConnectedProviders((prev) => [...prev, provider]);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "auth/credential-already-in-use"
      ) {
        alert("This account is already linked to your current profile.");
      } else {
        console.error("Error linking provider:", error);
        alert("Failed to link provider. Please try again.");
      }
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
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter new name"
              />
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
          <button
            onClick={() => handleProviderLink("google")}
            disabled={connectedProviders.includes("google")}
          >
            {connectedProviders.includes("google") ? "Google (Connected)" : "Connect Google"}
          </button>
          <button
            onClick={() => handleProviderLink("github")}
            disabled={connectedProviders.includes("github")}
          >
            {connectedProviders.includes("github") ? "GitHub (Connected)" : "Connect GitHub"}
          </button>
        </div>
      </div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default ProfilePage;
