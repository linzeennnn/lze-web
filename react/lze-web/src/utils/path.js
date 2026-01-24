export function baseName(path) {
  if (!path) return "";
  return path.split("/").pop();
}
export function dirName(path) {
  if (!path) return "";

  const i = path.lastIndexOf("/");
  if (i === -1) return "";

  return path.slice(0, i) || "/";
}