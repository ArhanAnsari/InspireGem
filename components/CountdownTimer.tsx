"use client";

import React, { useState, useEffect } from "react";

type CountdownTimerProps = {
  offerEndDate: string;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ offerEndDate }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(offerEndDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (isNaN(end)) {
        setTimeLeft("Invalid date!");
        return;
      }

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft("Offer expired!");
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [offerEndDate]);

  return <div className="text-lg font-bold text-red-600 mt-4">{timeLeft}</div>;
};

export default CountdownTimer;
