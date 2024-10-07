import React from "react";
import ReactTooltip from "react-tooltip";

const Tooltip: React.FC<{ id: string; text: string }> = ({ id, text }) => (
  <>
    <span
      className="relative cursor-pointer underline"
      data-tip={text}
      data-for={id}
    >
      ?
    </span>
    <ReactTooltip id={id} effect="solid" />
  </>
);

export default Tooltip;
