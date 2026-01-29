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
import { AnimatedSubtitle } from "../components/AnimatedSubtitle";
import { COLORS, FONTS, SUBTITLES } from "../constants";

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
        marginBottom: 16,
        transform: `scale(${scale})`,
        transformOrigin: isUser ? "right center" : "left center",
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "16px 20px",
          borderRadius: 20,
          backgroundColor: isUser ? COLORS.iMessageBlue : COLORS.iMessageGray,
          color: isUser ? "#fff" : "#000",
          fontFamily: FONTS.primary,
          fontSize: 32,
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

// 桌面文件动画组件
const DesktopFiles: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const files = [
    { name: "report.pdf", icon: "📄", targetX: 50, targetY: 50 },
    { name: "photo.jpg", icon: "🖼️", targetX: 150, targetY: 50 },
    { name: "notes.txt", icon: "📝", targetX: 250, targetY: 50 },
    { name: "video.mp4", icon: "🎬", targetX: 50, targetY: 150 },
    { name: "music.mp3", icon: "🎵", targetX: 150, targetY: 150 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 400,
        left: 80,
        right: 80,
        height: 300,
        backgroundColor: "rgba(30,30,30,0.9)",
        borderRadius: 16,
        padding: 20,
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#FF5F56" }} />
        <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#FFBD2E" }} />
        <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#27CA40" }} />
      </div>
      <div style={{ position: "relative", width: "100%", height: 200 }}>
        {files.map((file, index) => {
          const delay = index * 8;
          const progress = spring({
            frame: relativeFrame - delay,
            fps,
            config: { damping: 60, mass: 0.8 },
          });

          const startX = 400 + Math.random() * 200 - 100;
          const startY = 100 + Math.random() * 100;
          const x = interpolate(progress, [0, 1], [startX, file.targetX]);
          const y = interpolate(progress, [0, 1], [startY, file.targetY]);

          return (
            <div
              key={file.name}
              style={{
                position: "absolute",
                left: x,
                top: y,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 40 }}>{file.icon}</span>
              <span
                style={{
                  fontSize: 14,
                  color: COLORS.text,
                  fontFamily: FONTS.primary,
                }}
              >
                {file.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Scene1iMessage: React.FC = () => {
  // 前5秒留白后显示字幕
  const subtitleStartFrames = [150, 180, 230]; // 5秒后开始

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        padding: 40,
      }}
    >
      {/* iPhone 框架 */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 400,
          backgroundColor: "#1C1C1E",
          borderRadius: 40,
          padding: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* 状态栏 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
            color: COLORS.text,
            fontSize: 14,
            fontFamily: FONTS.primary,
          }}
        >
          <span>9:41</span>
          <div style={{ display: "flex", gap: 4 }}>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* iMessage 标题 */}
        <div
          style={{
            textAlign: "center",
            padding: "16px 0",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: COLORS.qiniuBlue,
              margin: "0 auto 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            🤖
          </div>
          <div style={{ color: COLORS.text, fontSize: 20, fontFamily: FONTS.primary }}>
            Moltbot
          </div>
        </div>

        {/* 消息区域 */}
        <div style={{ padding: "20px 16px", minHeight: 200 }}>
          <Sequence from={30}>
            <MessageBubble text="整理桌面" isUser={true} startFrame={0} />
          </Sequence>
        </div>
      </div>

      {/* 桌面文件整理动画 */}
      <DesktopFiles startFrame={90} />

      {/* 字幕 */}
      {SUBTITLES.scene1.map((text, index) => (
        <AnimatedSubtitle
          key={index}
          text={text}
          startFrame={subtitleStartFrames[index]}
        />
      ))}
    </AbsoluteFill>
  );
};
