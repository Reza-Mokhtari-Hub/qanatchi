# QANATCHI PostgreSQL HTTP Gateway (`gateway/`)

این پوشه یک سرویس کوچک و مستقل Node.js است که بین **پردازش لبه آروان‌کلاد (Edge Computing)** و **پایگاه‌داده PostgreSQL** قرار می‌گیرد و هنگام بالا آمدن، **جدول‌های بازی را به‌صورت خودکار می‌سازد** (بدون نیاز به دستور `psql`).

## متغیرهای محیطی موردنیاز

| نام متغیر | مقدار | توضیح |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | رشته اتصال PostgreSQL (از پنل دیتابیس بگیرید) |
| `GATEWAY_AUTH_TOKEN` | رشته تصادفی حداقل ۲۴ کاراکتر | رمز مشترک بین درگاه و لبه (`LEADERBOARD_DATABASE_TOKEN`) |
| `DATABASE_SSL` | `true` / `no-verify` / `false` | اگر خطای گواهی SSL داد مقدار `no-verify` بگذارید (برای دیتابیس داخل شبکه خصوصی یا بدون TLS مقدار `false`) |
| `PORT` | `8080` | پورت اجرای سرویس |
| `AUTO_MIGRATE` | `true` | ساخت خودکار جدول‌ها هنگام اجرا |
