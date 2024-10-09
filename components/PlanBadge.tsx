"use client";

import React from "react";

type PlanType = 'free' | 'pro' | 'enterprise';

interface PlanConfig {
  [key: string]: { text: string; color: string };
}

const PlanBadge = ({ plan }: { plan: PlanType }) => {
  const planConfig: PlanConfig = {
    free: { text: 'Free Plan', color: 'gray' },
    pro: { text: 'Pro Plan', color: 'blue' },
    enterprise: { text: 'Enterprise Plan', color: 'green' },
  };

  const { text, color } = planConfig[plan] || planConfig['free'];

  return (
    <div style={{ backgroundColor: color }}>
      {text}
    </div>
  );
};

export default PlanBadge;
