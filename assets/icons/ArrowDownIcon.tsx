import React from "react";
import { getIconStyle } from "./iconStyles";
import { IconProps } from "./iconTypes";

const ArrowDownIcon: React.FC<IconProps> = ({
  size = "24px",
  color = null,
}) => {
  const style = getIconStyle(color);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      style={style}
    >
      <path d="M480-240 240-480l56-56 144 144v-368h80v368l144-144 56 56-240 240Z" />
    </svg>
  );
};

export default ArrowDownIcon;
