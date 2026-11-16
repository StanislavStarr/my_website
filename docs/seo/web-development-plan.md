# План страницы `/services/web-development` (EN и RU)

Дата: 16.11.2026. Основа: `CLUSTERS.md`, `SXO.md`, `PRODUCT.md`, `DESIGN.md`.
Режим: **Persuade** (посетитель решает, писать ли). Действие: обсудить проект (Telegram / email).

## 1. Задача и аудитория

- **Кто приходит:** владелец малого бизнеса или основатель продукта из поиска по запросам
  «разработка сайтов на заказ React / Next.js» и «Next.js React web development»; вторично —
  техдиректор или рекрутер, который проверяет компетенции.
- **Что должен понять за минуту:** что именно разрабатывается (сайты, веб-приложения, SaaS,
  личные кабинеты), на чём, и подтверждено ли это реальными проектами.
- **Единственное действие:** «Обсудить проект» (Telegram, запасной вариант — email).
- **Тип страницы по `SXO.md`:** страница конкретной услуги, а не визитка. Главная остаётся хабом.

## 2. Границы (решения владельца)

- Без цен, сроков, условий работы, договора, гарантий.
- Без Mini Apps, React Native, ботов как готовых направлений (кейсов нет).
- Только реальные кейсы: Client Base, eKhonish, «Железнодорожная логистика», MedTech.
  Названия кейсов не меняются. Формулировки берутся из `src/content/projects.json`.
- Блок кейсов на главной остаётся без изменений.
- Дизайн-язык сохраняется: тёмный фон, янтарный акцент, LCD-панели, Geologica + JetBrains Mono.
  Нет eyebrow-подписей, рядов метрик и «[1]» нумерации (кроме шагов процесса).
- Никаких выдуманных цифр, клиентов, отзывов. Объём видимого текста: 600–900 слов (RU больше).

## 3. Структура страницы (сверху вниз)

1. **Hero.** Хлебные крошки «Главная / Веб-разработка» (мелко, моно). H1 с ключом, 2 предложения
   вводного текста, основная кнопка «Обсудить проект» + текстовая ссылка «Смотреть проекты»
   (якорь на блок кейсов). Справа **LCD-панель «стек»**: реальные технологии построчно
   (React, Next.js, Vue, Nuxt, TypeScript, Node.js) в JetBrains Mono. Это фокусный момент:
   данные, а не декорация, плюс узнаваемая «консоль» сайта. Не ряд метрик.
2. **Что я делаю.** Пять видов работ редакционным списком с тонкими линиями (не сетка карточек):
   сайты; веб-приложения и SPA; SaaS и CRM; личные кабинеты и порталы; интеграции и миграции.
   Каждый пункт опирается на реальный кейс.
3. **Где я это делал.** Таблица кейсов (тот же компонент, что на главной, вынести в общий
   `WorkRows`), примечание «командные проекты, внутри каждого моя роль».
4. **Как идёт работа.** Четыре нумерованных шага (порядок важен — нумерация оправдана).
   Без сроков.
5. **Вопросы.** Четыре `<details>` без вопроса о цене.
6. **Финал.** Существующий компонент `Contact` (заголовок «Давайте заставим это работать»,
   Telegram-орб, email).

## 4. Контент

Ключи в `messages/en.json` и `messages/ru.json`, пространство имён `webDev`
(тест на паритет ключей уже есть). Теги `<br>` и `<em>` разрешены.

### EN

- **title:** Web Development with React & Next.js — Stanislav Sinitsyn
- **description:** Websites, web apps, SaaS and customer portals on React, Next.js, Vue and Node.js. Full-stack development by an independent developer, from first sketch to launch.
- **crumb:** Home / Web development
- **H1:** Web development on `<em>React</em>` and Next.js
- **intro:** I design and build websites, web apps, SaaS products and customer portals: the interface, the API behind it and the integrations between them. You work directly with me.
- **CTA:** Discuss your project · **link:** See the projects
- **LCD label:** stack
- **Что я делаю (H2 «What I build»):**
  1. *Websites* — Company and product sites, landing pages and content sites. Clear structure, server-rendered pages and structured data, so search engines and AI assistants can read them.
  2. *Web apps and SPAs* — Interactive products in the browser: dashboards, booking flows, reporting and map-based screens.
  3. *SaaS and CRM* — Multi-role systems with customers, orders, documents and reports, from database models and APIs to the interface.
  4. *Customer portals and accounts* — Portals where customers book, track and download, including single sign-in across several applications.
  5. *Integrations and migrations* — Third-party services, e-signature, webhooks, build tooling and framework migrations in products that keep shipping.
- **Proof H2:** Where I've done this · **note:** Contributions to team projects. Open a project to see my role.
- **Process H2:** How the work goes
  1. *Goal and audience* — We start with what the site or app must achieve, who uses it, and what already exists.
  2. *Structure and scope* — Pages, user flows, data and integrations are agreed before development starts.
  3. *Build and review* — I build in stages you can open and comment on, so decisions are made on real screens.
  4. *Launch and handover* — Testing, deployment, analytics and a clear handover. Further releases as needed.
- **FAQ H2:** Common questions
  - *Which technologies do you use?* — React and Next.js, or Vue and Nuxt, with TypeScript and Node.js on the server. The choice depends on the product and on who will maintain it.
  - *Can you work from my design?* — Yes. If you have designs, I build from them. If not, we start from the idea and work through structure, user flows and interface together.
  - *Can you improve an existing site?* — Yes: new features, integrations, performance work and migrations. We start from what you have now.
  - *Will the site be found in search?* — I build pages that can be indexed: clean markup, metadata, structured data and a sitemap. Rankings depend on many factors and cannot be guaranteed.

### RU

- **title:** Разработка сайтов и веб-приложений на React и Next.js — Станислав Синицын
- **description:** Сайты, веб-приложения, SaaS и личные кабинеты на React, Next.js, Vue и Node.js. Фулстек-разработка от независимого разработчика: от первых набросков до запуска.
- **crumb:** Главная / Веб-разработка
- **H1:** Разработка сайтов и веб-приложений на `<em>React</em>` и Next.js
- **intro:** Проектирую и разрабатываю сайты, веб-приложения, SaaS и личные кабинеты: интерфейс, API за ним и интеграции между ними. Вы работаете напрямую со мной.
- **CTA:** Обсудить проект · **link:** Смотреть проекты
- **LCD label:** стек
- **Что я делаю (H2 «Что я делаю»):**
  1. *Сайты* — Корпоративные и продуктовые сайты, лендинги и контентные проекты. Понятная структура, серверный рендеринг и структурированные данные, чтобы страницы читали поисковики и ИИ-ассистенты.
  2. *Веб-приложения и SPA* — Интерактивные продукты в браузере: дашборды, сценарии бронирования, отчёты и экраны с картой.
  3. *SaaS и CRM* — Системы с ролями, клиентами, заказами, документами и отчётами: от моделей данных и API до интерфейса.
  4. *Личные кабинеты и порталы* — Порталы, где клиенты бронируют, отслеживают и скачивают, в том числе с единой авторизацией для нескольких приложений.
  5. *Интеграции и миграции* — Сторонние сервисы, электронная подпись, webhooks, сборка и миграции фреймворков в продуктах, которые продолжают выходить.
- **Proof H2:** Где я это делал · **note:** Командные проекты. Внутри каждого кейса — моя роль.
- **Process H2:** Как идёт работа
  1. *Цель и аудитория* — Начинаем с того, чего должен достичь сайт или приложение, кто им пользуется и что уже есть.
  2. *Структура и объём* — Страницы, сценарии, данные и интеграции согласуем до начала разработки.
  3. *Разработка и проверка* — Делаю этапами, которые можно открыть и прокомментировать: решения принимаем на настоящих экранах.
  4. *Запуск и передача* — Проверка, размещение, аналитика и понятная передача проекта. Новые релизы по необходимости.
- **FAQ H2:** Частые вопросы
  - *Какие технологии вы используете?* — React и Next.js или Vue и Nuxt, TypeScript, на сервере Node.js. Выбор зависит от продукта и от того, кто будет его поддерживать.
  - *Можно работать по моему дизайну?* — Да. Если макеты есть, разрабатываю по ним. Если нет, начинаем с идеи и вместе проходим структуру, сценарии и интерфейс.
  - *Можно доработать существующий сайт?* — Да: новые функции, интеграции, повышение производительности и миграции. Начинаем с текущего состояния.
  - *Найдут ли сайт в поиске?* — Делаю страницы, которые можно индексировать: чистая разметка, метаданные, структурированные данные и sitemap. Позиции зависят от многих факторов, и гарантировать их нельзя.

Проверка честности: каждый пункт «Что я делаю» опирается на реальный кейс (Client Base — SaaS/CRM,
SignNow и webhooks; «Железнодорожная логистика» — бронирование, дашборды, карта, миграция на Vite;
eKhonish — единая авторизация, компоненты; MedTech — ролевой доступ, сканирование). Сроков, цен,
условий нет. Утверждение про поиск содержит оговорку о том, что позиции не гарантируются.

## 5. SEO и разметка

- **URL:** `/services/web-development` (EN) и `/ru/services/web-development`; canonical и hreflang
  через существующий `pageMetadata` (`path: '/services/web-development'`).
- **JSON-LD:** `WebPage` + `BreadcrumbList` (Главная → Веб-разработка) + `Service` со своим `url`
  и описанием (вместо общего `#services`). `FAQPage` на этой странице **не добавляем**: Google
  не показывает FAQ rich results, пользы для выдачи нет; вопросы остаются видимым контентом.
- **Один H1**, H2 по разделам, H3 только внутри пунктов; заголовки отражают запрос.
- **Sitemap:** добавить страницу (станет 12 URL: 6 путей × 2 языка).
- **Внутренние ссылки:** карточка «Веб-разработка» на главной ведёт на страницу; со страницы — на
  кейсы и на главную; на странице кейса — ссылка «Веб-разработка» (все четыре кейса относятся
  к этой услуге).

## 6. Дизайн и взаимодействие

Не CSS, а намерение; цвета, шрифты и тайминги — из `DESIGN.md`.

- **Композиция hero:** на десктопе две колонки: текст слева, LCD-панель «стек» справа
  (как консоль на главной, но без портрета и игры). На мобильном панель идёт после вводного
  текста и кнопок. H1 с янтарным `<em>`, как на главной, но компактнее (страница услуги, а не
  визитка), без boot-оверлея и без побуквенной анимации заголовка.
- **«Что я делаю»:** слева липкий заголовок раздела, справа список из пяти пунктов с линиями
  между ними; на мобильном — обычный столбец. Название пункта крупнее, описание приглушённым.
- **Кейсы:** строки LCD-таблицы со стрелкой, как на главной (переходы с занавесом сохраняются).
- **Шаги:** как на главной (`step`), моно-цифры; scramble-эффект допустим, он отключается
  переключателем движения.
- **FAQ:** `<details>` как на главной (без JS).
- **Движение:** reveal при прокрутке, магнитные кнопки, заливка пилюль. Всё отключается
  `prefers-reduced-motion` и переключателем на сайте. Контент виден без JS.
- **Состояния и диапазоны:** RU-тексты на 25–35 % длиннее; H1 RU длинный (проверять на 320 px
  без горизонтальной прокрутки); у пункта «Что я делаю» от 1 до 3 строк.
- **Доступность:** хлебные крошки в `<nav aria-label>`, видимый фокус, контраст на тёмном и LCD,
  заголовки без пропусков уровней.
- **Анти-цели:** сетка одинаковых карточек, ряд цифр-метрик, «[01]»-нумерация вне шагов,
  градиентный текст, чужие стоковые картинки.

## 7. Реализация (для следующего шага)

Файлы:
- новый `src/app/[locale]/services/web-development/page.tsx` (метаданные, структура, JSON-LD);
- новый общий `src/components/WorkRows.tsx` (вынести из `Landing.tsx`, оба места используют его);
- правки `src/lib/structured-data.ts` (вариант для страницы услуги), `src/app/sitemap.ts`;
- `Landing.tsx`: ссылка на страницу у карточки «Веб-разработка»; `CaseDetails.tsx`: ссылка на услугу;
- `messages/en.json`, `messages/ru.json` (`webDev`), `src/styles/site.module.css` (новые классы);
- тесты: `tests/core.test.ts` (12 URL в sitemap, Service/WebPage без FAQ), `scripts/smoke-test.mjs`
  (страница EN/RU, один H1, canonical);
- документы: `DESIGN.md`, `README.md`, статус в `PLAN.md`.

Риск: параллельный маршрут `@modal/[...catchAll]` не должен перехватывать новую страницу при
клиентском переходе — проверить в браузере.

Проверка: `npm test`, `npm run typecheck`, сборка, smoke; скриншоты EN/RU на 1440, 390 и 320 px;
hreflang и JSON-LD новой страницы; клавиатура и reduced-motion; подсчёт слов.

## 8. Допущения (не подтверждены владельцем отдельно)

- Формулировка H1 с `React` в акценте. Если нужен другой акцент или без него — поменять в `webDev.h1`.
- Пять пунктов «Что я делаю» и тексты FAQ — моя редакция существующих формулировок сайта.
- Хлебные крошки двухуровневые (отдельной страницы «Услуги» нет).
