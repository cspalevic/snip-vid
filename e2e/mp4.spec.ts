import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";
import { getVideoDurationInSeconds } from "get-video-duration";
import { loadVideo, outputPath } from "./helpers";

test.skip(
  Boolean(process.env.CI),
  "YouTube serves bot interstitials to GitHub-hosted runners",
);

test("downloads a full MP4", async ({ page }) => {
  await loadVideo(page);

  const downloadPromise = page.waitForEvent("download", { timeout: 120_000 });
  await page.getByRole("button", { name: "Download MP4" }).click();
  const download = await downloadPromise;
  const filePath = outputPath("full.mp4");
  await download.saveAs(filePath);

  expect(existsSync(filePath)).toBe(true);
  expect(download.suggestedFilename()).toMatch(/\.mp4$/i);
  const duration = await getVideoDurationInSeconds(filePath);
  expect(duration).toBeGreaterThanOrEqual(18);
  expect(duration).toBeLessThan(21);
});
