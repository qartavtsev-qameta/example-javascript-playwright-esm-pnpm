const { test, expect } = require('@playwright/test');

test('sample test with extra steps', async ({ page, context }) => {
  
  // Начинаем трейсинг до того, как будут выполнены шаги
  await context.tracing.start({ screenshots: true, snapshots: true });

  // Step 1: Просто пример
  await test.step('step 1', async () => {
    await test.step('step 1.2', async () => {
      // Добавление текстового вложения
      await test.info().attachments.push({
        name: 'text attachment',
        contentType: 'text/plain',
        body: Buffer.from('some data'),
      });
    });
  });

  // Step 2: Просто пустой шаг
  await test.step('step 2', async () => {});

  // Step 3: Скриншот
  await test.step('step 3 - attach screenshot', async () => {
    await page.goto('https://demo.testops.cloud');
    const screenshot = await page.screenshot();
    // Добавление скриншота как вложения
    await test.info().attachments.push({
      name: 'Screenshot',
      contentType: 'image/png',
      body: screenshot,
    });
  });

  // Step 4: Видео
  await test.step('step 4 - attach video', async () => {
    // Важно: видео должно быть включено в конфиге
    const videoPath = await page.video().path();
    const fs = require('fs');
    const video = fs.readFileSync(videoPath);
    // Добавление видео как вложения
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

    const fs = require('fs');
    const traceBuffer = fs.readFileSync('trace.zip');
    // Добавление trace как вложения
    await test.info().attachments.push({
      name: 'Trace',
      contentType: 'application/zip',
      body: traceBuffer,
    });
  });

  // После выполнения всех шагов остановим трейсинг
});
