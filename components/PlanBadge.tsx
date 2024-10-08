"use client";

import React from "react";

type PlanBadgeProps = {
  plan: string;
};

const PlanBadge: React.FC<PlanBadgeProps> = ({ plan }) => {
  let badgeText = "";
  let badgeColor = "";

  switch (plan) {
    case "free":
      badgeText = "Starter";
      badgeColor = "bg-gray-500";
      break;
    case "pro":
      badgeText = "Pro User";
      badgeColor = "bg-green-500";
      break;
    case "enterprise":
      badgeText = "AI Enthusiast";
      badgeColor = "bg-red-500";
      break;
    default:
      badgeText = "Free";
      badgeColor = "bg-gray-500";
  }

  return (
    <div className={`inline-block px-4 py-2 rounded-full text-white ${badgeColor}`}>
      {badgeText}
    </div>
  );
};

export default PlanBadge;
