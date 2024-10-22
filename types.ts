// /types.ts

export interface UserData {
  name: string;
  email: string;
  plan: Plan;
  requestCount: number;
}

export type Plan = "free" | "pro" | "enterprise";
