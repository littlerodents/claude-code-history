import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Sequence,
} from 'remotion';
import { QINIU_COLORS, commonStyles, easings, VIDEO_CONFIG } from './styles';

// 候补进度条动画
const WaitingProgress: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div style={{
      width: 400,
      height: 20,
      background: 'rgba(255,255,255,0.3)',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 20,
    }}>
      <div style={{
        width: `${progress}%`,
        height: '100%',
        background: QINIU_COLORS.warning,
        borderRadius: 10,
        transition: 'width 0.1s',
      }} />
    </div>
  );
};

// 加速包弹窗
const SpeedBoostPopup: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => {
  return (
    <div style={{
      position: 'absolute',
      right: 100,
      top: 200,
      background: QINIU_COLORS.white,
      borderRadius: 16,
      padding: '20px 30px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      opacity,
      transform: `scale(${scale})`,
    }}>
      <div style={{ fontSize: 24, color: QINIU_COLORS.textPrimary, marginBottom: 10 }}>
        🚀 好友助力加速
      </div>
      <div style={{ fontSize: 18, color: QINIU_COLORS.textSecondary }}>
        加速包用了 99 个，还是候补中...
      </div>
    </div>
  );
};

// AI 成功通知
const AISuccessNotification: React.FC<{ opacity: number; translateY: number }> = ({ opacity, translateY }) => {
  return (
    <div style={{
      position: 'absolute',
      background: QINIU_COLORS.white,
      borderRadius: 20,
      padding: '30px 50px',
      boxShadow: '0 20px 60px rgba(37, 99, 235, 0.3)',
      opacity,
      transform: `translateY(${translateY}px)`,
      border: `3px solid ${QINIU_COLORS.success}`,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}>
        <div style={{
          width: 60,
          height: 60,
          background: QINIU_COLORS.success,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 32,
        }}>
          ✓
        </div>
        <div>
          <div style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: QINIU_COLORS.success,
            marginBottom: 8,
          }}>
            🎉 抢票成功！
          </div>
          <div style={{
            fontSize: 24,
            color: QINIU_COLORS.textPrimary,
          }}>
            已为您抢到 G1234 余票 1 张
          </div>
        </div>
      </div>
    </div>
  );
};

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 时间点计算 (120fps)
  const phaseFrames = {
    pain: fps * 3,      // 0-3秒: 展示痛点
    transition: fps * 1, // 3-4秒: 过渡
    solution: fps * 4,   // 4-8秒: AI 解决方案
  };

  // 痛点阶段动画
  const painOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const waitingProgress = interpolate(frame, [0, fps * 2.5], [0, 15], { extrapolateRight: 'clamp' });

  // 加速包弹窗
  const boostPopupStart = fps * 1;
  const boostOpacity = interpolate(
    frame,
    [boostPopupStart, boostPopupStart + fps * 0.3],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const boostScale = spring({
    frame: frame - boostPopupStart,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // 痛点文字动画
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // 过渡阶段
  const transitionStart = fps * 3;
  const fadeOut = interpolate(
    frame,
    [transitionStart, transitionStart + fps * 0.5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // AI 解决方案阶段
  const solutionStart = fps * 4;
  const solutionOpacity = interpolate(
    frame,
    [solutionStart, solutionStart + fps * 0.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const notificationTranslateY = interpolate(
    frame,
    [solutionStart + fps * 0.5, solutionStart + fps * 1.2],
    [100, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const notificationOpacity = interpolate(
    frame,
    [solutionStart + fps * 0.5, solutionStart + fps * 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 背景渐变动画
  const bgHue = interpolate(frame, [0, fps * 8], [220, 210], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, hsl(${bgHue}, 80%, 50%) 0%, hsl(${bgHue + 20}, 70%, 60%) 100%)`,
    }}>
      {/* 痛点展示阶段 */}
      {frame < transitionStart + fps * 0.5 && (
        <AbsoluteFill style={{
          ...commonStyles.fullScreen,
          flexDirection: 'column',
          opacity: fadeOut,
        }}>
          {/* 主标题 */}
          <div style={{
            ...commonStyles.title,
            opacity: painOpacity,
            transform: `scale(${titleScale})`,
            marginBottom: 30,
          }}>
            还在候补？加速包也不灵？
          </div>

          {/* 候补进度条 */}
          <div style={{
            opacity: painOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{
              fontSize: 32,
              color: QINIU_COLORS.white,
              marginBottom: 10,
            }}>
              候补排队中...
            </div>
            <WaitingProgress progress={waitingProgress} />
            <div style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.8)',
              marginTop: 15,
            }}>
              前面还有 9999+ 人
            </div>
          </div>

          {/* 加速包弹窗 */}
          {frame > boostPopupStart && (
            <SpeedBoostPopup opacity={boostOpacity} scale={boostScale} />
          )}
        </AbsoluteFill>
      )}

      {/* AI 解决方案阶段 */}
      {frame >= solutionStart && (
        <AbsoluteFill style={{
          ...commonStyles.fullScreen,
          flexDirection: 'column',
          opacity: solutionOpacity,
        }}>
          {/* 标题 */}
          <div style={{
            ...commonStyles.title,
            marginBottom: 60,
          }}>
            春运抢票，用 AI 给自己搓个神器！
          </div>

          {/* 成功通知 */}
          <AISuccessNotification
            opacity={notificationOpacity}
            translateY={notificationTranslateY}
          />
        </AbsoluteFill>
      )}

      {/* 底部装饰 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)',
      }} />
    </AbsoluteFill>
  );
};
