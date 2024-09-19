// utils/planLimits.ts
export async function checkUserPlanLimit(email: string | null) {
  if (!email) return false;

  // Fetch the user data from your database
  const userData = await fetch(`/api/user-data?email=${email}`).then(res => res.json());

  const { plan, requestsMade } = userData;
  
  // Define limits based on plan
  const planLimits = {
    free: 20,
    pro: 200,
    enterprise: Infinity,
  };

  // Check if the user has exceeded their plan's limit
  return requestsMade < planLimits[plan];
}
