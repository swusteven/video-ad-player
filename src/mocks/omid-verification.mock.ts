import { vi } from "vitest";

vi.mock("./omid-js/omid-verification", () => ({
  setupAdVerification: vi.fn(),
}));
