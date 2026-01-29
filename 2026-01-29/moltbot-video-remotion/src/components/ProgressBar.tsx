import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

interface ProgressBarProps {
  startFrame?: number;
  duration?: number;
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  startFrame = 0,
  duration = 60,
  width = 600,
  height = 12,
  color = COLORS.qiniuBlue,
  backgroundColor = "rgba(255,255,255,0.2)",
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) {
    return null;
  }

  const progress = interpolate(
    relativeFrame,
    [0, duration],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scaleIn = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 100, mass: 0.5 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        transform: `scale(${scaleIn})`,
      }}
    >
      {label && (
        <div
          style={{
            fontSize: 24,
            color: COLORS.textSecondary,
            fontFamily: "PingFang SC, sans-serif",
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          width,
          height,
          backgroundColor,
          borderRadius: height / 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: height / 2,
            boxShadow: `0 0 20px ${color}`,
          }}
        />
      </div>
      <div
        style={{
          fontSize: 20,
          color: COLORS.text,
          fontFamily: "SF Mono, monospace",
        }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
};
