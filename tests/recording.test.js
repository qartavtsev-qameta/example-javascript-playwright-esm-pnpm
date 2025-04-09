// Import Playwright's test API
import { test } from '@playwright/test';
// Import Node.js file system module to read files
import fs from 'fs';

// Define the test case
test('record 5s video of page load + screenshot + trace', async ({ page, context }) => {
  // Start tracing (captures DOM snapshots and screenshots during execution)
  await context.tracing.start({ screenshots: true, snapshots: true });

  // Navigate to the target page
  await page.goto('https://docs.qameta.io/allure-testops/release-notes/');

  // Wait for 5 seconds to simulate "watching the loading process"
  await page.waitForTimeout(5000);

  // Take a screenshot of the current page
  const screenshot = await page.screenshot();

  // Attach the screenshot to the Allure report
  await test.info().attachments.push({
    name: 'Screenshot after 5s',         // Name shown in the report
    contentType: 'image/png',            // MIME type
    body: screenshot,                    // Actual image data
  });

  // Stop the tracing and save it to a ZIP file
  await context.tracing.stop({ path: 'trace.zip' });

  // Read the trace ZIP file into a buffer
  const traceBuffer = fs.readFileSync('trace.zip');

  // Attach the trace file to the Allure report
  await test.info().attachments.push({
    name: 'Trace',                       // Name shown in the report
    contentType: 'application/zip',     // MIME type for ZIP
    body: traceBuffer,                  // Actual trace data
  });

  // Get the path to the recorded video for the current test
  const videoPath = await page.video().path();

  // Read the video file into a buffer
  const video = fs.readFileSync(videoPath);

  // Attach the video to the Allure report
  await test.info().attachments.push({
    name: 'Video (5s)',                  // Name shown in the report
    contentType: 'video/webm',           // MIME type for webm video
    body: video,                         // Actual video data
  });
});
