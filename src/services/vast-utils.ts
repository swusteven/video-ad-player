export function toHttps(url: string | undefined) {
  if (url === undefined) {
    return undefined;
  }
  const firstFiveChar = url.slice(0, 5);
  if (firstFiveChar != "https" && firstFiveChar.slice(0, 4) === "http") {
    return url.replace("http", "https");
  }
  return url;
}
