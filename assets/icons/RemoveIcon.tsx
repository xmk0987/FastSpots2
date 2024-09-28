import React from "react";
import { getIconStyle } from "./iconStyles";
import { IconProps } from "./iconTypes";

const RemoveIcon: React.FC<IconProps> = ({ size = "24px", color = null }) => {
  const style = getIconStyle(color);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      style={style}
    >
      <path d="M200-440v-80h560v80H200Z" />
    </svg>
  );
};

export default RemoveIcon;
