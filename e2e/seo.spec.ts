import { expect, test } from "@playwright/test";

const PAGES = [
  "/",
  "/privacy",
  "/youtube-to-gif",
  "/youtube-to-mp4",
  "/how-it-works",
] as const;

test("seo pages respond and stay indexable", async ({ request }) => {
  for (const path of PAGES) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).toMatch(/<title>/i);
    expect(html, path).toMatch(/meta[^>]+name=["']description["']/i);
    expect(html, path).toMatch(/rel=["']canonical["']/i);
    expect(html, path).not.toMatch(/noindex/i);
  }
});

test("sitemap lists crawlable routes", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  expect(xml).toContain("https://snip-vid.com</loc>");
  expect(xml).toContain("https://snip-vid.com/privacy");
  expect(xml).toContain("https://snip-vid.com/youtube-to-gif");
  expect(xml).toContain("https://snip-vid.com/youtube-to-mp4");
  expect(xml).toContain("https://snip-vid.com/how-it-works");
});

test("robots.txt allows indexing and points at the sitemap", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const text = await response.text();
  expect(text).toMatch(/Allow:\s*\//);
  expect(text).toMatch(/Disallow:\s*\/api\//);
  expect(text).toContain("https://snip-vid.com/sitemap.xml");
});

test("open graph image is a raster PNG", async ({ request }) => {
  const response = await request.get("/opengraph-image");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/image\/png/);
  const body = await response.body();
  expect(body.subarray(0, 8)).toEqual(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  );
});
