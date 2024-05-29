export default function About() {
    return (
        <div className={"prose"}>
            <h2>关于本工具</h2>
            <p>
                这是一款用来编辑 Minecraft 文本的所见即所得 (WYSIWYG) 编辑器，使用该工具可以方便的编辑 Minecraft
                彩色文本，并生成可在聊天或命令中使用的代码。
            </p>
            <p>与市面上其它编辑器不同的是，这是专门针对第三方 Minecraft 服务器玩家设计的。</p>
            <p>若要能够在 Minecraft 服务器上使用本工具生成的彩色代码，服务器需要满足以下条件：</p>
            <ul>
                <li>
                    {"安装有 "}
                    <a href="https://essentialsx.net/" target="_blank" rel="noreferrer">
                        EssentialsX
                    </a>
                </li>
                <li>向玩家开放彩色文本及样式权限</li>
            </ul>
            <p>如果需使用自定义 RGB 颜色，服务端的 Minecraft 版本应 ≥1.16，EssentialsX 版本应 ≥2.18.0。</p>
            <hr />
            <p>
                {"本工具目前由 "}
                <a href="https://www.tcdw.net" target="_blank" rel="noreferrer">
                    tcdw
                </a>
                {" 维护，源代码可以在 "}
                <a href="https://github.com/tcdw/minecraft-text-editor" target="_blank" rel="noreferrer">
                    这里
                </a>
                {" 见到。"}
            </p>
        </div>
    );
}
