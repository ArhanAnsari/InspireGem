"use client";

import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Plan Comparison',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default PlanChart;
