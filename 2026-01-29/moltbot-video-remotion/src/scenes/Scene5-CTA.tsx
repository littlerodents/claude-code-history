import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";
import { AnimatedSubtitle } from "../components/AnimatedSubtitle";
import { COLORS, FONTS, SUBTITLES } from "../constants";

// 大字标题组件
const BigTitle: React.FC<{
  text: string;
  startFrame: number;
  color?: string;
  fontSize?: number;
}> = ({ text, startFrame, color = COLORS.text, fontSize = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const scale = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 50, mass: 1, stiffness: 150 },
  });

  // 发光脉冲效果
  const glowIntensity = interpolate(
    relativeFrame % 40,
    [0, 20, 40],
    [1, 1.5, 1]
  );

  return (
    <div
      style={{
        fontSize,
        fontWeight: 900,
        color,
        fontFamily: FONTS.primary,
        transform: `scale(${scale})`,
        textShadow: `0 0 ${60 * glowIntensity}px ${color}`,
        letterSpacing: 8,
      }}
    >
      {text}
    </div>
  );
};

// 闪烁标签组件
const FlashingTag: React.FC<{
  text: string;
  startFrame: number;
}> = ({ text, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const scale = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 80 },
  });

  const flashOpacity = interpolate(
    relativeFrame % 30,
    [0, 15, 30],
    [0.7, 1, 0.7]
  );

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        padding: "16px 40px",
        backgroundColor: "#FF3B30",
        borderRadius: 12,
        fontSize: 36,
        fontWeight: 700,
        color: "#fff",
        fontFamily: FONTS.primary,
        opacity: flashOpacity,
        boxShadow: "0 0 30px rgba(255,59,48,0.5)",
      }}
    >
      {text}
    </div>
  );
};

// 指向动画组件
const PointingHand: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  // 上下浮动动画
  const bounceY = interpolate(
    relativeFrame % 30,
    [0, 15, 30],
    [0, -15, 0]
  );

  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontSize: 80,
        transform: `translateY(${bounceY}px) rotate(-45deg)`,
        opacity,
      }}
    >
      👉
    </div>
  );
};

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 背景渐变动画
  const bgHue = interpolate(frame, [0, 300], [220, 260], {
    extrapolateRight: "clamp",
  });

  // 字幕时间点
  const subtitleStartFrames = [30, 120, 200];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, hsl(${bgHue}, 80%, 8%) 0%, #000 100%)`,
      }}
    >
      {/* 背景光效 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 50% 30%, rgba(0,102,255,0.2) 0%, transparent 60%)",
        }}
      />

      {/* 主标题区域 */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* 百亿 Token */}
        <Sequence from={0}>
          <BigTitle
            text="百亿 Token"
            startFrame={0}
            color={COLORS.qiniuBlue}
            fontSize={100}
          />
        </Sequence>

        {/* 限时免费 */}
        <Sequence from={45}>
          <FlashingTag text="限时免费" startFrame={0} />
        </Sequence>
      </div>

      {/* 七牛云 Logo */}
      <Sequence from={90}>
        <div
          style={{
            position: "absolute",
            top: 550,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
            transform: `scale(${spring({ frame: frame - 90, fps, config: { damping: 80 } })})`,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              backgroundColor: COLORS.qiniuBlue,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
            }}
          >
            ☁️
          </div>
          <div
            style={{
              fontSize: 48,
              color: COLORS.text,
              fontWeight: 600,
              fontFamily: FONTS.primary,
            }}
          >
            七牛云
          </div>
        </div>
      </Sequence>

      {/* 评论区引导 */}
      <Sequence from={150}>
        <div
          style={{
            position: "absolute",
            top: 750,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: COLORS.textSecondary,
              fontFamily: FONTS.primary,
              opacity: spring({ frame: frame - 150, fps, config: { damping: 100 } }),
            }}
          >
            点击下方链接立即领取
          </div>

          <PointingHand startFrame={30} />

          <div
            style={{
              padding: "20px 40px",
              backgroundColor: "rgba(0,102,255,0.2)",
              borderRadius: 16,
              border: `2px solid ${COLORS.qiniuBlue}`,
              fontSize: 24,
              color: COLORS.qiniuBlue,
              fontFamily: FONTS.primary,
              opacity: spring({ frame: frame - 180, fps, config: { damping: 100 } }),
            }}
          >
            📍 链接在评论区
          </div>
        </div>
      </Sequence>

      {/* 拉新福利提示 */}
      <Sequence from={220}>
        <div
          style={{
            position: "absolute",
            bottom: 200,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: spring({ frame: frame - 220, fps, config: { damping: 100 } }),
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: COLORS.accent,
              fontFamily: FONTS.primary,
            }}
          >
            🎁 拉新还有额外福利！
          </div>
        </div>
      </Sequence>

      {/* 字幕 */}
      {SUBTITLES.scene5.map((text, index) => (
        <AnimatedSubtitle
          key={index}
          text={text}
          startFrame={subtitleStartFrames[index]}
        />
      ))}
    </AbsoluteFill>
  );
};
