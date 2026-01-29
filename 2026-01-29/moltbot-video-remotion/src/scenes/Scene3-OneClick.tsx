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

// 终端代码滚动组件
const TerminalCode: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();

  const codeLines = [
    "$ pip install moltbot",
    "$ export OPENAI_API_KEY=sk-xxx",
    "$ export ANTHROPIC_API_KEY=xxx",
    "$ git clone https://github.com/...",
    "$ cd moltbot && npm install",
    "$ docker-compose up -d",
    "$ kubectl apply -f deployment.yaml",
    "$ terraform init && terraform apply",
    "Error: API key not found",
    "Error: Connection timeout",
    "$ npm run build -- --production",
    "$ pm2 start ecosystem.config.js",
  ];

  const scrollY = interpolate(frame, [0, 150], [0, -400], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 100,
        left: 60,
        right: 60,
        height: 500,
        backgroundColor: "#1E1E1E",
        borderRadius: 16,
        padding: 20,
        overflow: "hidden",
        opacity,
        border: "1px solid #333",
      }}
    >
      {/* 终端标题栏 */}
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
        <span style={{ color: "#666", fontSize: 14, marginLeft: 12 }}>Terminal</span>
      </div>

      {/* 代码内容 */}
      <div
        style={{
          transform: `translateY(${scrollY}px)`,
          fontFamily: FONTS.mono,
          fontSize: 18,
          lineHeight: 1.8,
        }}
      >
        {codeLines.map((line, index) => (
          <div
            key={index}
            style={{
              color: line.includes("Error") ? "#FF6B6B" : "#8BC34A",
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

// 可视化网页组件
const VisualWebpage: React.FC<{ opacity: number; showButton: boolean }> = ({
  opacity,
  showButton,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonScale = showButton
    ? spring({
        frame: frame - 300,
        fps,
        config: { damping: 60, mass: 0.8 },
      })
    : 0;

  const buttonGlow = interpolate(
    frame % 40,
    [0, 20, 40],
    [0.8, 1.2, 0.8]
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 100,
        left: 60,
        right: 60,
        height: 700,
        backgroundColor: "#0A0A0A",
        borderRadius: 24,
        padding: 32,
        opacity,
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* 七牛云 Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            backgroundColor: COLORS.qiniuBlue,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
          }}
        >
          ☁️
        </div>
        <div>
          <div style={{ fontSize: 28, color: COLORS.text, fontWeight: 600 }}>
            七牛云
          </div>
          <div style={{ fontSize: 16, color: COLORS.textSecondary }}>
            Moltbot 一键部署
          </div>
        </div>
      </div>

      {/* 配置表单 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {["选择模型", "配置内存", "设置域名"].map((label, index) => (
          <div key={index}>
            <div style={{ fontSize: 16, color: COLORS.textSecondary, marginBottom: 8 }}>
              {label}
            </div>
            <div
              style={{
                height: 48,
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                color: COLORS.text,
                fontSize: 18,
              }}
            >
              {index === 0 && "DeepSeek V3"}
              {index === 1 && "8 GB"}
              {index === 2 && "moltbot.qiniu.com"}
            </div>
          </div>
        ))}
      </div>

      {/* 一键配置按钮 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 40,
        }}
      >
        <div
          style={{
            transform: `scale(${buttonScale})`,
            padding: "24px 80px",
            backgroundColor: COLORS.qiniuBlue,
            borderRadius: 16,
            fontSize: 32,
            fontWeight: 600,
            color: "#fff",
            cursor: "pointer",
            boxShadow: `0 0 ${40 * buttonGlow}px ${COLORS.qiniuBlue}`,
            fontFamily: FONTS.primary,
          }}
        >
          🚀 一键配置
        </div>
      </div>
    </div>
  );
};

export const Scene3OneClick: React.FC = () => {
  const frame = useCurrentFrame();

  // 场景切换时间点
  const transitionStart = 150;
  const transitionEnd = 180;

  const terminalOpacity = interpolate(
    frame,
    [0, transitionStart, transitionEnd],
    [1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const webpageOpacity = interpolate(
    frame,
    [transitionStart, transitionEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 字幕时间点
  const subtitleStartFrames = [30, 180, 300];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 终端界面 (对比) */}
      <TerminalCode opacity={terminalOpacity} />

      {/* 可视化网页 (正例) */}
      <Sequence from={transitionStart}>
        <VisualWebpage opacity={webpageOpacity} showButton={frame > 280} />
      </Sequence>

      {/* "以前" / "现在" 标签 */}
      {frame < transitionEnd && (
        <div
          style={{
            position: "absolute",
            top: 650,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 24,
            color: "#FF6B6B",
            fontFamily: FONTS.primary,
          }}
        >
          ❌ 传统部署方式
        </div>
      )}

      {frame >= transitionEnd && (
        <div
          style={{
            position: "absolute",
            top: 850,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 24,
            color: COLORS.success,
            fontFamily: FONTS.primary,
            opacity: webpageOpacity,
          }}
        >
          ✅ 七牛云一键部署
        </div>
      )}

      {/* 字幕 */}
      {SUBTITLES.scene3.map((text, index) => (
        <AnimatedSubtitle
          key={index}
          text={text}
          startFrame={subtitleStartFrames[index]}
        />
      ))}
    </AbsoluteFill>
  );
};
