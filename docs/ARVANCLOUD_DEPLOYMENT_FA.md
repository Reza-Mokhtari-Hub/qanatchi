# راهنمای گام‌به‌گام استقرار «قنات‌چی» روی ابر آروان (ArvanCloud Edge + PostgreSQL + Object Storage)

> این راهنما تمام اجزای واقعی ساخت تولید، راه‌اندازی پایگاه‌داده پایدار PostgreSQL، درگاه HTTPS SQL، استقرار Edge Worker و بارگذاری فرانت‌اند برای کل **۱۰۰ مرحله کمپین (۱۲ مسیر و ۵۰ شهر)**، چالش روزانه و رقابت دوستانه را پوشش می‌دهد.

---

## ۱. ساخت بسته تولیدی و تأیید خودکار (Local Release Verification)

```bash
# ۱. نصب وابستگی‌ها
npm install

# ۲. ساخت و ممیزی باندل ArvanCloud Edge (خروجی: dist-edge/worker.js)
npm run build:edge

# ۳. بررسی کامل TypeScript (۰ خطا)
npm run lint

# ۴. اجرای تمام ۵۶ تست خودکار (موتور، ۱۰۰ مرحله کمپین، صدا، انیمیشن، کلاینت و Edge API + شبیه‌ساز HTTP SQL)
npm test

# ۵. ساخت فایل‌های استاتیک فرانت‌اند (dist/)
npm run build
```

---

## ۲. راه‌اندازی پایگاه‌داده پایدار (Managed PostgreSQL + HTTPS SQL Gateway)

از آنجا که محیط رایانش لبه ابر آروان از اتصال مستقیم سوکت TCP پایگاه‌داده یا Edge KV بومی پشتیبانی نمی‌کند، ارتباط امن از طریق درگاه HTTPS (`POST /sql`) انجام می‌شود:

1. در پنل ابر آروان، یک سرویس **پایگاه‌داده مدیریت‌شده PostgreSQL (نسخه ۱۴ به بالا)** بسازید و رشته اتصال (`DATABASE_URL`) آن را بردارید.
2. پوشه مستقل **`gateway/`** (شامل `Dockerfile`، `package.json` و `server.mjs`) را در **کانتینر ابری (Cloud Container / PaaS)** مستقر کنید و پشت دامنه HTTPS قرار دهید.
   - درگاه **`gateway/server.mjs`** هنگام اجرا به‌صورت خودکار تمام ۶ جدول و ایندکس‌های بازی (`001_initial_schema.sql`) را می‌سازد و نیازی به اجرای دستی `psql` نیست (مگر اینکه `AUTO_MIGRATE=false` بگذارید).
   - متغیرهای محیطی درگاه:
     - `DATABASE_URL`: رشته اتصال PostgreSQL
     - `GATEWAY_AUTH_TOKEN`: کلید تصادفی قوی (حداقل ۲۴ و ترجیحاً ۳۲+ کاراکتر) برای احراز هویت Bearer
     - `PORT`: `8080`
     - `DATABASE_SSL`: مقدار `true` (یا `no-verify` در صورت استفاده از گواهی self-signed، یا `false` در شبکه خصوصی بدون TLS)
3. سلامت درگاه را در مرورگر یا ترمینال بررسی کنید (باید `{"ok":true,...,"schemaReady":true}` برگرداند):
   ```bash
   curl -i https://<gateway-domain>/healthz
   ```

*(جایگزین رایگان و بدون کانتینر واسط: می‌توانید در سرویس رایگان **Neon (neon.tech)** یک دیتابیس بسازید، محتوای `edge/db/migrations/001_initial_schema.sql` را یک‌بار در **SQL Editor** سایت Neon اجرا کنید و در پنل لبه مقدار `LEADERBOARD_STORAGE_DRIVER=neon-http` و رشته `postgresql://...` را در `LEADERBOARD_DATABASE_URL` به‌صورت Encrypted بگذارید — بدون نیاز به `gateway/` یا سرور مجزا.)*

---

## ۳. استقرار Edge API روی رایانش لبه ابر آروان (`dist-edge/worker.js`)

1. وارد پنل ابر آروان → **رایانش لبه (Edge Computing)** شوید و یک اپلیکیشن (مثلاً `qanatchi-api`) بسازید.
2. محتوای فایل **`dist-edge/worker.js`** (~۱۹۴ کیلوبایت ASCII، سازگار با ویرایشگر وب) را بارگذاری و منتشر (Deploy) کنید.
3. متغیرهای محیطی زیر را در تنظیمات اپلیکیشن ثبت کنید (مقادیر حساس را به‌صورت **Encrypted** ذخیره کنید):

| نام متغیر | نوع | مقدار پیشنهادی |
| :--- | :--- | :--- |
| `APP_ENV` | Plain | `production` |
| `ALLOWED_ORIGINS` | Plain | در حالت هم‌دامنه خالی بگذارید؛ در حالت مجزا آدرس دقیق `https://` فرانت‌اند (مثلاً `https://qanatchi.example.ir`) |
| `LEADERBOARD_STORAGE_DRIVER` | Plain | `postgres-http` (برای درگاه `gateway/`) یا `neon-http` (برای اتصال مستقیم رایگان به Neon) |
| `LEADERBOARD_DATABASE_URL` | **Encrypted** | `https://<gateway-domain>` (برای `postgres-http`) یا رشته `postgresql://...` (برای `neon-http`) |
| `LEADERBOARD_DATABASE_TOKEN` | **Encrypted** | در حالت `postgres-http` همان `GATEWAY_AUTH_TOKEN` (در حالت `neon-http` اگر رشته اتصال در بالا داده شده خالی بگذارید) |
| `EDGE_SIGNING_SECRET` | **Encrypted** | کلید تصادفی قوی (۳۲+ کاراکتر) برای امضای `attemptToken` |
| `REQUIRE_ATTEMPT_TOKEN` | Plain | `true` (برای الزام توکن ضدتقلب سرور) یا `false` |
| `RATE_LIMIT_MAX_PER_MIN` | Plain | `60` |
| `ENABLE_STRUCTURED_LOGS` | Plain | `true` |

> متغیر `EC_URL` توسط ابر آروان مقداردهی می‌شود؛ آن را دستی تغییر ندهید.

---

## ۴. استقرار فرانت‌اند (`dist/`) و اتصال مسیرها

1. در صورت میزبانی API روی دامنه مجزا، هنگام بیلد فرانت‌اند متغیر `VITE_EDGE_API_URL=https://<api-domain>` را تنظیم کرده و `npm run build` بزنید. در حالت هم‌دامنه (توصیه‌شده) این متغیر را خالی بگذارید.
2. محتوای پوشه `dist/` را در **فضای ابری (Object Storage)** ابر آروان آپلود کرده و CDN را روی دامنه خود متصل کنید.
3. در تنظیمات مسیرها (Routes):
   - مسیر `<yourdomain.ir>/api/v1/*` را به اپلیکیشن Edge (`qanatchi-api`) متصل کنید.
   - مسیر `<yourdomain.ir>/*` را به باکت استاتیک `dist/` هدایت کنید (با حفظ Query String برای لینک‌های `/?challenge=Q1-...`).

---

## ۵. بررسی پس از استقرار (Verification Suite)

```bash
# ۱. سلامت و نسخه API (باید 100 مرحله کمپین و globalLeaderboard: true را نمایش دهد)
curl -fsS https://<yourdomain.ir>/api/v1/health
curl -fsS https://<yourdomain.ir>/api/v1/version

# ۲. آمادگی اتصال به پایگاه‌داده PostgreSQL (باید 200 OK و reachable: true بدهد)
curl -fsS https://<yourdomain.ir>/api/v1/ready

# ۳. دریافت چالش روزانه به وقت تهران
curl -fsS https://<yourdomain.ir>/api/v1/daily

# ۴. بررسی جدول امتیازات روزانه و جهانی
curl -fsS https://<yourdomain.ir>/api/v1/leaderboards/daily
curl -fsS https://<yourdomain.ir>/api/v1/leaderboards/global

# ۵. تست CORS (برای دامنه غیرمجاز نباید Access-Control-Allow-Origin برگردد)
curl -i -H "Origin: https://evil.example.com" https://<yourdomain.ir>/api/v1/health
```

---

## ۶. دستورالعمل بازگشت به نسخه قبل (Rollback)

1. در پنل رایانش لبه ابر آروان، از بخش **Deployments** نسخه سالم قبلی `qanatchi-api` را فعال کنید (یا موقتاً Route `/api/v1/*` را جدا کنید؛ فرانت‌اند بدون اختلال به حالت آفلاین سوئیچ می‌کند).
2. آرشیو قبلی `dist/` را در Object Storage بازیابی کرده و کش CDN را Purge کنید.
3. مجدداً خروجی `/api/v1/health` و `/api/v1/ready` را بررسی کنید.
