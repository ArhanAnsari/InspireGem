// components/ToastNotification.tsx
"use client"; // Ensure this is a client-side component

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notify = (message: string, type: "success" | "error" = "success") => {
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
};

const ToastNotification: React.FC = () => {
  return <ToastContainer position="top-right" autoClose={5000} hideProgressBar />;
};

export default ToastNotification;
