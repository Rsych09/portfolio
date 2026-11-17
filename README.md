# Portfolio

Демо-сайти для портфоліо. Кожен проєкт — окрема папка, чистий HTML/CSS/JS без збірки.

| Проєкт | Опис | Папка |
|---|---|---|
| RAZOR & CO. | Лендінг барбершопу з онлайн-записом | [`barbershop/`](barbershop/) |
| NORTH SOLE | Інтернет-магазин кросівок: каталог, фільтри, кошик, checkout | [`sneakers/`](sneakers/) |

Локальний запуск:

```bash
python -m http.server 5180 --directory barbershop
```

Публікація — автоматично через GitHub Pages (workflow у `.github/workflows/pages.yml`).
