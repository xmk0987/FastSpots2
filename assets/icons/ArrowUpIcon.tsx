import React from "react";
import { getIconStyle } from "./iconStyles";
import { IconProps } from "./iconTypes";

const ArrowUpIcon: React.FC<IconProps> = ({ size = "24px", color = null }) => {
  const style = getIconStyle(color);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      style={style}
    >
      <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z" />
    </svg>
  );
};

export default ArrowUpIcon;
