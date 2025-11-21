import { Browser } from "webdriverio";

export default class BasePage {
  protected driver: Browser;

  constructor(driver: Browser) {
    this.driver = driver;
  }

  // ฟังก์ชันแถม: เอาไว้รอ Element แบบง่ายๆ (Reuse ได้)
  async waitForIsShown(element: any, timeout = 10000) {
    await element.waitForDisplayed({ timeout });
  }
}
