import BasePage from "./base.page";

export default class SearchPage extends BasePage {
  // 1. Locators
  get searchInput() {
    return this.driver.$("id=com.google.android.youtube:id/search_edit_text");
  }

  // ฟังก์ชันหาผลลัพธ์แบบ Dynamic (รับ keyword เข้ามาได้)
  getResultPlaylist(keyword: string) {
    const selector = `new UiSelector().descriptionContains("Appium")`;
    return this.driver.$(`android=${selector}`);
  }

  // 2. Actions
  async searchFor(keyword: string) {
    await this.waitForIsShown(this.searchInput);
    await this.searchInput.setValue(keyword);

    // กด Enter (KeyCode 66)
    await this.driver.pressKeyCode(66);
    console.log(`⌨️ [Search Page] Searched for: "Appium"`);
  }

  async verifyResultExists(keyword: string): Promise<boolean> {
    const resultElement = this.getResultPlaylist(keyword);

    try {
      // รอ 15 วิ
      await resultElement.waitForDisplayed({ timeout: 15000 });
      const text = await resultElement.getAttribute("content-desc");
      console.log(`🔎 [Search Page] Found: "${text}"`);
      return true;
    } catch (e) {
      console.error(
        `❌ [Search Page] Not found result with keyword: ${keyword}`,
      );
      return false;
    }
  }
}
