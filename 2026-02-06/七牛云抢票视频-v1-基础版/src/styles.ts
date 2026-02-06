// 七牛云品牌配色系统
export const QINIU_COLORS = {
  // 主色 - 七牛云蓝
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',

  // 辅助色
  secondary: '#60A5FA',
  accent: '#93C5FD',

  // 中性色
  white: '#FFFFFF',
  background: '#F0F9FF',
  backgroundDark: '#E0F2FE',

  // 文字色
  textPrimary: '#1E3A5F',
  textSecondary: '#64748B',
  textWhite: '#FFFFFF',

  // 功能色
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',

  // 渐变
  gradientPrimary: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
  gradientLight: 'linear-gradient(135deg, #60A5FA 0%, #93C5FD 100%)',
  gradientDark: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
} as const;

// 视频配置
export const VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 120,
  durationInSeconds: 60,
  get durationInFrames() {
    return this.fps * this.durationInSeconds; // 7200 帧
  },
} as const;

// 场景时间配置 (单位: 秒)
export const SCENE_TIMING = {
  scene1: { start: 0, duration: 8 },    // 开头钩子: 0-8秒
  scene2: { start: 8, duration: 7 },    // 解决方案: 8-15秒
  scene3: { start: 15, duration: 25 },  // 操作步骤: 15-40秒
  scene4: { start: 40, duration: 12 },  // 广告植入: 40-52秒
  scene5: { start: 52, duration: 8 },   // 结尾CTA: 52-60秒
} as const;

// 帧数计算辅助函数
export const secondsToFrames = (seconds: number): number => {
  return Math.round(seconds * VIDEO_CONFIG.fps);
};

export const getSceneFrames = (sceneName: keyof typeof SCENE_TIMING) => {
  const scene = SCENE_TIMING[sceneName];
  return {
    start: secondsToFrames(scene.start),
    duration: secondsToFrames(scene.duration),
    end: secondsToFrames(scene.start + scene.duration),
  };
};

// 通用样式
export const commonStyles = {
  // 全屏容器
  fullScreen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties,

  // 居中容器
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  } as React.CSSProperties,

  // 标题文字
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: QINIU_COLORS.white,
    textAlign: 'center',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
  } as React.CSSProperties,

  // 副标题
  subtitle: {
    fontSize: 48,
    fontWeight: 600,
    color: QINIU_COLORS.white,
    textAlign: 'center',
  } as React.CSSProperties,

  // 正文
  body: {
    fontSize: 36,
    color: QINIU_COLORS.textPrimary,
    lineHeight: 1.6,
  } as React.CSSProperties,

  // 高亮文字
  highlight: {
    color: QINIU_COLORS.primary,
    fontWeight: 'bold',
  } as React.CSSProperties,

  // 卡片样式
  card: {
    background: QINIU_COLORS.white,
    borderRadius: 24,
    padding: 40,
    boxShadow: '0 20px 60px rgba(37, 99, 235, 0.15)',
  } as React.CSSProperties,

  // 按钮样式
  button: {
    background: QINIU_COLORS.gradientPrimary,
    color: QINIU_COLORS.white,
    padding: '20px 48px',
    borderRadius: 12,
    fontSize: 32,
    fontWeight: 'bold',
    border: 'none',
    boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)',
  } as React.CSSProperties,
} as const;

// 动画缓动函数
export const easings = {
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  spring: (t: number) => {
    return 1 - Math.cos(t * Math.PI * 4) * Math.exp(-t * 6);
  },
} as const;
