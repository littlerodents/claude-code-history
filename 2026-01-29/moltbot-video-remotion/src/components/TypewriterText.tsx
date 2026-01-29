import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS, ANIMATION } from "../constants";

interface TypewriterTextProps {
  text: string;
  startFrame?: number;
  speed?: number;
  style?: React.CSSProperties;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  speed = ANIMATION.typewriterSpeed,
  style,
  showCursor = true,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) {
    return null;
  }

  const charsToShow = Math.min(
    text.length,
    Math.floor(relativeFrame / speed)
  );
  const displayText = text.slice(0, charsToShow);
  const isTypingDone = charsToShow >= text.length;
  const cursorVisible = showCursor && (relativeFrame % 30 < 15 || !isTypingDone);

  return (
    <span
      style={{
        fontFamily: FONTS.primary,
        fontSize: 32,
        color: COLORS.text,
        ...style,
      }}
    >
      {displayText}
      {cursorVisible && (
        <span
          style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            backgroundColor: COLORS.text,
            marginLeft: 2,
            verticalAlign: "text-bottom",
          }}
        />
      )}
    </span>
  );
};
