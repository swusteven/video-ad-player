import { describe, it, expect } from "vitest";
import { toHttps } from "../vast-utils";

describe("toHttps", () => {
  it("returns undefined if url is undefined", () => {
    expect(toHttps(undefined)).toBeUndefined();
  });

  it("converts http:// to https://", () => {
    expect(toHttps("http://example.com/video.mp4")).toBe("https://example.com/video.mp4");
  });

  it("leaves https:// unchanged", () => {
    expect(toHttps("https://example.com/video.mp4")).toBe("https://example.com/video.mp4");
  });

  it("leaves non-http protocols unchanged", () => {
    expect(toHttps("ftp://example.com/file")).toBe("ftp://example.com/file");
  });

  it("handles urls with ports", () => {
    expect(toHttps("http://example.com:8080/video.mp4")).toBe("https://example.com:8080/video.mp4");
  });

  it("handles urls with query params", () => {
    expect(toHttps("http://example.com/video.mp4?token=abc")).toBe("https://example.com/video.mp4?token=abc");
  });

  it("handles empty string", () => {
    expect(toHttps("")).toBe("");
  });

  it("handles short strings less than 5 chars", () => {
    expect(toHttps("abc")).toBe("abc");
  });

  it("handles exact 'http' string (converts to https)", () => {
    expect(toHttps("http")).toBe("https");
  });
});

