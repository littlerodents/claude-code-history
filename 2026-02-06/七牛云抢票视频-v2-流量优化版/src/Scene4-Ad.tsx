import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';
import { QINIU_COLORS, commonStyles } from './styles';

// 对比卡片
const ComparisonCard: React.FC<{
  title: string;
  icon: string;
  isGood: boolean;
  points: string[];
  opacity: number;
  translateX: number;
}> = ({ title, icon, isGood, points, opacity, translateX }) => {
  return (
    <div style={{
      width: 450,
      background: QINIU_COLORS.white,
      borderRadius: 24,
      padding: 30,
      opacity,
      transform: `translateX(${translateX}px)`,
      boxShadow: isGood
        ? `0 20px 60px rgba(16, 185, 129, 0.3)`
        : `0 20px 60px rgba(239, 68, 68, 0.2)`,
      border: `4px solid ${isGood ? QINIU_COLORS.success : QINIU_COLORS.danger}`,
    }}>
      {/* 头部 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        marginBottom: 25,
      }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: isGood ? QINIU_COLORS.success : QINIU_COLORS.danger,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 28,
        }}>
          {icon}
        </div>
        <div style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: QINIU_COLORS.textPrimary,
        }}>
          {title}
        </div>
      </div>

      {/* 要点列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {points.map((point, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 20,
            color: QINIU_COLORS.textPrimary,
          }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: isGood ? QINIU_COLORS.success : QINIU_COLORS.danger,
              color: QINIU_COLORS.white,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 14,
              fontWeight: 'bold',
            }}>
              {isGood ? '✓' : '✕'}
            </div>
            {point}
          </div>
        ))}
      </div>
    </div>
  );
};

// 福利卡片
const BenefitCard: React.FC<{
  amount: string;
  description: string;
  icon: string;
  delay: number;
}> = ({ amount, description, icon, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(
    frame,
    [delay, delay + fps * 0.3],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 闪烁效果
  const glow = Math.sin((frame - delay) / 10) * 0.2 + 0.8;

  return (
    <div style={{
      background: QINIU_COLORS.white,
      borderRadius: 20,
      padding: '30px 40px',
      textAlign: 'center',
      opacity,
      transform: `scale(${scale})`,
      boxShadow: `0 15px 40px rgba(37, 99, 235, ${glow * 0.3})`,
      border: `3px solid ${QINIU_COLORS.primary}`,
    }}>
      <div style={{ fontSize: 48, marginBottom: 10 }}>{icon}</div>
      <div style={{
        fontSize: 42,
        fontWeight: 'bold',
        color: QINIU_COLORS.primary,
        marginBottom: 8,
      }}>
        {amount}
      </div>
      <div style={{
        fontSize: 20,
        color: QINIU_COLORS.textSecondary,
      }}>
        {description}
      </div>
    </div>
  );
};

// 二维码组件
const QRCode: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => {
  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        width: 180,
        height: 180,
        background: QINIU_COLORS.white,
        borderRadius: 16,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        padding: 15,
      }}>
        {/* 模拟二维码 */}
        <div style={{
          width: '100%',
          height: '100%',
          background: `repeating-linear-gradient(
            0deg,
            ${QINIU_COLORS.textPrimary} 0px,
            ${QINIU_COLORS.textPrimary} 8px,
            ${QINIU_COLORS.white} 8px,
            ${QINIU_COLORS.white} 16px
          )`,
          backgroundSize: '16px 16px',
          opacity: 0.8,
          borderRadius: 4,
        }} />
      </div>
      <div style={{
        marginTop: 15,
        fontSize: 18,
        color: QINIU_COLORS.white,
        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }}>
        扫码领取福利
      </div>
    </div>
  );
};

export const Scene4Ad: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 阶段时间点
  const comparisonEnd = fps * 6; // 前6秒：对比
  const benefitsEnd = fps * 12;  // 后6秒：福利

  // 对比阶段动画
  const leftCardOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const leftCardX = interpolate(frame, [0, fps * 0.5], [-100, 0], { extrapolateRight: 'clamp' });

  const rightCardOpacity = interpolate(frame, [fps * 0.5, fps * 1], [0, 1], { extrapolateRight: 'clamp' });
  const rightCardX = interpolate(frame, [fps * 0.5, fps * 1], [100, 0], { extrapolateRight: 'clamp' });

  // 对比标题
  const titleOpacity = interpolate(frame, [fps * 1.5, fps * 2], [0, 1], { extrapolateRight: 'clamp' });

  // 对比阶段淡出
  const comparisonFadeOut = interpolate(
    frame,
    [comparisonEnd - fps * 0.5, comparisonEnd],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 福利阶段淡入
  const benefitsFadeIn = interpolate(
    frame,
    [comparisonEnd, comparisonEnd + fps * 0.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 福利标题动画
  const benefitTitleY = interpolate(
    frame,
    [comparisonEnd, comparisonEnd + fps * 0.5],
    [-50, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 二维码动画
  const qrOpacity = interpolate(
    frame,
    [comparisonEnd + fps * 4, comparisonEnd + fps * 4.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const qrScale = spring({
    frame: frame - comparisonEnd - fps * 4,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // 背景动画
  const bgShift = interpolate(frame, [0, fps * 12], [0, 30], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(${135 + bgShift}deg, ${QINIU_COLORS.primary} 0%, ${QINIU_COLORS.primaryDark} 100%)`,
    }}>
      {/* 对比阶段 */}
      {frame < comparisonEnd && (
        <AbsoluteFill style={{
          ...commonStyles.fullScreen,
          flexDirection: 'column',
          opacity: comparisonFadeOut,
        }}>
          {/* 标题 */}
          <div style={{
            position: 'absolute',
            top: 80,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: titleOpacity,
          }}>
            <div style={{
              ...commonStyles.title,
              fontSize: 52,
            }}>
              为什么选择 OpenClaw？
            </div>
          </div>

          {/* 对比卡片 */}
          <div style={{
            display: 'flex',
            gap: 60,
            alignItems: 'stretch',
          }}>
            <ComparisonCard
              title="第三方抢票软件"
              icon="⚠️"
              isGood={false}
              points={[
                '个人信息泄露风险',
                '代码不透明',
                '付费后效果存疑',
                '账号可能被封禁',
              ]}
              opacity={leftCardOpacity}
              translateX={leftCardX}
            />
            <ComparisonCard
              title="OpenClaw 自部署"
              icon="🛡️"
              isGood={true}
              points={[
                '代码跑在自己服务器',
                '完全开源可审计',
                '隐私绝对安全',
                '灵活定制功能',
              ]}
              opacity={rightCardOpacity}
              translateX={rightCardX}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* 福利阶段 */}
      {frame >= comparisonEnd && (
        <AbsoluteFill style={{
          ...commonStyles.fullScreen,
          flexDirection: 'column',
          opacity: benefitsFadeIn,
        }}>
          {/* 标题 */}
          <div style={{
            position: 'absolute',
            top: 80,
            left: 0,
            right: 0,
            textAlign: 'center',
            transform: `translateY(${benefitTitleY}px)`,
          }}>
            <div style={{
              ...commonStyles.title,
              fontSize: 52,
            }}>
              🎁 限时福利，几乎白嫖！
            </div>
          </div>

          {/* 福利卡片 */}
          <div style={{
            display: 'flex',
            gap: 40,
            marginBottom: 60,
          }}>
            <BenefitCard
              amount="¥100"
              description="LAS 抵扣金"
              icon="💰"
              delay={comparisonEnd + fps * 0.5}
            />
            <BenefitCard
              amount="千万"
              description="Token 赠送"
              icon="🎯"
              delay={comparisonEnd + fps * 1}
            />
            <BenefitCard
              amount="0 门槛"
              description="新用户专享"
              icon="🚀"
              delay={comparisonEnd + fps * 1.5}
            />
          </div>

          {/* 二维码 */}
          <QRCode opacity={qrOpacity} scale={qrScale} />

          {/* 底部提示 */}
          <div style={{
            position: 'absolute',
            bottom: 60,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 24,
            color: 'rgba(255,255,255,0.8)',
          }}>
            详情请见活动说明 ~
          </div>
        </AbsoluteFill>
      )}

      {/* 装饰元素 */}
      <div style={{
        position: 'absolute',
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: -150,
        left: -150,
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
      }} />
    </AbsoluteFill>
  );
};
