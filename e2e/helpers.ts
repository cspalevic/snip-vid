import { mkdirSync } from "node:fs";
import path from "node:path";
import { expect, type Page } from "@playwright/test";

export const YT_VIDEO_URL = "https://www.youtube.com/watch?v=jNQXAC9IVRw";
export const OUTPUT_DIR = "test-results/downloads";

export function outputPath(name: string) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  return path.join(OUTPUT_DIR, name);
}

export async function loadVideo(page: Page) {
  await page.goto("/");
  await page.getByRole("textbox", { name: "YouTube URL" }).fill(YT_VIDEO_URL);
  await page.getByRole("button", { name: "Load video" }).click();
  await expect(page.getByText("Me at the zoo")).toBeVisible({
    timeout: 60_000,
  });
  await expect(page.getByRole("button", { name: "Download MP4" })).toBeVisible();
}

export async function waitForConverter(page: Page) {
  await expect(page.getByText("Converter ready")).toBeVisible({
    timeout: 120_000,
  });
}
