"use client";

import React from "react";

type PlanBadgeProps = {
  plan: string;
};

const PlanBadge: React.FC<PlanBadgeProps> = ({ plan }) => {
  const planConfig = {
    free: { text: "Starter", color: "bg-gray-500" },
    pro: { text: "Pro User", color: "bg-green-500" },
    enterprise: { text: "AI Enthusiast", color: "bg-red-500" },
  };

  const { text, color } = planConfig[plan] || planConfig.free;

  return (
    <div className={`inline-block px-4 py-2 rounded-full text-white ${color}`}>
      {text}
    </div>
  );
};

export default PlanBadge;
