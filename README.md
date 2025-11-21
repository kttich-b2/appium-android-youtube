Update from Local Machine B882
# 📘 Appium Automation Setup Guide (macOS + TypeScript)

## 🛠 Part 1: ติดตั้งโปรแกรมพื้นฐาน (Prerequisites)

### 1. ติดตั้ง Java JDK 17 (LTS)
มาตรฐานปัจจุบันของ Android Automation ต้องใช้ JDK 17 เท่านั้น
1.  เข้าเว็บ [Latest Releases | Adoptium](https://adoptium.net/temurin/releases)
2.  เลือก **Version 17 (LTS)**
3.  ดาวน์โหลดไฟล์ **.pkg** และติดตั้งให้เรียบร้อย

### 2. ติดตั้ง Node.js
Appium เขียนด้วย Node.js จำเป็นต้องมีตัวนี้
1.  เข้าเว็บ [Node.js](https://nodejs.org/)
2.  ดาวน์โหลดเวอร์ชัน **LTS** (Recommended for most users)
3.  ติดตั้งให้เรียบร้อย

### 3. ติดตั้ง Android Studio
เพื่อเอา SDK Tools และ Emulator
1.  ดาวน์โหลดและติดตั้ง [Android Studio](https://developer.android.com/studio).
2.  เปิดโปรแกรม ไปที่ **More Actions** > **SDK Manager**.
3.  **Tab SDK Platforms:** ติ๊กเลือก **Android 14.0 ("UpsideDownCake")**.
4.  **Tab SDK Tools:** ติ๊กเลือกรายการเหล่านี้:
    *   ✅ Android SDK Build-Tools
    *   ✅ Android SDK Command-line Tools (latest) **(สำคัญ)**
    *   ✅ Android Emulator
    *   ✅ Android SDK Platform-Tools
5.  กด **OK** เพื่อดาวน์โหลดและติดตั้ง

---

## ⚙️ Part 2: ตั้งค่า Environment Variables (สำคัญมาก)

ต้องบอกให้เครื่องรู้ว่า Java และ Android อยู่ที่ไหน

1.  เปิด **Terminal**
2.  พิมพ์คำสั่งเพื่อแก้ไขไฟล์ Config:
    ```bash
    nano ~/.zshrc
    ```
3.  Copy โค้ดด้านล่างไปวางต่อท้ายไฟล์:

    ```bash
    # --- JAVA SETUP (JDK 17) ---
    export JAVA_HOME=$(/usr/libexec/java_home -v 17)
    export PATH=$JAVA_HOME/bin:$PATH

    # --- ANDROID SDK SETUP ---
    # (Path นี้สำหรับ macOS ทั่วไป)
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export ANDROID_SDK_ROOT=$ANDROID_HOME
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
    export PATH=$PATH:$ANDROID_HOME/tools/bin
    ```
4.  กด **Ctrl+O** (Save) -> **Enter** -> **Ctrl+X** (Exit)
5.  สั่งให้ค่ามีผลทันที:
    ```bash
    source ~/.zshrc
    ```
6.  **ตรวจสอบความพร้อม:**
    ```bash
    java -version   # ต้องขึ้น 17.x.x
    adb --version   # ต้องขึ้น Android Debug Bridge...
    ```

---

## 🚀 Part 3: ติดตั้ง Appium Server

1.  ติดตั้ง Appium ผ่าน Terminal:
    ```bash
    npm install -g appium
    ```
2.  ติดตั้ง Driver สำหรับ Android:
    ```bash
    appium driver install uiautomator2
    ```
3.  (Optional) ตรวจสอบความสมบูรณ์:
    ```bash
    appium driver doctor uiautomator2
    ```
    *(ถ้าขึ้นเครื่องหมายถูกสีเขียวตรง ANDROID_HOME และ JAVA_HOME ถือว่าผ่าน)*

---

## 📱 Part 4: สร้าง Emulator (มือถือจำลอง) & Appium Inspector

1.  เปิด **Android Studio** > **Virtual Device Manager**.
2.  กด **(+) Create Device**.
3.  เลือก **Phone**: **Pixel 7** (ต้องมีรูปสามเหลี่ยม Play Store).
4.  เลือก System Image: **Android 14.0 (UpsideDownCake)**.
5.  ตั้งชื่อและกด Finish.
6.  **กดปุ่ม Play ▶️** เพื่อเปิดเครื่องทิ้งไว้ (ห้ามปิด).
7.  *แนะนำ:* เข้า Play Store ใน Emulator แล้ว Sign-in Google Account ไว้เลยจะดีมาก

---

**Appium Inspector** คือเครื่องมือหัวใจสำคัญของคนทำ Automate ครับ เพราะเราต้องใช้มันเพื่อ "ส่อง" ดูว่าปุ่มต่างๆ ในแอปชื่อว่าอะไร (ID, Accessibility ID, XPath) เพื่อเอามาเขียนใน Code

นี่คือขั้นตอน Setup และใช้งานแบบ Step-by-Step สำหรับ Appium V2 ครับ

---

### ขั้นตอนที่ 1: ดาวน์โหลดและติดตั้ง

Appium Inspector เป็นโปรแกรมแยก (ไม่ได้แถมมากับ Appium Server) ต้องโหลดเองครับ

1.  เข้าไปที่ GitHub Releases: [Appium Inspector Releases](https://github.com/appium/appium-inspector/releases)
2.  เลื่อนลงมาหาเวอร์ชันล่าสุด (เช่น 2024.x.x)
3.  เลือกไฟล์สำหรับ macOS:
    *   **Mac ชิป M1/M2/M3:** โหลดไฟล์ที่ลงท้ายด้วย `...-mac-arm64.dmg`
    *   **Mac ชิป Intel:** โหลดไฟล์ที่ลงท้ายด้วย `...-mac-x64.dmg`
    *   *(ถ้าไม่แน่ใจ หรือมีแค่ไฟล์เดียว ให้โหลดตัวที่เป็น `.dmg` ปกติ)*
4.  ติดตั้งโดยลากลง Applications ตามปกติ

---

### ⚠️ ขั้นตอนที่ 2: แก้ปัญหาเปิดโปรแกรมไม่ได้ (สำคัญสำหรับ Mac)

เมื่อคุณดับเบิ้ลคลิกเปิด Appium Inspector ครั้งแรก Mac มักจะฟ้องว่า *"Appium Inspector cannot be opened because the developer cannot be verified"* (เปิดไม่ได้เพราะไม่รู้จักผู้พัฒนา)

**วิธีแก้:**
1.  ไปที่โฟลเดอร์ **Applications**
2.  คลิกขวาที่ **Appium Inspector**
3.  เลือก **Open**
4.  จะมีหน้าต่างเด้งถาม ให้กดปุ่ม **Open** ยืนยันอีกที

*(หรือถ้ายังไม่ได้ ให้เปิด Terminal พิมพ์คำสั่งนี้แก้ครับ: `xattr -cr /Applications/Appium\ Inspector.app`)*

---

### ขั้นตอนที่ 3: การตั้งค่า Server (Connection)

เมื่อเปิดโปรแกรมมาแล้ว ให้กรอกค่าตามนี้ครับ (สำหรับ Appium V2):

*   **Remote Host:** `127.0.0.1`
*   **Remote Port:** `4723`
*   **Remote Path:** `/` 
    *   🚩 **ดอกจันล้านดวง:** Appium เวอร์ชันเก่าใช้ `/wd/hub` แต่เวอร์ชันใหม่ (V2) **ต้องใส่แค่ `/` เฉยๆ** ไม่งั้นจะ Connect ไม่ได้ครับ

---

### ขั้นตอนที่ 4: ใส่ค่า Capabilities (JSON)

ไม่ต้องมานั่งกรอกทีละช่องครับ ให้ใช้วิธี Copy Code ไปวางเลย ง่ายกว่า:

1.  เปิด **Appium Server** ใน Terminal (`appium`)
2.  เปิด **Emulator** (Pixel 7) รอไว้
3.  ใน Appium Inspector มองหาช่องที่เป็น `{JSON}` (Edit Raw JSON)
4.  ก๊อปปี้โค้ดข้างล่างนี้ไปวาง (ผมแก้ให้ตรงกับ SauceLabs Demo App ของคุณแล้ว):

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Pixel 7",
  "appium:platformVersion": "14.0",
  "appium:appPackage": "com.google.android.youtube",
  "appium:appActivity": "com.google.android.youtube.app.honeycomb.Shell$HomeActivity",
  "appium:noReset": false,
  "appium:ensureWebviewsHavePages": true,
  "appium:nativeWebScreenshot": true,
  "appium:newCommandTimeout": 3600,
  "appium:connectHardwareKeyboard": true
}
```

5.  กดปุ่ม **Save**
6.  กดปุ่มสีฟ้า **Start Session** 🔍

---

### ขั้นตอนที่ 5: วิธีใช้งาน (หา Element)

ถ้าเชื่อมต่อสำเร็จ คุณจะเห็นหน้าจอ Emulator โผล่ขึ้นมาในโปรแกรม Inspector

1.  **เลือก Element:** เอาเมาส์ไปคลิกที่ปุ่ม หรือรูปภาพ บนหน้าจอจำลองใน Inspector
2.  **ดูข้อมูลด้านขวา (Selected Element):**
    *   มองหา **accessibility-id** (สำคัญสุด! ถ้ามีใช้อันนี้ก่อน)
    *   ถ้าไม่มี ให้หา **id** (resource-id)
    *   ถ้าไม่มีจริงๆ ค่อยใช้ **xpath**
3.  **Copy ไปใช้:** กดปุ่ม Copy หลังค่าที่ต้องการ แล้วเอาไปวางใน Code Python/TypeScript ของคุณ

#### ตัวอย่างการเลือก Locator:
*   **ดีมาก (แนะนำ):** `AppiumBy.accessibilityId("Sauce Labs Backpack")`
*   **ดี:** `AppiumBy.id("com.saucelabs...:id/productIV")`
*   **พอใช้ (เลี่ยงได้ก็เลี่ยง):** `AppiumBy.xpath("//android.widget.ImageView[@content-desc='...']")`

ลองกดเล่นดูครับ ถ้าหน้าจอในแอปเปลี่ยน อย่าลืมกดปุ่ม **Refresh** (รูปวนลูป) ด้านบน Inspector เพื่ออัปเดตหน้าจอด้วยนะครับ!

---

## 💻 Part 5: สร้าง Project และเขียน Code

### 1. สร้างโฟลเดอร์โปรเจกต์
เปิด Terminal แล้วพิมพ์:
```bash
mkdir appium-youtube-test
cd appium-youtube-test
npm init -y
```

### 2. ติดตั้ง Library ที่ต้องใช้
```bash
npm install webdriverio ts-node typescript @types/node --save-dev
```

### 3. สร้างไฟล์ Config (tsconfig.json)
สร้างไฟล์ชื่อ `tsconfig.json` ใส่โค้ดนี้:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "noImplicitAny": false,
    "sourceMap": true,
    "esModuleInterop": true
  }
}
```

### 4. สร้างไฟล์ Test Script (test.ts)
สร้างไฟล์ชื่อ `test.ts` และ Copy โค้ดนี้ไปวาง:

```typescript
import { remote } from 'webdriverio';

// --- CONFIGURATION ---
const capabilities = {
    logLevel: 'error' as const, // ปิด Log รกๆ
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Pixel 7', // แก้ให้ตรงกับชื่อ Emulator
        'appium:platformVersion': '14.0',
        'appium:appPackage': 'com.google.android.youtube',
        'appium:appActivity': 'com.google.android.youtube.app.honeycomb.Shell$HomeActivity',
        'appium:noReset': false, // ถ้าใช้ True ต้องเปิด Emulator ให้อยู่หน้า Home
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 3600,
        'appium:connectHardwareKeyboard': true
    }
};

async function runYouTubeTest() {
    console.log("🚀 Starting Appium Test...");
    const driver = await remote(capabilities);

    // คำที่ต้องการค้นหาและตรวจสอบ
    const searchTerm = "Appium Step by Step"; 

    try {
        // STEP 0: Handle Permission Pop-up (ถ้ามี)
        try {
            const allowButton = driver.$('id=com.android.permissioncontroller:id/permission_allow_button');
            await allowButton.waitForDisplayed({ timeout: 3000 });
            await allowButton.click();
        } catch (e) { /* Ignore */ }

        // STEP 1: รอหน้า Home
        console.log("... Waiting for YouTube Home");
        const youtubeLogo = driver.$('~YouTube');
        await youtubeLogo.waitForDisplayed({ timeout: 10000 });
        console.log("✅ YouTube Opened");

        // STEP 2: กดปุ่ม Search
        const searchIcon = driver.$('~Search');
        await searchIcon.waitForDisplayed({ timeout: 5000 });
        await searchIcon.click();
        console.log("👆 Clicked Search Icon");

        // STEP 3: พิมพ์ข้อความ
        const searchInput = driver.$('id=com.google.android.youtube:id/search_edit_text');
        await searchInput.waitForDisplayed({ timeout: 5000 });
        await searchInput.setValue(searchTerm);
        console.log(`⌨️ Typed: "${searchTerm}"`);

        // STEP 4: กด Enter
        await driver.pressKeyCode(66);
        console.log("✅ Pressed Enter");

        // STEP 5: ตรวจสอบผลลัพธ์ (Verify)
        console.log(`... Verifying results...`);
        const selector = `new UiSelector().descriptionContains("Appium")`;
        const resultElement = driver.$(`android=${selector}`);
        
        await resultElement.waitForDisplayed({ timeout: 15000 });
        
        const resultText = await resultElement.getAttribute("content-desc");
        console.log(`🔎 Found: "${resultText}"`);
        console.log("🎉 TEST PASSED!");

        await driver.pause(2000);

    } catch (error) {
        // Show clean error message
        const errorMessage = (error as Error).message;
        console.error("💥 Error occurred:", errorMessage);
    } finally {
        await driver.deleteSession();
        console.log("🏁 Test Finished");
    }
}

runYouTubeTest();
```

---

## ▶️ Part 6: วิธีรัน (Running the Test)

ต้องเปิด 3 อย่างพร้อมกันตามลำดับ:

1.  **Terminal 1:** พิมพ์คำสั่งเพื่อเปิด Server
    ```bash
    appium
    ```
    *(ปล่อยทิ้งไว้ ห้ามปิด)*

2.  **Emulator:** ต้องเปิดหน้าจอมือถือรอไว้ (อยู่ที่หน้า Home)

3.  **Terminal 2 (VS Code):** พิมพ์คำสั่งรัน Script
    ```bash
    npx ts-node test.ts
    ```

**ผลลัพธ์:** คุณจะเห็นมือถือขยับเอง เปิด YouTube พิมพ์ค้นหา และ Terminal จะขึ้นข้อความ `🎉 TEST PASSED!` เป็นอันเสร็จสมบูรณ์ครับ ✅

Update from GitHub Web (Simulating Teammate)
