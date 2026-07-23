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
- 原生 JavaScript（无框架依赖）
- Content Script ↔ Popup 消息通信机制

## 项目结构

```
├── manifest.json    # 扩展配置文件
├── popup.html       # 弹窗界面
├── popup.js         # 弹窗逻辑
├── styles.css       # 样式
├── content.js       # 页面注入脚本（读取SBC信息、自动填阵）
├── background.js    # 后台服务
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
    ↓ content_script 读取页面信息
Chrome 扩展 Popup
    ↓ 点击"计算最优解" → 请求算法接口
推荐阵容展示（评分、化学、价格）
    ↓ 点击"一键填阵"
content_script 模拟填阵操作
```

## 开发说明

数据层和后端算法由团队其他成员提供，本插件专注于前端展示与页面交互。
