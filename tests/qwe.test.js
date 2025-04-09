import { test, expect } from '@playwright/test';
import path from 'path';

test('should open example.org and record video, screenshot, and trace', async ({ page }) => {
  // Устанавливаем видео- и трассировку
  await page.context().tracing.start({ screenshots: true, snapshots: true });

  // Записываем видео
  const videoPath = path.join(__dirname, 'example-video.mp4');
  await page.video().startRecording(videoPath);

  // Открываем страницу
  await page.goto('https://example.org');
  
  // Ждем 5 секунд для записи видео
  await page.waitForTimeout(5000);

  // Заканчиваем запись видео
  await page.video().stopRecording();

  // Прикладываем видео к отчету Allure
  const allureAttachmentPath = path.join(__dirname, 'example-video.mp4');
  test.info().attach('Open Page Video', { path: allureAttachmentPath });

  // Делает скриншот
  const screenshotPath = path.join(__dirname, 'screenshot.png');
  await page.screenshot({ path: screenshotPath });

  // Прикладываем скриншот к отчету Allure
  test.info().attach('Page Screenshot', { path: screenshotPath });

  // Завершаем трассировку
  const tracePath = path.join(__dirname, 'trace.zip');
  await page.context().tracing.stop({ path: tracePath });

  // Прикладываем трассировку к отчету Allure
  test.info().attach('Page Trace', { path: tracePath });

  // Убедимся, что страница загрузилась
  await expect(page).toHaveTitle(/Example Domain/);
});
