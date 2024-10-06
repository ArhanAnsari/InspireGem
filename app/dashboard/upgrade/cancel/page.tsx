"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /dashboard/upgrade on page load
    router.push("/dashboard/upgrade");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-gray-600">Redirecting to the upgrade page...</p>
    </div>
  );
}
