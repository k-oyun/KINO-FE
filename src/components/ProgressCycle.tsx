// components/ProgressCircle.tsx

import React from "react";

interface ProgressCircleProps {
  progress: number; // 0~100
  size?: number; // default 48
  color?: string; // default "#f06292"
  bgColor?: string; // default "rgba(0,0,0,0.5)"
  style?: React.CSSProperties;
}

const ProgressCircle = ({
  progress,
  size = 48,
  color = "#f06292",
  bgColor = "rgba(0,0,0,0.5)",
  style = {},
}: ProgressCircleProps) => {
  const r = size / 2 - 4;
  const c = size / 2;
  const strokeWidth = 5;
  const dash = 2 * Math.PI * r;
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 30,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgColor,
        ...style,
      }}
    >
      <svg width={size} height={size}>
        <circle
          cx={c}
          cy={c}
          r={r}
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={c}
          cy={c}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={dash}
          strokeDashoffset={dash * (1 - progress / 100)}
          style={{
            transition: "stroke-dashoffset 0.1s linear",
          }}
        />
      </svg>
    </div>
  );
};

export default ProgressCircle;
