// app/profile/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserData, updateUserData, Plan } from "@/firebaseFunctions"; 
import { UserData } from "@/types";

const ProfilePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      // Redirect unauthenticated users to the signin page
      router.push("/auth/signin");
      return;
    }

    const fetchData = async () => {
      const userEmail = session.user?.email || "";
      const data = await getUserData(userEmail);
      if (data) {
        setUserData(data);
      } else {
        console.error("No user data found");
      }
      setLoading(false);
    };

    fetchData();
  }, [session, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Error loading user data.</div>;
  }

  // Calculate usage percentage
  const { requestCount, plan } = userData;
  const planLimit = plan === "free" ? 50 : plan === "pro" ? 500 : null;
  const usagePercentage = planLimit ? (requestCount / planLimit) * 100 : "Unlimited";

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <strong>Name:</strong> {userData.name}
      </div>
      <div className="mb-4">
        <strong>Email:</strong> {userData.email}
      </div>
      <div className="mb-4">
        <strong>Plan:</strong> {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </div>
      <div className="mb-4">
        <strong>Request Count:</strong> {requestCount}
      </div>
      <div className="mb-4">
        <strong>Usage:</strong>{" "}
        {typeof usagePercentage === "string" ? usagePercentage : `${usagePercentage.toFixed(2)}%`}
      </div>
    </div>
  );
};

export default ProfilePage;
