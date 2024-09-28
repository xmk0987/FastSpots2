import React from "react";
import { getIconStyle } from "./iconStyles";
import { IconProps } from "./iconTypes";

const SkipNextIcon: React.FC<IconProps> = ({ size = "24px", color = null }) => {
  const style = getIconStyle(color);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      style={style}
    >
      <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z" />
    </svg>
  );
};

export default SkipNextIcon;
