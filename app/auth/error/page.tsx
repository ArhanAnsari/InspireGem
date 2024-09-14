// app/auth/error/page.tsx
"use client";
import Link from "next/link";

export default function Error() {
  return (
    <div>
      <h1>Error</h1>
      <p>Something went wrong during the authentication process.</p>
      <Link href="/auth/signin">Go back to Sign In</Link>
    </div>
  );
}
