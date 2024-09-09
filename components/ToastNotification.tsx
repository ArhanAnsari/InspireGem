// components/ToastNotification.tsx
"use client"; // Make this a client-side component

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notify = (message: string, type: "success" | "error") => {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  }
};

const ToastNotification = () => {
  return <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable pauseOnFocusLoss />;
};

export default ToastNotification;
