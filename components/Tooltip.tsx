"use client";

import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface TooltipProps {
  id: string;
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ id, text, children }) => (
  <>
    <span className="relative cursor-pointer underline" data-tooltip-id={id} data-tooltip-content={text} aria-label={text}>
      {children}
    </span>
    <ReactTooltip id={id} />
  </>
);

export default Tooltip;
