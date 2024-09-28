import React from "react";
import { getIconStyle } from "./iconStyles";
import { IconProps } from "./iconTypes";

const SkipPreviousIcon: React.FC<IconProps> = ({
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
      <path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Zm-80-240Zm0 90v-180l-136 90 136 90Z" />
    </svg>
  );
};

export default SkipPreviousIcon;
