import { vi } from "vitest";

class IntersectionObserverMock {
  constructor(
    private callback: IntersectionObserverCallback,
    private options?: IntersectionObserverInit
  ) {}

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();

  trigger(entries: IntersectionObserverEntry[]) {}
}

global.IntersectionObserver = IntersectionObserverMock as any;
