import React from "react";
import { Bar } from "react-chartjs-2";

type PlanChartProps = {
  userPlan: string;
};

const PlanChart: React.FC<PlanChartProps> = ({ userPlan }) => {
  const data = {
    labels: ["Free", "Pro", "Enterprise"],
    datasets: [
      {
        label: "Requests per Month",
        data: [50, 500, 1000], // Adjust the data for your plans
        backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe"],
        borderColor: ["#ff6384", "#36a2eb", "#cc65fe"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Plan Comparison</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default PlanChart;
