import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';
import { QINIU_COLORS, commonStyles } from './styles';

// ============================================
// 新增：开头冲击画面（0-3秒）
// ============================================

// 黑屏大字组件
const ImpactTitle: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => {
  return (
    <AbsoluteFill style={{
      background: '#000',
      ...commonStyles.fullScreen,
    }}>
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 72,
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '0 0 60px rgba(37, 99, 235, 0.8)',
          letterSpacing: 4,
        }}>
          我用 AI 抢到了春运票
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 手机通知模拟（更真实）
const PhoneNotification: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => {
  const frame = useCurrentFrame();
  const shimmer = Math.sin(frame / 10) * 0.1 + 0.9;

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      ...commonStyles.fullScreen,
    }}>
      {/* 模拟手机状态栏 */}
      <div style={{
        position: 'absolute',
        top: 200,
        left: '50%',
        transform: `translateX(-50%) scale(${scale})`,
        opacity,
      }}>
        {/* 通知卡片 */}
        <div style={{
          width: 420,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 20,
          padding: 20,
          boxShadow: `0 20px 60px rgba(16, 185, 129, ${shimmer * 0.5})`,
          border: '2px solid rgba(16, 185, 129, 0.3)',
        }}>
          {/* 通知头部 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 15,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 20,
            }}>
              🤖
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>
                OpenClaw 抢票助手
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                刚刚
              </div>
            </div>
          </div>

          {/* 通知内容 */}
          <div style={{
            background: '#f0fdf4',
            borderRadius: 12,
            padding: 16,
            border: '1px solid #86efac',
          }}>
            <div style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#15803d',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              🎉 抢票成功！
            </div>
            <div style={{ fontSize: 16, color: '#166534', lineHeight: 1.6 }}>
              <div>G1234 北京南 → 上海虹桥</div>
              <div>2025-02-01 08:00 二等座</div>
              <div style={{ marginTop: 8, fontWeight: 'bold' }}>
                请尽快完成支付 →
              </div>
            </div>
          </div>
        </div>

        {/* 时间戳 */}
        <div style={{
          textAlign: 'center',
          marginTop: 20,
          fontSize: 14,
          color: 'rgba(255,255,255,0.5)',
        }}>
          从开始监控到抢到，仅用时 8 分钟
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// 原有组件（优化版）
// ============================================

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

// 加速包弹窗（更扎心）
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
        🚀 好友助力失败
      </div>
      <div style={{ fontSize: 18, color: QINIU_COLORS.danger }}>
        加速包 99 个全用完，还是候补第 9527 位...
      </div>
    </div>
  );
};

// 崩溃表情（新增）
const FrustratedEmoji: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const shake = Math.sin(frame / 3) * 5;

  return (
    <div style={{
      position: 'absolute',
      left: 100,
      bottom: 250,
      fontSize: 80,
      opacity,
      transform: `rotate(${shake}deg)`,
    }}>
      😫
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
          color: '#fff',
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

// ============================================
// 主组件
// ============================================

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ========== 新版时间轴 ==========
  // 0-1.5秒: 黑屏冲击大字 "我用 AI 抢到了春运票"
  // 1.5-3秒: 手机通知截图
  // 3-5.5秒: 痛点展示（候补 + 加速包）
  // 5.5-8秒: AI 解决方案

  const phase1End = fps * 1.5;   // 冲击大字结束
  const phase2End = fps * 3;     // 通知截图结束
  const phase3End = fps * 5.5;   // 痛点展示结束
  // phase4: 5.5-8秒 AI 解决方案

  // ========== Phase 1: 冲击大字 ==========
  const impactOpacity = interpolate(
    frame,
    [0, fps * 0.3, phase1End - fps * 0.3, phase1End],
    [0, 1, 1, 0],
    { extrapolateRight: 'clamp' }
  );
  const impactScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // ========== Phase 2: 手机通知 ==========
  const notifOpacity = interpolate(
    frame,
    [phase1End, phase1End + fps * 0.3, phase2End - fps * 0.3, phase2End],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const notifScale = spring({
    frame: frame - phase1End,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // ========== Phase 3: 痛点展示 ==========
  const painOpacity = interpolate(
    frame,
    [phase2End, phase2End + fps * 0.3],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const waitingProgress = interpolate(
    frame,
    [phase2End, phase3End],
    [0, 18],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 加速包弹窗
  const boostPopupStart = phase2End + fps * 0.8;
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

  // 崩溃表情
  const emojiOpacity = interpolate(
    frame,
    [boostPopupStart + fps * 0.5, boostPopupStart + fps * 0.8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 痛点阶段淡出
  const painFadeOut = interpolate(
    frame,
    [phase3End - fps * 0.3, phase3End],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ========== Phase 4: AI 解决方案 ==========
  const solutionOpacity = interpolate(
    frame,
    [phase3End, phase3End + fps * 0.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const aiNotificationTranslateY = interpolate(
    frame,
    [phase3End + fps * 0.5, phase3End + fps * 1.2],
    [100, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const aiNotificationOpacity = interpolate(
    frame,
    [phase3End + fps * 0.5, phase3End + fps * 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 背景渐变动画
  const bgHue = interpolate(frame, [phase2End, fps * 8], [220, 210], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      {/* ========== Phase 1: 冲击大字 ========== */}
      {frame < phase1End && (
        <ImpactTitle opacity={impactOpacity} scale={Math.min(impactScale, 1.1)} />
      )}

      {/* ========== Phase 2: 手机通知 ========== */}
      {frame >= phase1End && frame < phase2End && (
        <PhoneNotification opacity={notifOpacity} scale={Math.min(notifScale, 1)} />
      )}

      {/* ========== Phase 3 & 4: 痛点 + 解决方案 ========== */}
      {frame >= phase2End && (
        <AbsoluteFill style={{
          background: `linear-gradient(135deg, hsl(${bgHue}, 80%, 50%) 0%, hsl(${bgHue + 20}, 70%, 60%) 100%)`,
        }}>
          {/* 痛点展示阶段 */}
          {frame < phase3End && (
            <AbsoluteFill style={{
              ...commonStyles.fullScreen,
              flexDirection: 'column',
              opacity: painOpacity * painFadeOut,
            }}>
              {/* 转折语 */}
              <div style={{
                position: 'absolute',
                top: 80,
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: 28,
                color: 'rgba(255,255,255,0.7)',
              }}>
                而你可能还在...
              </div>

              {/* 主标题 */}
              <div style={{
                ...commonStyles.title,
                marginBottom: 30,
              }}>
                候补排到天荒地老？
              </div>

              {/* 候补进度条 */}
              <div style={{
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
                  前面还有 <span style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: QINIU_COLORS.warning
                  }}>9527</span> 人
                </div>
              </div>

              {/* 加速包弹窗 */}
              {frame > boostPopupStart && (
                <SpeedBoostPopup opacity={boostOpacity} scale={boostScale} />
              )}

              {/* 崩溃表情 */}
              <FrustratedEmoji opacity={emojiOpacity} />
            </AbsoluteFill>
          )}

          {/* AI 解决方案阶段 */}
          {frame >= phase3End && (
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
                用 AI 给自己搓个抢票神器！
              </div>

              {/* 成功通知 */}
              <AISuccessNotification
                opacity={aiNotificationOpacity}
                translateY={aiNotificationTranslateY}
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
      )}
    </AbsoluteFill>
  );
};
