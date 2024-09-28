import React from "react";
import { getIconStyle } from "./iconStyles";
import { IconProps } from "./iconTypes";

const RepeatIcon: React.FC<IconProps> = ({ size = "24px", color = null }) => {
  const style = getIconStyle(color);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      style={style}
    >
      <path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z" />
    </svg>
  );
};

export default RepeatIcon;
