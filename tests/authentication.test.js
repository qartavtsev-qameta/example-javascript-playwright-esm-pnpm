import { test, expect } from '@playwright/test';
import fs from 'fs';

test('sample test with extra steps', async ({ page, context }) => {
  // Старт трейсинга
  await context.tracing.start({ screenshots: true, snapshots: true });

  // Step 1: Вложенный шаг с текстовым вложением
  await test.step('step 1', async () => {
    await test.step('step 1.2', async () => {
      await test.info().attachments.push({
        name: 'text attachment',
        contentType: 'text/plain',
        body: Buffer.from('some data'),
      });
    });
  });

  // Step 2: Пустой шаг
  await test.step('step 2', async () => {});

  // Step 3: Скриншот
  await test.step('step 3 - attach screenshot', async () => {
    await page.goto('https://demo.testops.cloud');
    const screenshot = await page.screenshot();
    await test.info().attachments.push({
      name: 'Screenshot',
      contentType: 'image/png',
      body: screenshot,
    });
  });

  // Step 4: Видео
  await test.step('step 4 - attach video', async () => {
    const videoPath = await page.video().path();
    const video = fs.readFileSync(videoPath);
    await test.info().attachments.push({
      name: 'Video',
      contentType: 'video/webm',
      body: video,
    });
  });

  // Step 5: Трейс
  await test.step('step 5 - attach trace', async () => {
    await page.goto('https://example.org');
    await context.tracing.stop({ path: 'trace.zip' });

    const traceBuffer = fs.readFileSync('trace.zip');
    await test.info().attachments.push({
      name: 'Trace',
      contentType: 'application/zip',
      body: traceBuffer,
    });
  });

  // Финал — трейсинг уже остановлен
});
