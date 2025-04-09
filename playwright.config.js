
const { devices, defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./test",
  reporter: [
    ["list"],
    [
      "allure-playwright",
      {
        resultsDir: "./out/allure-results",
        environmentInfo: {
          node_version: process.version,
        },
      },
    ],
  ],
  use: {
    screenshot: "only-on-failure", // сохраняет скриншоты при падении
    video: "on",                    // записывает видео для каждого теста
    trace: "off",                    // включает трассировки для всех тестов
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
