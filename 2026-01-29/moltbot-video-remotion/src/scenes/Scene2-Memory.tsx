import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";
import { TypewriterText } from "../components/TypewriterText";
import { ProgressBar } from "../components/ProgressBar";
import { AnimatedSubtitle } from "../components/AnimatedSubtitle";
import { COLORS, FONTS, SUBTITLES } from "../constants";

// 推荐卡片组件
const RecommendationCard: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const scale = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 60, mass: 0.8, stiffness: 150 },
  });

  const glow = interpolate(
    relativeFrame % 60,
    [0, 30, 60],
    [0.5, 1, 0.5]
  );

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        padding: 24,
        backgroundColor: "rgba(40,40,40,0.95)",
        borderRadius: 24,
        border: `2px solid ${COLORS.qiniuBlue}`,
        boxShadow: `0 0 ${30 * glow}px ${COLORS.qiniuBlue}`,
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        {/* Switch 游戏卡带图标 */}
        <div
          style={{
            width: 120,
            height: 120,
            backgroundColor: "#E60012",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
          }}
        >
          🎮
          <span style={{ fontSize: 12, color: "#fff", marginTop: 4 }}>SWITCH</span>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              color: COLORS.success,
              fontFamily: FONTS.primary,
              marginBottom: 8,
            }}
          >
            ✨ AI 推荐
          </div>
          <div
            style={{
              fontSize: 24,
              color: COLORS.text,
              fontFamily: FONTS.primary,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Nintendo Switch 游戏卡
          </div>
          <div
            style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              fontFamily: FONTS.primary,
            }}
          >
            根据 Ta 的游戏偏好推荐
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: "12px 16px",
          backgroundColor: "rgba(0,102,255,0.2)",
          borderRadius: 12,
          fontSize: 14,
          color: COLORS.qiniuBlue,
          fontFamily: FONTS.primary,
        }}
      >
        💡 基于历史对话分析：Ta 喜欢任天堂游戏
      </div>
    </div>
  );
};

// iMessage 气泡组件
const MessageBubble: React.FC<{
  text: string;
  isUser: boolean;
  startFrame: number;
}> = ({ text, isUser, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const scale = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 80, mass: 0.5, stiffness: 200 },
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 12,
        transform: `scale(${scale})`,
        transformOrigin: isUser ? "right center" : "left center",
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          padding: "14px 18px",
          borderRadius: 20,
          backgroundColor: isUser ? COLORS.iMessageBlue : COLORS.iMessageGray,
          color: isUser ? "#fff" : "#000",
          fontFamily: FONTS.primary,
          fontSize: 28,
          lineHeight: 1.3,
        }}
      >
        <TypewriterText
          text={text}
          startFrame={0}
          speed={2}
          showCursor={false}
          style={{ color: isUser ? "#fff" : "#000" }}
        />
      </div>
    </div>
  );
};

export const Scene2Memory: React.FC = () => {
  // 字幕时间点 (相对于场景开始)
  const subtitleStartFrames = [30, 150, 300];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        padding: 40,
      }}
    >
      {/* iMessage 界面 */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 420,
          backgroundColor: "#1C1C1E",
          borderRadius: 36,
          padding: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* 状态栏 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 16px",
            color: COLORS.text,
            fontSize: 14,
          }}
        >
          <span>9:42</span>
          <span>🔋 📶</span>
        </div>

        {/* 聊天区域 */}
        <div style={{ padding: "16px 12px", minHeight: 180 }}>
          <Sequence from={0}>
            <MessageBubble text="我要送朋友礼物" isUser={true} startFrame={0} />
          </Sequence>
        </div>
      </div>

      {/* 分析进度条 */}
      <Sequence from={60}>
        <div
          style={{
            position: "absolute",
            top: 450,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ProgressBar
            startFrame={0}
            duration={90}
            width={700}
            height={16}
            label="🧠 Moltbot 分析中..."
            color={COLORS.qiniuBlue}
          />
        </div>
      </Sequence>

      {/* 推荐结果 */}
      <Sequence from={180}>
        <div
          style={{
            position: "absolute",
            top: 600,
            left: 40,
            right: 40,
          }}
        >
          <RecommendationCard startFrame={0} />
        </div>
      </Sequence>

      {/* 字幕 */}
      {SUBTITLES.scene2.map((text, index) => (
        <AnimatedSubtitle
          key={index}
          text={text}
          startFrame={subtitleStartFrames[index]}
        />
      ))}
    </AbsoluteFill>
  );
};
