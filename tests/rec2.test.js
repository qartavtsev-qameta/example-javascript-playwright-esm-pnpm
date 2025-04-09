// Import Playwright's test API
import { test } from '@playwright/test';
import fs from 'fs'; // File system module to read files
//import allure from 'allure-playwright'
import allure from "allure-js-commons";

// Define the test case
test('rec2', async ({ page, context }) => {

  // Start tracing (captures DOM snapshots and screenshots during execution)
  await test.step('Start tracing', async () => {
    await context.tracing.start({ screenshots: true, snapshots: true });
  });

  // Navigate to the target page
  await test.step('Navigate to the target page', async () => {
    await page.goto('https://docs.qameta.io/allure-testops/release-notes/');
  });

  // Wait for 5 seconds to simulate "watching the loading process"
  await test.step('Wait for 5 seconds', async () => {
    await page.waitForTimeout(5000);
  });

  // Get the path to the recorded video for the current test
  await test.step('Get video path and attach video', async () => {
    const videoPath = await page.video().path();

    // Read the video file into a buffer
    const video = fs.readFileSync(videoPath);

    // Attach the video to the Allure report for this specific step
    await test.info().attachments.push({
      name: 'Video (5s)',                  // Name shown in the report
      contentType: 'video/webm',           // MIME type for webm video
      body: video,                         // Actual video data
    });
  });

  // Take a screenshot of the current page
  await test.step('Take a screenshot', async () => {
    const screenshot = await page.screenshot();

    // Attach the screenshot to the Allure report for this specific step
    await test.info().attachments.push({
      name: 'Screenshot after 5s',         // Name shown in the report
      contentType: 'image/png',            // MIME type
      body: screenshot,                    // Actual image data
    });
  });

  // Stop the tracing and save it to a ZIP file
  await test.step('Stop tracing and save trace', async () => {
    await context.tracing.stop({ path: 'trace.zip' });

    // Read the trace ZIP file into a buffer
    const traceBuffer = fs.readFileSync('trace.zip');

    // Attach the trace file to the Allure report for this specific step
    await test.info().attachments.push({
      name: 'Trace',                       // Name shown in the report
      contentType: 'application/zip',     // MIME type for ZIP
      body: traceBuffer,                  // Actual trace data
    });
  });
});
