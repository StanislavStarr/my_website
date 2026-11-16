# Запуск домена и включение индексации

Домен: `https://www.stanislavsinitsyn.com` (основной адрес — с `www`).

## Переменные окружения (Vercel → Settings → Environment Variables → Production)

| Переменная | Значение |
|------------|----------|
| `SITE_URL` | `https://www.stanislavsinitsyn.com` (без слэша на конце и без пути) |
| `ENABLE_INDEXING` | `true` |

`RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` не нужны: форма брифа выключена.
Для локальной разработки в `.env.local` оставьте `ENABLE_INDEXING=false`.
Переменные читаются на сборке: после изменения нужен **Redeploy**.

## Порядок (важно: сначала домен, потом переменные)

1. Vercel → Domains: добавить `www.stanislavsinitsyn.com` и `stanislavsinitsyn.com`.
   `www` — основной; `stanislavsinitsyn.com` настроить на редирект (308) на `www`.
2. У регистратора прописать DNS, которые покажет Vercel; дождаться «Valid Configuration» и HTTPS.
3. Открыть `https://www.stanislavsinitsyn.com` — сайт должен отвечать.
4. Только после этого задать переменные выше и сделать Redeploy.
   С этого момента старый адрес `stanislavstarr.vercel.app` автоматически
   редиректит (308) на новый (правило в `next.config.mjs`).
   Если включить переменные до готовности домена, старый адрес будет вести в никуда.

## Проверка после деплоя

```bash
curl -s https://www.stanislavsinitsyn.com/robots.txt        # Allow: / и Sitemap:
curl -s https://www.stanislavsinitsyn.com/sitemap.xml | grep -c '<loc>'   # 10
curl -s https://www.stanislavsinitsyn.com/ | grep -o '<meta name="robots"[^>]*>'   # index, follow
curl -sI https://stanislavsinitsyn.com/ | grep -i '^location'              # → www
curl -sI https://stanislavstarr.vercel.app/ | grep -i '^location'          # → новый домен
```

Дальше: Google Search Console (домен-ресурс, DNS-подтверждение), отправить sitemap;
Bing Webmaster Tools; Яндекс Вебмастер (гипотеза H2 в `AUDIT.md`).
