export function baseName(path) {
  if (!path) return "";
  // 按 '/' 拆分，过滤掉空字符串，再取最后一个
  const segments = path.split("/").filter(Boolean);
  return segments.pop() || "";
}
export function dirName(path) {
  if (!path) return "";

  // 去掉末尾的 '/'
  path = path.replace(/\/+$/, "");

  const i = path.lastIndexOf("/");
  if (i === -1) return "";

  return path.slice(0, i) || "/";
}