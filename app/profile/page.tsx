//app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getAuth, signOut, updateProfile, User, linkWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { useSession, signIn } from "next-auth/react";
import { getConnectedProviders, connectProvider } from "@/firebaseFunctions";

interface UserData {
  plan: "free" | "pro" | "enterprise";
  requestCount: number;
  name?: string;
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [nameEditMode, setNameEditMode] = useState(false);
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;

      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || "");

        try {
          const response = await fetch(`/api/getUserData?email=${currentUser.email}`);
          const data = await response.json();
          setUserData(data ?? { plan: "free", requestCount: 0, name: currentUser.displayName || "" });

          const providers = await getConnectedProviders(currentUser.email!);
          setConnectedProviders(providers);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [auth, session]);

  const calculateUsage = (requestCount: number, plan: string): string => {
    if (plan === "enterprise") return "Unlimited";
    const totalLimit = plan === "free" ? 50 : 500;
    return ((requestCount / totalLimit) * 100).toFixed(2) + "%";
  };

  const handleNameChange = async () => {
    if (!user) return;

    try {
      await updateProfile(user, { displayName: name });
      await fetch(`/api/updateUserData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email!, userData: { ...userData, name } }),
      });
      setUserData((prev) => (prev ? { ...prev, name } : prev));
      setNameEditMode(false);
      alert("Name updated successfully!");
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name. Please try again.");
    }
  };

  const handleSignOut = () => signOut(auth).catch((error) => console.error("Sign out error:", error));

  const handleProviderLink = async (provider: "google" | "github") => {
    if (!user) return;

    const providerInstance = provider === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();
    try {
      await linkWithPopup(user, providerInstance);
      await connectProvider(user.email!, provider);
      alert(`${provider} linked successfully.`);
      setConnectedProviders((prev) => [...prev, provider]);
    } catch (error: unknown) {
      if ((error as { code?: string }).code === "auth/credential-already-in-use") {
        alert("This account is already linked to your profile.");
      } else {
        console.error("Error linking provider:", error);
        alert("Failed to link provider. Please try again.");
      }
    }
  };

  if (loading) return <div className="text-center text-lg mt-20">Loading...</div>;
  if (!session) {
    return (
      <div className="text-center text-lg mt-20">
        <button onClick={() => signIn()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 pt-6">
      <h1 className="text-3xl mb-4">Profile</h1>
      <div className="flex justify-between mb-4">
        <span className="text-lg">Name:</span>
        {nameEditMode ? (
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
        ) : (
          <span className="text-lg">{name}</span>
        )}
        {nameEditMode ? (
          <button onClick={handleNameChange} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
        ) : (
          <button onClick={() => setNameEditMode(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Edit
          </button>
        )}
      </div>
      <div className="flex justify-between mb-4">
        <span className="text-lg">Email:</span>
        <span className="text-lg">{user?.email}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span className="text-lg">Plan:</span>
        <span className="text-lg">{userData?.plan}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span className="text-lg">Request Count:</span>
        <span className="text-lg">{userData?.requestCount}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span className="text-lg">Usage:</span>
        <span className="text-lg">{calculateUsage(userData?.requestCount ?? 0, userData?.plan ?? "free")}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span className="text-lg">Connected Providers:</span>
        <ul>{connectedProviders.map((provider) => <li key={provider}>{provider.charAt(0).toUpperCase() + provider.slice(1)}</li>)}</ul>
      </div>
      <div className="flex justify-between mb-4">
        <button onClick={() => handleProviderLink("google")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Link Google
        </button>
        <button onClick={() => handleProviderLink("github")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Link GitHub
        </button>
      </div>
      <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Sign Out
      </button>
    </div>
  );
};

export default ProfilePage;
