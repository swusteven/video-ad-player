import { afterEach } from "vitest";
import { cleanup } from "@testing-library/preact";
import "@testing-library/jest-dom/vitest";
import "./src/mocks/intersection-observer.mock";
import "./src/mocks/omid-verification.mock";

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
