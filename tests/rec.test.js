import { test } from '@playwright/test';
import fs from 'fs';
import allure from 'allure-playwright';

test('rec1', async ({ page, context }) => {
  await context.tracing.start({ screenshots: true, snapshots: true });
  await page.goto('https://docs.qameta.io/allure-testops/release-notes/');
  await page.waitForTimeout(5000);

  const videoPath = await page.video().path();
  const video = fs.readFileSync(videoPath);
  const screenshot = await page.screenshot();
  await context.tracing.stop({ path: 'trace.zip' });
  const traceBuffer = fs.readFileSync('trace.zip');

  await test.info().attachments.push(
    { name: 'Video (5s)', contentType: 'video/webm', body: video },
    { name: 'Screenshot after 5s', contentType: 'image/png', body: screenshot },
    { name: 'Trace', contentType: 'application/zip', body: traceBuffer }
  );
});
