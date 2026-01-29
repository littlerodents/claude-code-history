import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONTS, ANIMATION } from "../constants";

interface AnimatedSubtitleProps {
  text: string;
  startFrame?: number;
  style?: React.CSSProperties;
}

export const AnimatedSubtitle: React.FC<AnimatedSubtitleProps> = ({
  text,
  startFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  const opacity = interpolate(
    relativeFrame,
    [0, ANIMATION.fadeInDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateY = interpolate(
    relativeFrame,
    [0, ANIMATION.fadeInDuration],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (relativeFrame < 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 150,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 40px",
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      <p
        style={{
          fontFamily: FONTS.primary,
          fontSize: 48,
          color: COLORS.text,
          textAlign: "center",
          lineHeight: 1.4,
          textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
};
