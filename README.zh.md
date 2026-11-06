# dsh-compact-header

DeepSeek Harness Web 界面的头部优化：收紧会话头部、宽窗口时把 View 标签行内嵌进标题行、右上角显示本地时钟与会话统计，并隐藏输入框下方重复的统计气泡。

## 环境要求

- DeepSeek Harness 0.2.x，带 Web 界面。包内声明了 `dsh.bundle` 与 `dsh.client`。
- 不需要其他插件。

## 安装

```sh
dsh plugin --profile web add dsh-compact-header
```

或者从仓库安装：

```sh
dsh plugin add yunxiao11xie/dsh-compact-header
```

## 功能

- **头部**：去掉宿主的最小高度，收紧上下内边距。
- **View 标签**：窗口宽度 ≥ 900 CSS px 时，对话 / 轨迹 / … 标签行上移到标题行；更窄时保持原来的独立一行。
- **右上角**：本地 `HH:MM` 时钟 + 会话统计（轮次、步骤、模型与工具用时），数据来自宿主的 `sessionStats` projection。悬停可看模型/工具用时拆分。
- **输入框下方**：隐藏宿主自带的两个统计气泡（费用入口已经显示同样的数字）。想恢复的话把 `client.js` 里的 `HIDE_DOCK_STATS` 改成 `false`。

## 说明

- 样式覆盖针对宿主会话头部的 CSS module 类名前缀，前缀在 `client.js` 的 `PREFIX` 常量里。DSH 升级后前缀可能变化，表现为头部看起来没有变化；修复只需改这一行。

## 许可证

MIT
