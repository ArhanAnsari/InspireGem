// utils/planLimits.ts
const planLimits = {
  free: 20,
  pro: 200,
  enterprise: Infinity, // Unlimited requests for enterprise
};

export async function checkUserPlanLimit(email: string | null) {
  if (!email) return false; // No email means no user, so block access

  // Fetch user's plan from your database
  const userPlan = await getUserPlanByEmail(email);

  // Ensure the plan is one of the valid plan types
  const plan = userPlan as keyof typeof planLimits;

  // Fetch the number of requests the user has already made
  const requestsMade = await getUserRequestsMade(email);

  // Check if the user has exceeded their plan's limit
  return requestsMade < planLimits[plan];
}

async function getUserPlanByEmail(email: string) {
  // Fetch user plan logic (replace this with actual logic)
  // Example: return "pro" for pro plan
  return "pro"; // Replace with real implementation
}

async function getUserRequestsMade(email: string) {
  // Fetch the number of requests user has made (replace this with actual logic)
  return 100; // Replace with real implementation
}
