import { remote } from "webdriverio";

const capabilities = {
  logLevel: "error" as const,
  hostname: "127.0.0.1",
  port: 4723,
  path: "/",
  capabilities: {
    platformName: "Android",
    "appium:automationName": "UiAutomator2",
    "appium:deviceName": "Pixel 7",
    "appium:platformVersion": "14.0",
    "appium:appPackage": "com.google.android.youtube",
    "appium:appActivity":
      "com.google.android.youtube.app.honeycomb.Shell$HomeActivity",
    "appium:noReset": false,
    "appium:autoGrantPermissions": true,
    "appium:newCommandTimeout": 3600,
    "appium:connectHardwareKeyboard": true,
  },
};

async function runYouTubeTest() {
  console.log("🚀 Starting Appium Test...");
  const driver = await remote(capabilities);

  const searchTerm = "Appium Tutorial";

  try {
    // --- STEP 0: จัดการ Pop-up Permission ---
    // (ไม่ต้องแก้ catch ตรงนี้ครับ ปล่อยให้มันเงียบๆ ไปถ้าไม่เจอ)
    try {
      const allowButton = driver.$(
        "id=com.android.permissioncontroller:id/permission_allow_button",
      );
      await allowButton.waitForDisplayed({ timeout: 3000 });
      await allowButton.click();
      console.log("✅ Pressed 'Allow' Permission");
    } catch (e) {
      console.log("ℹ️ No Permission Pop-up found (Skipping...)");
    }

    // --- STEP 1: เปิดแอป ---
    console.log("... Waiting for YouTube Home");
    const youtubeLogo = driver.$("~YouTube");
    await youtubeLogo.waitForDisplayed({ timeout: 10000 });
    console.log("✅ YouTube Opened");

    // --- STEP 2: คลิกปุ่มค้นหา (แก้ใหม่: สั้นลง) ---
    // ใช้ ~Search ตัวเดียวจบ ตามที่คุณต้องการ
    const searchIcon = driver.$("~Search");
    await searchIcon.waitForDisplayed({ timeout: 5000 });
    await searchIcon.click();
    console.log("👆 Clicked Search Icon");

    // --- STEP 3: พิมพ์ข้อความ ---
    const searchInput = driver.$(
      "id=com.google.android.youtube:id/search_edit_text",
    );
    await searchInput.waitForDisplayed({ timeout: 5000 });
    await searchInput.setValue(searchTerm);
    console.log(`⌨️ Typed: "${searchTerm}"`);

    // --- STEP 4: กด Enter ---
    await driver.pressKeyCode(66);
    console.log("✅ Pressed Enter");

    // --- STEP 5: ตรวจสอบผลลัพธ์ ---
    console.log(`... Verifying results contain: "${searchTerm}"`);

    const selector = `new UiSelector().descriptionContains("Appium Step by Step")`;
    const resultElement = driver.$(`android=${selector}`);

    await resultElement.waitForDisplayed({ timeout: 15000 });

    const resultText = await resultElement.getAttribute("content-desc");
    console.log(`🔎 Found Element: "${resultText}"`);
    console.log("🎉 TEST PASSED: เจอผลลัพธ์ที่ต้องการแล้ว!");

    await driver.pause(2000);
  } catch (error) {
    // --- Error จริงๆ (Main Error) ---
    // อันนี้แหละที่ต้องแก้ เพื่อไม่ให้ Log รก (เมื่อเทสพังจริงๆ)
    const errorMessage = (error as Error).message;
    console.error("💥 Error occurred:", errorMessage);
  } finally {
    await driver.deleteSession();
    console.log("🏁 Test Finished");
  }
}

runYouTubeTest();
