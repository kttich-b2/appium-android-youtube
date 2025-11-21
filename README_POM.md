# 📘 Appium TypeScript Project (Page Object Model)

โครงการตัวอย่างการทำ **Mobile Automation** บนแอป YouTube โดยใช้ **TypeScript**, **WebdriverIO**, และโครงสร้างแบบ **Page Object Model (POM)** เพื่อความเป็นระเบียบและดูแลรักษาง่าย

---

## 🛠️ 1. โครงสร้างโปรเจกต์ (Project Structure)

```text
appium-youtube-pom/
├── src/
│   ├── pages/                  # เก็บ Page Objects (ตัวแทนหน้าจอ)
│   │   ├── base.page.ts        # Class แม่ (เก็บ Driver)
│   │   ├── home.page.ts        # หน้าแรก (Home Screen)
│   │   └── search.page.ts      # หน้าค้นหา (Search Screen)
│   └── tests/                  # เก็บ Test Scripts
│       └── youtube.test.ts     # ไฟล์รันเทส (Main Logic)
├── package.json
└── tsconfig.json
```

---

## 📝 2. โค้ดทั้งหมด (Copy ไปวางตามชื่อไฟล์)

### 📂 `src/pages/base.page.ts`
```typescript
import { Browser } from 'webdriverio';

export default class BasePage {
    protected driver: Browser;

    constructor(driver: Browser) {
        this.driver = driver;
    }

    /**
     * ฟังก์ชันช่วยรอ Element ให้พร้อมใช้งาน (ลด Code ซ้ำ)
     */
    async waitForIsShown(element: any, timeout = 10000) {
        await element.waitForDisplayed({ timeout });
    }
}
```

### 📂 `src/pages/home.page.ts`
```typescript
import BasePage from './base.page';

export default class HomePage extends BasePage {

    // 1. Locators (Getters)
    get allowButton() { return this.driver.$('id=com.android.permissioncontroller:id/permission_allow_button'); }
    get youtubeLogo() { return this.driver.$('~YouTube'); }
    get searchIcon() { return this.driver.$('~Search YouTube'); }
    get searchIconBackup() { return this.driver.$('~Search'); }

    // 2. Actions (Methods)
    
    // จัดการ Permission Pop-up (ถ้ามี)
    async handleNotificationPermission() {
        try {
            // รอแค่ 3 วิพอ ถ้าไม่มาแปลว่าไม่มี
            await this.allowButton.waitForDisplayed({ timeout: 3000 });
            await this.allowButton.click();
            console.log("✅ [Page] Pressed 'Allow' Permission");
        } catch (e) {
            console.log("ℹ️ [Page] No Permission Pop-up found");
        }
    }

    async isOpened() {
        await this.waitForIsShown(await this.youtubeLogo);
        return await this.youtubeLogo.isDisplayed();
    }

    async goToSearch() {
        try {
            await this.searchIcon.waitForDisplayed({ timeout: 5000 });
            await this.searchIcon.click();
        } catch (e) {
            // Fallback: ถ้าชื่อ Search YouTube ไม่เจอ ให้หา Search เฉยๆ
            await this.searchIconBackup.click();
        }
        console.log("👆 [Page] Clicked Search Icon");
    }
}
```

### 📂 `src/pages/search.page.ts`
**(แก้ไขตาม Requirement: ใช้ Static Selector "Appium")**
```typescript
import BasePage from './base.page';

export default class SearchPage extends BasePage {

    // 1. Locators
    get searchInput() { return this.driver.$('id=com.google.android.youtube:id/search_edit_text'); }

    // (Static) ตัวผลลัพธ์ที่เราจะ Verify ว่าต้องเจอคำว่า "Appium"
    get resultPlaylist() {
        const selector = `new UiSelector().descriptionContains("Appium")`;
        return this.driver.$(`android=${selector}`);
    }

    // 2. Actions
    async searchFor(keyword: string) {
        await this.waitForIsShown(await this.searchInput);
        await this.searchInput.setValue(keyword);
        
        // กด Enter (Android KeyCode 66)
        await this.driver.pressKeyCode(66);
        console.log(`⌨️ [Page] Searched for: "${keyword}"`);
    }

    async verifyResultAppiumExists(): Promise<boolean> {
        try {
            // รอ 15 วินาที เผื่อเน็ตช้า
            await this.resultPlaylist.waitForDisplayed({ timeout: 15000 });
            
            const text = await this.resultPlaylist.getAttribute("content-desc");
            console.log(`🔎 [Page] Found Element: "${text}"`);
            return true;
        } catch (e) {
            console.error(`❌ [Page] Element containing 'Appium' NOT FOUND!`);
            return false;
        }
    }
}
```

### 📂 `src/tests/youtube.test.ts`
**(แก้ไขตาม Requirement: ใช้ `noReset: false`)**
```typescript
import { remote } from 'webdriverio';
import HomePage from '../pages/home.page';
import SearchPage from '../pages/search.page';

// --- Configuration ---
const capabilities = {
    logLevel: 'error' as const,
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Pixel 7', // แก้ให้ตรงกับ Emulator ของคุณ
        'appium:platformVersion': '14.0',
        'appium:appPackage': 'com.google.android.youtube',
        'appium:appActivity': 'com.google.android.youtube.app.honeycomb.Shell$HomeActivity',
        
        // 🚩 Config สำคัญ: ล้างเครื่องใหม่ทุกรอบ (Clean State)
        // ข้อดี: มั่นใจว่าเริ่มที่หน้าแรกเสมอ
        // ข้อเสีย: ต้องกด Allow Permission ทุกครั้ง (ซึ่งเราเขียนโค้ดดักไว้แล้ว)
        'appium:noReset': false, 
        
        'appium:autoGrantPermissions': true, // ให้ Server ช่วยกด Allow ให้ก่อน (ถ้าทำได้)
        'appium:newCommandTimeout': 3600,
        'appium:connectHardwareKeyboard': true
    }
};

async function runTest() {
    console.log("🚀 Starting Test (POM Pattern)...");
    
    // 1. Init Driver
    const driver = await remote(capabilities);

    // 2. Init Pages (Dependency Injection)
    const homePage = new HomePage(driver);
    const searchPage = new SearchPage(driver);

    const SEARCH_KEYWORD = "Appium Step by Step";

    try {
        // --- Test Steps ---
        
        // Step 0: จัดการ Permission (เพราะ noReset: false แอปจะถามใหม่ทุกรอบ)
        await homePage.handleNotificationPermission();
        
        // Step 1: เช็คว่าอยู่หน้า Home จริงไหม
        if (await homePage.isOpened()) {
            console.log("✅ App is ready on Home Screen");
        }

        // Step 2: กดค้นหา
        await homePage.goToSearch();
        
        // Step 3: พิมพ์คำค้นหา
        await searchPage.searchFor(SEARCH_KEYWORD);

        // Step 4: ตรวจสอบผลลัพธ์ (Static Check: หาคำว่า Appium)
        const isFound = await searchPage.verifyResultAppiumExists();

        if (isFound) {
            console.log("🎉 TEST PASSED: Playlist found!");
        } else {
            throw new Error("TEST FAILED: Playlist not found");
        }

    } catch (error) {
        const msg = (error as Error).message;
        console.error("💥 Error:", msg);
    } finally {
        // ปิด Session (ล้างแอปทิ้ง)
        await driver.deleteSession();
        console.log("🏁 Test Finished");
    }
}

runTest();
```

---

## ▶️ 3. วิธีรัน (How to Run)

1.  **Start Appium Server:**
    ```bash
    appium
    ```
2.  **Start Emulator:** เปิด Pixel 7 รอไว้
3.  **Run Test:**
    ```bash
    npx ts-node src/tests/youtube.test.ts
    ```

**ผลลัพธ์ที่คาดหวัง:**
1.  Appium จะ **Re-install** หรือ **Clear Data** แอป YouTube (เพราะ `noReset: false`).
2.  แอปจะเปิดขึ้นมาใหม่เอี่ยมเหมือนเพิ่งโหลด.
3.  Code จะกด Allow Notification (ถ้ามี).
4.  กดค้นหา -> พิมพ์ "Appium Step by Step" -> กด Enter.
5.  ตรวจสอบว่าเจอ Playlist ที่มีคำว่า "Appium" และจบการทำงานด้วย `TEST PASSED`.
