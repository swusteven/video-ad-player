import fs from "fs";

export async function mockAssetResponses(page) {
  await mockVideo(page);
  await mockVast(page);
}

async function mockVideo(page) {
  const mockVideoBuffer = fs.readFileSync("./tests/assets/test_video.mp4");

  await page.route("**/*.mp4", (route) => {
    route.fulfill({
      contentType: "video/mp4",
      body: mockVideoBuffer,
    });
  });
}

async function mockVast(page) {
  const mockVastFile = fs.readFileSync("./tests/assets/simple_vast.xml");

  await page.route("**/*.xml", (route) => {
    route.fulfill({
      contentType: "text/xml",
      body: mockVastFile,
    });
  });
}
