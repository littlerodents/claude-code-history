import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { AnimatedSubtitle } from "../components/AnimatedSubtitle";
import { COLORS, FONTS, SUBTITLES } from "../constants";

// 模型卡片组件
const ModelCard: React.FC<{
  name: string;
  icon: string;
  color: string;
  description: string;
  startFrame: number;
  index: number;
}> = ({ name, icon, color, description, startFrame, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const scale = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 60, mass: 0.8 },
  });

  // 发光效果
  const glowIntensity = interpolate(
    (frame + index * 20) % 60,
    [0, 30, 60],
    [0.5, 1, 0.5]
  );

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        padding: 24,
        backgroundColor: "rgba(30,30,30,0.9)",
        borderRadius: 20,
        border: `2px solid ${color}`,
        boxShadow: `0 0 ${30 * glowIntensity}px ${color}`,
        width: 280,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 64,
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 28,
          color: COLORS.text,
          fontWeight: 600,
          fontFamily: FONTS.primary,
          marginBottom: 8,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: 16,
          color: COLORS.textSecondary,
          fontFamily: FONTS.primary,
        }}
      >
        {description}
      </div>
    </div>
  );
};

export const Scene4ModelMarket: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 背景渐暗效果
  const bgOpacity = interpolate(frame, [0, 60], [0.3, 0.1], {
    extrapolateRight: "clamp",
  });

  // 标题动画
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 80 },
  });

  // 模型数据
  const models = [
    {
      name: "DeepSeek",
      icon: "🔍",
      color: COLORS.deepSeekBlue,
      description: "国产顶级推理模型",
    },
    {
      name: "通义千问",
      icon: "🧠",
      color: COLORS.qwenPurple,
      description: "阿里巴巴大模型",
    },
    {
      name: "GLM-4",
      icon: "💎",
      color: "#10B981",
      description: "智谱 AI 旗舰",
    },
    {
      name: "Llama 3",
      icon: "🦙",
      color: "#F59E0B",
      description: "Meta 开源模型",
    },
  ];

  // 字幕时间点
  const subtitleStartFrames = [30, 150];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* 背景光效 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          background: `radial-gradient(circle, rgba(0,102,255,${bgOpacity}) 0%, transparent 70%)`,
          borderRadius: "50%",
        }}
      />

      {/* 标题 */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${titleScale})`,
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: COLORS.qiniuBlue,
            fontFamily: FONTS.primary,
            marginBottom: 12,
          }}
        >
          七牛云
        </div>
        <div
          style={{
            fontSize: 48,
            color: COLORS.text,
            fontWeight: 700,
            fontFamily: FONTS.primary,
          }}
        >
          大模型广场
        </div>
        <div
          style={{
            fontSize: 24,
            color: COLORS.textSecondary,
            fontFamily: FONTS.primary,
            marginTop: 12,
          }}
        >
          一站式接入主流 AI 模型
        </div>
      </div>

      {/* 模型卡片网格 */}
      <div
        style={{
          position: "absolute",
          top: 350,
          left: 40,
          right: 40,
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
        }}
      >
        {models.map((model, index) => (
          <ModelCard
            key={model.name}
            {...model}
            startFrame={30 + index * 15}
            index={index}
          />
        ))}
      </div>

      {/* 底部标语 */}
      <div
        style={{
          position: "absolute",
          bottom: 250,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: COLORS.textSecondary,
            fontFamily: FONTS.primary,
          }}
        >
          统一 API · 按量计费 · 无缝切换
        </div>
      </div>

      {/* 字幕 */}
      {SUBTITLES.scene4.map((text, index) => (
        <AnimatedSubtitle
          key={index}
          text={text}
          startFrame={subtitleStartFrames[index]}
        />
      ))}
    </AbsoluteFill>
  );
};
