import puppeteer from "puppeteer";
import { Solver } from "2captcha-ts";
const solver = new Solver('<Your 2captcha api key>');

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  // Открыть необходимую страницу с капчей
  // Open target page
  await page.goto("https://captcha-api.yandex.ru/demo");
  await page.waitForSelector("#captcha-container");
  await page.waitForSelector("iframe[data-testid='checkbox-iframe'");

  // Заполнить поля для ввода
  // Enter data
  await page.$eval("#name", (el) => (el.value = ""));
  await page.type("#name", "Иван Иванов", { delay: 100 });

  // Получить параметр `sitekey` с текущей страницы
  // Get the `sitekey` parameter from the current page
  const sitekey = await page.evaluate(() => {
    return document
      .querySelector("#captcha-container")
      .getAttribute("data-sitekey");
  });

  // Отправить капчу в сервис 2captcha для получения решения
  // Send a captcha to the 2captcha service to get a solution
  const res = await solver.yandexSmart({
    pageurl: "https://captcha-api.yandex.ru/demo",
    sitekey: sitekey,
  });

  console.log(res);

  // Полученное решение
  // The resulting solution
  const captchaAnswer = res.data;

  // Использовать полученное решение на странице
  // Use the resulting solution on the page
  const setAnswer = await page.evaluate((captchaAnswer) => {
    document.querySelector("input[data-testid='smart-token']").value =
      captchaAnswer;
  }, captchaAnswer);

  // Нажать на кнопку 'Submit', для проверки решения капчи
  // Click on the 'Submit' button to check the captcha solution
  await page.click("#smartcaptcha-demo-submit");

  await page.waitForSelector(".greeting");
  console.log("Капча успешно решена!!!");
  console.log("Captcha solved successfully!!!");

  browser.close();
})();
