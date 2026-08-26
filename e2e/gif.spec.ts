import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";
import { getVideoDurationInSeconds } from "get-video-duration";
import { loadVideo, outputPath, waitForConverter } from "./helpers";

test("converts a clipped GIF", async ({ page }) => {
  await loadVideo(page);
  await waitForConverter(page);

  await page.getByRole("button", { name: "GIF" }).click();
  await page.getByRole("textbox", { name: "Start range" }).fill("0:01");
  await page.getByRole("textbox", { name: "End range" }).fill("0:04");
  await expect(page.getByRole("button", { name: "Snip GIF" })).toBeEnabled();

  const downloadPromise = page.waitForEvent("download", { timeout: 180_000 });
  await page.getByRole("button", { name: "Snip GIF" }).click();
  const download = await downloadPromise;
  const filePath = outputPath("clip.gif");
  await download.saveAs(filePath);

  expect(existsSync(filePath)).toBe(true);
  expect(download.suggestedFilename()).toMatch(/\.gif$/i);
  const duration = await getVideoDurationInSeconds(filePath);
  expect(duration).toBeGreaterThanOrEqual(2);
  expect(duration).toBeLessThan(5);
});
