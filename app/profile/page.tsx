// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  getAuth,
  signOut,
  linkWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { useSession, signIn } from "next-auth/react";
import { connectProvider, getConnectedProviders } from "@/firebaseFunctions";

interface UserData {
  plan: "free" | "pro" | "enterprise";
  requestCount: number;
  name?: string;
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [nameEditMode, setNameEditMode] = useState(false);
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;

      const response = await fetch("/api/getUserData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user?.email }),
      });

      if (response.ok) {
        const data: UserData = await response.json();
        setUserData(data);
        setName(data.name || "");
      } else {
        console.error("Failed to fetch user data");
      }

      const providers = await getConnectedProviders(session.user?.email || "");
      setConnectedProviders(providers);
      setLoading(false);
    };

    fetchUserData();
  }, [session]);

  const calculateUsage = (requestCount: number, plan: string): string => {
    if (plan === "enterprise") return "Unlimited";
    const limit = plan === "free" ? 50 : 500;
    return `${((requestCount / limit) * 100).toFixed(2)}%`;
  };

  const handleNameChange = async () => {
    if (session?.user?.email) {
      const res = await fetch("/api/updateUserData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email, name }),
      });
      if (res.ok) {
        setNameEditMode(false);
        setUserData((prevData) => (prevData ? { ...prevData, name } : prevData));
      } else {
        console.error("Failed to update name");
      }
    }
  };

  const handleProviderLink = async (provider: "google" | "github") => {
    const providerInstance =
      provider === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();
    const user = auth.currentUser;

    if (user) {
      try {
        await linkWithPopup(user, providerInstance);
        await connectProvider(user.email || "", provider);
        setConnectedProviders((prev) => [...prev, provider]);
        alert(`Successfully linked to ${provider}`);
      } catch (error) {
        console.error("Error linking provider:", error);
        alert("Failed to link provider");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!session) return <button onClick={() => signIn()}>Sign In</button>;

  return (
    <div>
      <h1>Profile</h1>
      <div>
        <label>Name:</label>
        {nameEditMode ? (
          <input value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          <span>{name}</span>
        )}
        <button onClick={nameEditMode ? handleNameChange : () => setNameEditMode(true)}>
          {nameEditMode ? "Save" : "Edit"}
        </button>
      </div>
      <div>Email: {session.user?.email}</div>
      <div>Plan: {userData?.plan}</div>
      <div>Request Count: {userData?.requestCount}</div>
      <div>Usage: {calculateUsage(userData?.requestCount || 0, userData?.plan || "free")}</div>
      <div>
        Connected Providers:
        {connectedProviders.map((provider) => (
          <div key={provider}>{provider}</div>
        ))}
      </div>
      <button onClick={() => handleProviderLink("google")}>Link Google</button>
      <button onClick={() => handleProviderLink("github")}>Link GitHub</button>
      <button onClick={() => signOut(auth)}>Sign Out</button>
    </div>
  );
};

export default ProfilePage;
