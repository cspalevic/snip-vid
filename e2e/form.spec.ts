import { expect, test } from "@playwright/test";

test("empty URL fails native form validation", async ({ page }) => {
  await page.goto("/");
  const form = page.getByRole("form");
  await expect(form).toBeVisible();
  await page.getByRole("button", { name: "Load video" }).click();
  const valid = await form.evaluate((element: HTMLFormElement) =>
    element.checkValidity(),
  );
  expect(valid).toBe(false);
});

test("invalid URL fails native form validation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "YouTube URL" }).fill("not-a-url");
  const form = page.getByRole("form");
  await page.getByRole("button", { name: "Load video" }).click();
  const valid = await form.evaluate((element: HTMLFormElement) =>
    element.checkValidity(),
  );
  expect(valid).toBe(false);
});
