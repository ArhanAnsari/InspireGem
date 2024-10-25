// /types.ts

// Define the allowed plans as a union type
export type Plan = "free" | "pro" | "enterprise";

// Define an interface for the user data
export interface UserData {
  plan: Plan;
  requestCount: number;
  usage: number;
  connectedProviders: string[]; // New field to store connected providers
}
