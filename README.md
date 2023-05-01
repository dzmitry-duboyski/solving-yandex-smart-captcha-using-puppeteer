# Автоматизации решения капчи Yandex SmartCaptcha от Яндекса с использованием библиотеки Puppeteer

## Описание

В этом примере показывается как автоматизировать решение капчи Yandex SmartCaptcha на демо странице капчи https://captcha-api.yandex.ru/demo. Для автоматизации используется библиотека [Puppeteer](https://pptr.dev/) и сервис решения капч [2captcha.com](https://2captcha.com/?from=16653706). Для корректной работы примера нужен `APIKEY`, для этого необходимо иметь аккаунт в сервисе [2captcha.com](https://2captcha.com/?from=16653706), `APIKEY` отображается в личном кабинете.

## Установка

### Клонирование репозитория

`git clone https://github.com/dzmitry-duboyski/solving-yandex-smart-captcha-using-puppeteer.git`

### Установка зависимостей

`npm install`

### Настройка

Установить ваш `APIKEY` в файле [./index.js#L3](./index.js#L3)

> `APIKEY` указан в личном кабинете аккаунта [2captcha.com](https://2captcha.com/?from=16653706). Перед копированием `APIKEY`, проверьте что в вашем аккаунте выбрана роль **"разработчик"**.
<!-- > Скриншот: -->

### Запуск

`npm run start`

## Код примера

```js
import puppeteer from "puppeteer";
import { Solver } from "2captcha-ts";
const solver = new Solver("<Your 2captcha APIKEY>");

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

  // Отправить капчу в сервис 2captcha.com для получения решения
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
```

Исходный код примера доступен в файле [index.js](/index.js)

## Дополнительные ссылки:

- [Документация по отправке Yandex SmartCaptcha в сервис 2captcha.com](https://2captcha.com/2captcha-api#yandex?from=16653706).
- [Как обойти Yandex SmartCaptcha](https://2captcha.com/p/yandex-captcha-bypass-service/?from=16653706)
