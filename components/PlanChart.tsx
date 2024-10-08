"use client";

import React from "react";
import { Chart } from "react-chartjs-2"; // Assuming you are using Chart.js

interface PlanChartProps {
  userPlan: string;
}

const PlanChart: React.FC<PlanChartProps> = ({ userPlan }) => {
  const chartData = {
    labels: ['Free Plan', 'Pro Plan', 'Enterprise Plan'],
    datasets: [
      {
        label: 'Your Plan',
        data: userPlan === 'Free' ? [50, 0, 0] : userPlan === 'Pro' ? [50, 500, 0] : [50, 500, Infinity],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return <Chart type="bar" data={chartData} />;
};

export default PlanChart;
