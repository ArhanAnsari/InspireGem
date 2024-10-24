//app/profile/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getUserData, updateUserData, connectProvider, getConnectedProviders } from "../../firebaseFunctions";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { adminStorage } from "../../firebaseAdmin";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const data = await getUserData(currentUser.email!);
        setUserData(data);
        const providers = await getConnectedProviders(currentUser.email!);
        setConnectedProviders(providers);
        // Fetch profile photo URL
        const storageRef = adminStorage.bucket().file(`profile_photos/${currentUser.uid}`);
        storageRef.getSignedUrl({ action: 'read', expires: '03-17-2025' })
          .then(urls => setProfilePhoto(urls[0]))
          .catch(error => console.error("Error fetching profile photo:", error));
      } else {
        router.push("/auth/signin");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleProfilePhotoUpload = async () => {
    if (!newProfilePhoto || !user) return;

    const storageRef = adminStorage.bucket().file(`profile_photos/${user.uid}`);
    const metadata = {
      contentType: newProfilePhoto.type,
    };

    try {
      await storageRef.save(newProfilePhoto, metadata);
      const url = await storageRef.getSignedUrl({ action: 'read', expires: '03-17-2025' });
      setProfilePhoto(url[0]);
    } catch (error) {
      console.error("Error uploading profile photo:", error);
    }
  };

  const handleProviderConnect = async (provider: string) => {
    if (user) {
      try {
        await connectProvider(user.email!, provider);
        setConnectedProviders([...connectedProviders, provider]);
      } catch (error) {
        console.error(`Error connecting ${provider}:`, error);
      }
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => router.push("/auth/signin"))
      .catch((error) => console.error("Error signing out:", error));
  };

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      {user && (
        <div>
          <div className="profile-photo-section">
            <img src={profilePhoto || "/default-profile.png"} alt="Profile" width={150} height={150} />
            <input type="file" accept="image/*" onChange={(e) => setNewProfilePhoto(e.target.files?.[0] || null)} />
            <button onClick={handleProfilePhotoUpload}>Upload New Photo</button>
          </div>
          <div className="user-info">
            <p>Email: {user.email}</p>
            <p>Request Count: {userData?.requestCount || 0}</p>
            <p>Usage: {userData?.usage || 0}%</p>
          </div>
          <div className="connected-providers">
            <h3>Connected Providers</h3>
            <ul>
              {connectedProviders.map((provider, index) => (
                <li key={index}>{provider}</li>
              ))}
            </ul>
            <button onClick={() => handleProviderConnect("google")}>Connect to Google</button>
            <button onClick={() => handleProviderConnect("github")}>Connect to GitHub</button>
          </div>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
