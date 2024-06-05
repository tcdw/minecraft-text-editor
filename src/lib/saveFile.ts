export function save(fileName: string, href: string) {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = href;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * 保存字符串为文件，编码为 UTF-8
 * @param fileName 文件名
 * @param str 字符串
 * @param type mime
 */
export function saveString(fileName: string, str: unknown, type = "text/plain") {
    return save(fileName, `data:${type};charset=utf-8,${encodeURIComponent(`${str}`)}`);
}
