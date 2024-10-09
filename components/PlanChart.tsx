"use client";

import React from "react";
import { Chart } from "react-chartjs-2";

interface PlanChartProps {
  userPlan: string;
}

const PlanChart: React.FC<PlanChartProps> = ({ userPlan }) => {
  const getData = () => {
    switch (userPlan) {
      case "Pro":
        return [50, 500, 0];
      case "Enterprise":
        return [50, 500, Infinity];
      default:
        return [50, 0, 0];
    }
  };

  const chartData = {
    labels: ["Free Plan", "Pro Plan", "Enterprise Plan"],
    datasets: [
      {
        label: "Your Plan",
        data: getData(),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return <Chart type="bar" data={chartData} />;
};

export default PlanChart;
