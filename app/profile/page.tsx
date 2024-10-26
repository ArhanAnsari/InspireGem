// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  getAuth,
  signOut,
  updateProfile,
  User,
  linkWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import {
  getUserData,
  updateUserData,
  connectProvider,
  getConnectedProviders,
} from "@/firebaseFunctions";
import { useSession, signIn } from "next-auth/react";

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
      await updateUserData(user.email!, { ...userData, name } as UserData);
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
      provider === "google"
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();

    try {
      await linkWithPopup(user, providerInstance);
      await connectProvider(user.email!, provider);
      alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} has been successfully linked to your account.`);
      setConnectedProviders((prev) => [...prev, provider]);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "auth/credential-already-in-use") {
        alert("This account is already linked to your current profile.");
      } else {
        console.error("Error linking provider:", error);
        alert("Failed to link provider. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="text-center text-lg mt-20">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="text-center mt-20">
        <p>Please sign in to view your profile.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile Page</h1>
      <div className="space-y-4">
        <div className="p-4 border-b">
          <p className="text-lg"><strong>Email:</strong> {user?.email}</p>
          <p className="text-lg"><strong>Plan:</strong> {userData?.plan}</p>
          <p className="text-lg"><strong>Request Count:</strong> {userData?.requestCount}</p>
          <p className="text-lg"><strong>Usage:</strong> {calculateUsage(userData?.requestCount || 0, userData?.plan || "free")}</p>
        </div>
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <strong className="text-lg">Name:</strong>
            {nameEditMode ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded px-2 py-1"
                  placeholder="Enter new name"
                />
                <button
                  onClick={handleNameChange}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setNameEditMode(false)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{name || "Not set"}</span>
                <button
                  onClick={() => setNameEditMode(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold mb-2">Connect Providers:</h3>
          <div className="space-x-2">
            <button
              onClick={() => handleProviderLink("google")}
              disabled={connectedProviders.includes("google")}
              className={`px-4 py-2 rounded ${
                connectedProviders.includes("google") ? "bg-gray-400" : "bg-green-500"
              } text-white`}
            >
              {connectedProviders.includes("google") ? "Google (Connected)" : "Connect Google"}
            </button>
            <button
              onClick={() => handleProviderLink("github")}
              disabled={connectedProviders.includes("github")}
              className={`px-4 py-2 rounded ${
                connectedProviders.includes("github") ? "bg-gray-400" : "bg-black"
              } text-white`}
            >
              {connectedProviders.includes("github") ? "GitHub (Connected)" : "Connect GitHub"}
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded block mx-auto"
      >
        Sign Out
      </button>
    </div>
  );
};

export default ProfilePage;
