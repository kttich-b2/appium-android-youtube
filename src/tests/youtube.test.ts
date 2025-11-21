import { remote } from "webdriverio";
import HomePage from "../pages/home.page";
import SearchPage from "../pages/search.page";

// --- Config ---
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

async function runTest() {
  console.log("🚀 Starting Test ...");

  // 1. Init Driver
  const driver = await remote(capabilities);

  // 2. Init Pages (ส่ง driver เข้าไปให้ Page ใช้)
  const homePage = new HomePage(driver);
  const searchPage = new SearchPage(driver);

  const TEST_KEYWORD = "Appium Tutorial";

  try {
    // --- The Test Logic (Clean & Readable) ---

    // 1. Handle App Start
    await homePage.handleNotificationPermission();

    // 2. Verify Home Page
    if (await homePage.isOpened()) {
      console.log("✅ [Home Page] App is ready on Home Screen");
    }

    // 3. Perform Search
    await homePage.goToSearch();
    await searchPage.searchFor(TEST_KEYWORD);

    // 4. Verify Result
    const isFound = await searchPage.verifyResultExists(TEST_KEYWORD);

    if (isFound) {
      console.log("🎉 [Search Page] TEST PASSED: Playlist found!");
    } else {
      throw new Error("[Search Page] TEST FAILED: Playlist not found");
    }
  } catch (error) {
    const msg = (error as Error).message;
    console.error("💥 Error:", msg);
  } finally {
    await driver.deleteSession();
    console.log("🏁 Test Finished");
  }
}

runTest();
