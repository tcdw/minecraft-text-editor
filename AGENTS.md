# AGENTS.md

## 项目概览

Minecraft Text Editor 是一个面向 Minecraft 服务器玩家的彩色文本（含样式）所见即所得编辑器。

- 前端：React + TypeScript
- 编辑器内核：Lexical
- 状态管理：zustand
- UI：Radix UI + 自有 `src/components/ui/*` 封装
- 样式：Tailwind CSS v4（通过 Vite 插件接入）+ Sass（`src/editor.scss`）
- 打包：Vite 7

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

### 构建与预览

```bash
pnpm build
pnpm preview
```

### 代码质量

```bash
pnpm lint
pnpm lint:fix
```

## 构建与样式（重要）

- Tailwind CSS v4 通过 `@tailwindcss/vite` 插件在构建期处理。
- 入口样式文件：
  - `src/styles.css`：`@import "tailwindcss";`、`@plugin "@tailwindcss/typography";`、主题 tokens（`@theme`）与基础层 `@layer base`
  - `src/editor.scss`：编辑器相关样式

## 路径别名

- `@` 指向 `src/`
- 位置：
  - Vite：`vite.config.ts`
  - TypeScript：`tsconfig.json` 的 `paths`

写代码时优先使用 `@/…` 导入以避免相对路径层级过深。

## 目录结构速览

- `src/main.tsx`：应用入口（挂载 React Root）
- `src/App.tsx`：页面骨架 + LexicalComposer 初始化 + 主编辑器 UI
- `src/components/*`：业务组件（Toolbar、CodeEditor、Rainbow* 等）
- `src/components/ui/*`：UI primitives（Radix 封装，类似 shadcn 风格）
- `src/lib/*`：核心逻辑
  - `src/lib/parser.ts`：HTML ↔ Minecraft 字符串 / JSON 结构转换
  - `src/lib/editor.ts`：与 Lexical editor 的交互辅助
  - `src/lib/saveFile.ts`：导出保存（data URL）
- `src/store/*`：zustand stores（设置、预设、彩虹动作等）
- `src/constants/*`：常量（颜色等）
- `src/types/*`：类型定义

## 核心数据与转换逻辑

### Minecraft 文本结构

核心类型是 `MinecraftTextFragment`（见 `src/types/main.ts`），上层通常以二维数组表示多行文本：

- `MinecraftTextFragment[][]`：每一行是 `MinecraftTextFragment[]`

### 转换链路

- WYSIWYG（Lexical）→ HTML：使用 `@lexical/html` 的 `$generateHtmlFromNodes`
- HTML → 片段结构：`src/lib/parser.ts` 的 `parseFromHTML(html)`
  - 注意：解析依赖 `index.html` 中的隐藏容器 `#parser-temp`（用于 DOM 解析/查询）。
- 片段结构 → Minecraft 字符串：`toMinecraftString(...)`
- Minecraft 字符串 → 片段结构：`fromMinecraftString(...)`

如果你要改动解析/导出：
- 优先确保不会破坏 `&` 转义规则（比如 `&&l` 等）
- 注意颜色：内置色码与 `&#RRGGBB`（RGB）两套路径

## 变更建议（给 agent 的工作方式）

1. 优先跑通 `pnpm dev`，在浏览器里验证交互逻辑。
2. 修改 parser/editor 逻辑时，尽量添加最小可复现输入（字符串或片段数组）在本地临时验证。
3. 修改 UI primitives（`src/components/ui/*`）前先搜引用，避免破坏全局样式/交互。
