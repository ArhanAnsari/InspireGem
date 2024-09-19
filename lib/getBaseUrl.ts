const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? `https://localhost:3000`
    : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  process.env.NODE_ENV === "production"
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `https://inspiregem.vercel.app`;

export default getBaseUrl;
