import BasePage from "./base.page";

export default class HomePage extends BasePage {
  // 1. Locators (Getter)
  get allowButton() {
    return this.driver.$(
      "id=com.android.permissioncontroller:id/permission_allow_button",
    );
  }
  get youtubeLogo() {
    return this.driver.$("~YouTube");
  }
  get searchIcon() {
    return this.driver.$("~Search YouTube");
  }
  get searchIconBackup() {
    return this.driver.$("~Search");
  }

  // 2. Actions (Methods)

  // ฟังก์ชันจัดการ Permission (Logic ที่เคยรกๆ ใน Test ย้ายมาอยู่นี่)
  async handleNotificationPermission() {
    try {
      await this.allowButton.waitForDisplayed({ timeout: 3000 });
      await this.allowButton.click();
      console.log("✅ Home Page] Pressed 'Allow' Permission");
    } catch (e) {
      console.log("ℹ️ [Home Page] No Permission Pop-up");
    }
  }

  async isOpened() {
    await this.waitForIsShown(this.youtubeLogo);
    return await this.youtubeLogo.isDisplayed();
  }

  async goToSearch() {
    try {
      await this.searchIcon.waitForDisplayed({ timeout: 3000 });
      await this.searchIcon.click();
    } catch (e) {
      // Fallback logic (ถ้าปุ่มชื่อไม่เหมือนกัน)
      await this.searchIconBackup.click();
    }
    console.log("👆 [Home Page] Clicked Search Icon");
  }
}
