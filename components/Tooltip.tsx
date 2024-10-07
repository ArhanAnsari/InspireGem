import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

type TooltipProps = {
  content: string;
  children: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute left-0 w-48 bg-black text-white text-xs rounded-lg px-3 py-2 invisible group-hover:visible transition-opacity duration-300 z-10">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
