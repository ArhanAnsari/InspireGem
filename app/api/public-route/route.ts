// app/api/public-route/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const response = {
    message: "This is a public route. No authentication required.",
    status: "success",
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response, { status: 200 });
}
