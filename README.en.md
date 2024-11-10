# Automating Yandex SmartCaptcha solution using Puppeteer library

## Description

This example shows how to automate the solution of Yandex SmartCaptcha on the demo captcha page https://captcha-api.yandex.ru/demo. For automation we use the library [Puppeteer](https://pptr.dev/) and the captcha solving service [2captcha.com]. For correct work of the example you need `APIKEY`, for this you need to have an account in the service [2captcha.com], `APIKEY` is displayed in your personal cabinet.

## Usage

### Clone

`git clone https://github.com/dzmitry-duboyski/solving-yandex-smart-captcha-using-puppeteer.git`

### install dependens
`npm install`

### configure

Set up you `APIKEY` in [./index.js#L3](./index.js#L3)

> `APIKEY` is specified in your [2captcha.com] account. Before copying `APIKEY`, make sure that the **"developer"** role is selected in your account.

### Start

`npm run start`

## Source code

```js
import puppeteer from "puppeteer";
import { Solver } from "2captcha-ts";
const solver = new Solver("<Your 2captcha APIKEY>");

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  // Open target page
  await page.goto("https://captcha-api.yandex.ru/demo");
  await page.waitForSelector("#captcha-container");
  await page.waitForSelector("iframe[data-testid='checkbox-iframe'");

  // Enter data
  await page.$eval("#name", (el) => (el.value = ""));
  await page.type("#name", "John Doe", { delay: 100 });

  // Get the `sitekey` parameter from the current page
  const sitekey = await page.evaluate(() => {
    return document
      .querySelector("#captcha-container")
      .getAttribute("data-sitekey");
  });

  // Send a captcha to the 2captcha service to get a solution
  const res = await solver.yandexSmart({
    pageurl: "https://captcha-api.yandex.ru/demo",
    sitekey: sitekey,
  });

  console.log(res);

  // The resulting solution
  const captchaAnswer = res.data;

  // Use the resulting solution on the page
  const setAnswer = await page.evaluate((captchaAnswer) => {
    document.querySelector("input[data-testid='smart-token']").value =
      captchaAnswer;
  }, captchaAnswer);

  // Click on the 'Submit' button to check the captcha solution
  await page.click("#smartcaptcha-demo-submit");

  await page.waitForSelector(".greeting");

  console.log("Captcha solved successfully!!!");

  browser.close();
})();
```

Source code [index.js](/index.js)

> [!IMPORTANT] 
> If you need to solve the Yandex captcha that needs to be clicked, it is recommended to use [Coordinates API v1](https://2captcha.com/api-rucaptcha#coordinates?from=16653706) \ [Coordinates API v2](https://2captcha.com/api-docs/coordinates?from=16653706) method, more details are described in [article](https://captchaforum.com/threads/reshenie-kapchi-na-servisax-jandeks.4351/).


## Usefull links:

<!-- [Documentation Yandex SmartCaptcha on 2captcha.com](https://2captcha.com/2captcha-api#yandex?from=16653706). -->
- [Documentation on sending Yandex SmartCaptcha to 2captcha.com service (web.archive)](https://web.archive.org/web/20230917233148/https://rucaptcha.com/api-rucaptcha#yandex)
<!-- - [How bypass Yandex SmartCaptcha](https://2captcha.com/p/yandex-captcha-bypass-service/?from=16653706) -->
- [How to Bypass Yandex SmartCaptcha (web.archive)](https://web.archive.org/web/20230320212755/https://rucaptcha.com/p/yandex-captcha-bypass-service)

- [Article - Solving captcha on Yandex services with clicks](https://captchaforum.com/threads/reshenie-kapchi-na-servisax-jandeks.4351/)

- [Method Coordinates](https://2captcha.com/api-docs/coordinates/?from=16653706)


[2captcha.com]: https://2captcha.com/?from=16653706