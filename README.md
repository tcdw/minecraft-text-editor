# Minecraft Text Editor

这是一款用来编辑 Minecraft 文本的所见即所得 (WYSIWYG) 编辑器，使用该工具可以方便的编辑 Minecraft 彩色文本，并生成可在聊天或命令中使用的代码。

与市面上其它编辑器不同的是，这是专门针对第三方 Minecraft 服务器玩家设计的。

> [!NOTE]  
> 项目推倒重写中，采用 React + Lexical 实现。

## 使用生成的文本

若要能够在 Minecraft 服务器上使用本工具生成的彩色代码，服务器需要满足以下条件：

- 安装有 [EssentialsX](https://essentialsx.net/)
- 向玩家开放彩色文本及样式权限

如果需使用自定义 RGB 颜色，服务端的 Minecraft 版本应 ≥1.16，EssentialsX 版本应 ≥2.18.0。

## 开发/编译

本工具使用 ~~Parcel~~ Vite 进行编译工作。

- 编译：`npm run build`
- 开发模式：`npm run dev`
- 预览（需要先编译）：`npm run preview`
