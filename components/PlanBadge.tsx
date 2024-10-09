import { useEffect, useState } from 'react';
import { getUserData } from '@/firebaseFunctions'; // Import getUserData from firebaseFunctions

interface PlanBadgeProps {
  email: string;
}

const PlanBadge = ({ email }: PlanBadgeProps) => {
  const [userData, setUserData] = useState<{ plan: string; usage: number } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData(email);
      setUserData(data);
    };

    fetchUserData();
  }, [email]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const planConfig = {
    free: { text: 'Free Plan', color: 'gray' },
    pro: { text: 'Pro Plan', color: 'blue' },
    enterprise: { text: 'Enterprise Plan', color: 'green' },
  };

  // Use type assertion to ensure TypeScript recognizes userData.plan as a valid key
  const { text, color } = planConfig[userData.plan as keyof typeof planConfig] || planConfig['free'];

  return (
    <div style={{ backgroundColor: color, padding: '10px', borderRadius: '5px' }}>
      <strong>{text}</strong>
      <p>Usage: {userData.usage}</p>
    </div>
  );
};

export default PlanBadge;
