import React from "react";
import { Pie } from "react-chartjs-2";

type PlanChartProps = {
  currentPlan: string;
  requestUsage: number;
  maxRequests: number;
};

const PlanChart: React.FC<PlanChartProps> = ({ currentPlan, requestUsage, maxRequests }) => {
  const data = {
    labels: ["Requests Used", "Requests Remaining"],
    datasets: [
      {
        label: "Request Usage",
        data: [requestUsage, maxRequests - requestUsage],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <h3 className="text-xl font-semibold mb-4">Plan Usage for {currentPlan} Plan</h3>
      <Pie data={data} />
    </div>
  );
};

export default PlanChart;
