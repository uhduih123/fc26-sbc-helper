# FC26 SBC Helper - Chrome 扩展

FC26 (EA FC) 终极团队 SBC 辅助工具。自动识别 SBC 题目要求，调用后端算法计算最低成本阵容，一键自动填阵。

## 截图

![screenshot1](screenshots/screenshot1.png)
![screenshot2](screenshots/screenshot2.png)
![screenshot3](screenshots/screenshot3.png)
![screenshot4](screenshots/screenshot4.png)
![screenshot5](screenshots/screenshot5.png)
![screenshot6](screenshots/screenshot6.png)
![screenshot7](screenshots/screenshot7.png)
![screenshot8](screenshots/screenshot8.png)

## 功能

- 自动检测 EA SBC 页面，读取题目要求（评分、化学、球员限制）
- 调用算法引擎计算最优阵容方案
- 展示 11 人推荐阵容：球员评分、化学值、市场价格
- 一键自动填阵：模拟在页面上逐个放入球员
- 实时显示总评分、总化学、总花费

## 技术栈

- Chrome Extension Manifest V3
- **React 18** — Popup 弹窗界面（本地加载）
- **Vue 3** — 页面注入覆盖层（CDN 加载）
- Content Script ↔ Popup 消息通信
- Content Script ↔ 页面脚本通过 `window.postMessage` 通信

**为什么同时用 React + Vue：**
- Popup 窗口使用 React 管理复杂交互状态，组件化清晰
- 页面注入的覆盖层使用 Vue 3，更轻量，不污染目标页面 DOM
- React + Vue 通过 `chrome.runtime.sendMessage` + `postMessage` 串联

## 项目结构

```
├── manifest.json    # 扩展配置文件
├── popup.html       # 弹窗界面（React）
├── popup.js         # React 组件（popup 逻辑，使用 React.createElement）
├── react.min.js     # React 18 核心库（本地加载，绕过 CSP 限制）
├── react-dom.min.js # React DOM 库
├── styles.css       # 全局样式
├── content.js       # 内容脚本（postMessage 桥接）
├── vue-overlay.js   # Vue 3 覆盖层（注入到页面主世界运行）
├── background.js    # 后台 Service Worker
├── screenshots/     # 使用截图
└── icon.png         # 图标
```

## 安装

1. 打开 Chrome 浏览器，地址栏输入 `chrome://extensions/`
2. 右上角开启 **开发者模式**
3. 点击 **加载已解压的扩展程序**
4. 选择本项目文件夹
5. 点击右上角拼图图标，固定本插件

## 数据流

```
EA SBC 页面
    ↑ postMessage 更新覆盖层状态
        ↑ content.js（消息桥接）
            ↑ chrome.runtime 通信
                ↑ Popup（React 渲染）
```

**详细流程：**
1. 用户在 EA 官网 SBC 页面点击插件图标
2. Popup（React）发送 `chrome.runtime` 消息到 content script
3. Content script 通过 `window.postMessage` 与 Vue 覆盖层通信
4. Vue 覆盖层显示实时状态（读取中、填阵进度等）
5. 点击"一键填阵" → 同上链路 → Vue 覆盖层展示填阵动画

## 开发说明

数据层和后端算法由团队其他成员提供，本插件专注于前端展示与页面交互。
