# Portfolio

Демо-сайти для портфоліо. Кожен проєкт — окрема папка, чистий HTML/CSS/JS без збірки.

| Проєкт | Опис | Папка |
|---|---|---|
| RAZOR & CO. | Лендінг барбершопу з онлайн-записом | [`barbershop/`](barbershop/) |
| NORTH SOLE | Інтернет-магазин кросівок: каталог, фільтри, кошик, checkout | [`sneakers/`](sneakers/) |
| BREW LAB | Telegram Mini App кав'ярні: меню, замовлення на виніс, картка лояльності | [`coffee/`](coffee/) |

### Telegram Mini App (`coffee/`)

Це звичайна веб-сторінка з підключеним `telegram-web-app.js`. У браузері працює із запасною кнопкою, усередині Telegram — з рідними `MainButton`, `BackButton` і haptic.
Щоб відкрити в Telegram: створіть бота в [@BotFather](https://t.me/BotFather) → `/newapp` (або кнопка меню в `/mybots`) → вкажіть адресу `https://<ваш-нік>.github.io/portfolio/coffee/`.

Локальний запуск:

```bash
python -m http.server 5180 --directory barbershop
```

Публікація — автоматично через GitHub Pages (workflow у `.github/workflows/pages.yml`).
