//utils/planLimits.ts
const planLimits = {
  free: 50,
  pro: 500,
  enterprise: Infinity, // Unlimited requests for enterprise
};

export async function checkUserPlanLimit(email: string | null) {
  if (!email) return false; // No email means no user, so block access

  // Fetch user's plan from your database
  const userPlan = await getUserPlanByEmail(email);

  // Ensure the plan is one of the valid plan types, with fallback to free plan
  const plan = planLimits.hasOwnProperty(userPlan) ? userPlan : "free";

  // Fetch the number of requests the user has already made
  const requestsMade = await getUserRequestsMade(email);

  // Check if the user has exceeded their plan's limit
  return requestsMade < planLimits[plan as keyof typeof planLimits];
}

async function getUserPlanByEmail(email: string) {
  // Replace with actual logic to fetch user's plan from the database
  // Example: return "pro" for pro plan or "free" for free plan
  // Example query logic:
  // const user = await db.collection('users').findOne({ email });
  // return user ? user.plan : 'free';
  return "pro"; // Replace with real implementation
}

async function getUserRequestsMade(email: string) {
  // Replace with actual logic to fetch user's requests made from the database
  // Example: return number of requests made by the user
  // Example query logic:
  // const usage = await db.collection('requests').findOne({ email });
  // return usage ? usage.requestsMade : 0;
  return 100; // Replace with real implementation
}
