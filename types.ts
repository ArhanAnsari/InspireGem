// /types.ts

export interface UserData {
  name: string;
  email: string;
  plan: "free" | "pro" | "enterprise";
  requestCount: number;
}

export type Plan = "free" | "pro" | "enterprise";
