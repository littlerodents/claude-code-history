// 颜色常量
export const COLORS = {
  background: "#000000",
  primary: "#007AFF", // iOS 蓝色
  secondary: "#5856D6", // 紫色
  accent: "#FF9500", // 橙色
  success: "#34C759", // 绿色
  text: "#FFFFFF",
  textSecondary: "#8E8E93",
  iMessageBlue: "#007AFF",
  iMessageGray: "#E5E5EA",
  qiniuBlue: "#0066FF",
  deepSeekBlue: "#4285F4",
  qwenPurple: "#8B5CF6",
};

// 字体常量
export const FONTS = {
  primary: "PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "SF Mono, Monaco, Consolas, monospace",
};

// 视频规格
export const VIDEO_CONFIG = {
  fps: 30,
  width: 1080,
  height: 1920,
  durationInFrames: 1800, // 60秒
};

// 场景时长 (帧数)
export const SCENE_DURATIONS = {
  scene1: 300,  // 00:00-00:10 (10秒)
  scene2: 450,  // 00:10-00:25 (15秒)
  scene3: 450,  // 00:25-00:40 (15秒)
  scene4: 300,  // 00:40-00:50 (10秒)
  scene5: 300,  // 00:50-01:00 (10秒)
};

// 字幕内容
export const SUBTITLES = {
  scene1: ["iMessage。", "遥控电脑。", "实时。"],
  scene2: ["它不只是听你说什么。", "它知道你想要什么。", "这就是记忆。"],
  scene3: ["以前，这是门槛。", "现在，这是一个按钮。", "七牛云托管。一键部署搞定"],
  scene4: ["DeepSeek，千问。", "最强大脑，模型广场随便挑。"],
  scene5: ["现在，注册七牛云，", "百亿 Token，免费领。", "链接在评论区，拉新还有额外福利"],
};

// 动画配置
export const ANIMATION = {
  fadeInDuration: 15,   // 0.5秒淡入
  fadeOutDuration: 15,  // 0.5秒淡出
  typewriterSpeed: 3,   // 每 3 帧一个字符
  springConfig: {
    damping: 100,
    mass: 0.5,
    stiffness: 200,
  },
};
