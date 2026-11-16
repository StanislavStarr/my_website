# Кластеры и архитектура страниц услуг

Дата: 16.11.2026. Основа для Фазы 3 из `PLAN.md`. Интерактивная карта: `cluster-map.html`,
данные: `cluster-plan.json`.

## Ограничения исследования (читать первым)

- **Что сделано:** 12 SERP-запросов по головным терминам (6 RU, 6 EN), сравнение выдач
  по URL вручную. Полный попарный протокол из методики (сотни запросов, 30–50 вариантов
  ключей) не выполнялся.
- **Что не измерено:** частотность и сложность запросов (нет DataForSEO), позиции,
  PAA-вопросы и блоки выдачи (инструмент поиска их не возвращает).
- **Гео:** поиск выполняется из США. Выдача для РФ/СНГ и тем более Яндекс не измерены.
  RU-выводы — ГИПОТЕЗЫ о типах страниц, а не данные Яндекса/Google.RU.
- Источники: страницы fl.ru, purrweb.com, sostav.ru, vc.ru, workspace.ru, kokoc.com, habr.com,
  innowise.com, redwerk.com, pixelplex.io, dev.family, merge.rocks, Upwork, Fiverr, Contra,
  Clutch (все получены через веб-поиск 16.11.2026).

## Что показала выдача (ПОДТВЕРЖДЕНО в рамках этих 12 запросов)

| Запрос | Что в выдаче | Тип страниц |
|--------|--------------|-------------|
| RU: разработка сайтов фрилансер React/Next.js | fl.ru (каталоги, портфолио, карточки услуг), purrweb | биржа + услуга агентства |
| RU: Telegram Mini App на заказ | purrweb (услуга), fl.ru, vc.ru и sostav (гайды «как заказать», «сколько стоит»), dtf, workspace | смесь: услуги + гайды |
| RU: React Native на заказ | purrweb, workspace (каталог 159 исполнителей), fl.ru | агентства + биржи |
| RU: Telegram-бот под ключ | fl.ru (много карточек), purrweb, kokoc, directline, статьи sostav/habr | биржа + услуги + гайды |
| RU: GEO для нейросетей (услуга) | sostav, kokoc, vc.ru, habr, workspace, unisender: **только статьи и объяснения** | информационные |
| RU: SaaS MVP на заказ | fl.ru, purrweb, workspace, sostav + EN-блоги (acropolium, clockwise, redwerk) | услуги + гайды |
| EN: hire freelance React/Next.js developer | Upwork, Fiverr, Freelancer, Toptal, Contra, Codementor | **маркетплейсы** |
| EN: Telegram Mini App development | innowise, redwerk, merge.rocks, metalamp, pixelplex, dev.family, Fiverr | страницы услуг агентств |
| EN: React Native services | десятки «hire React Native developers» агентств | страницы услуг агентств |
| EN: GEO services | netpeak, seo.com, Clutch, обзоры «best GEO agencies» | услуги + рейтинги |
| EN: PWA services | десятки страниц услуг агентств | страницы услуг агентств |
| EN: SaaS MVP freelance | Upwork/Fiverr/Contra (gig-страницы) + агентства | маркетплейсы + услуги |

**Перекрытие по URL между 12 запросами: общих URL в выдачах не обнаружено.** По правилам
методики (0–1 общий результат) это отдельные кластеры, то есть отдельные страницы.

## Решения

1. **Telegram: разделить на две страницы, а не одну.** В плане стояла
   `/services/telegram-mini-apps-and-bots`. Выдача по RU показывает отдельные страницы услуг
   под Mini App и под ботов (у purrweb они разные). Раздельные страницы совпадают с интентом.
2. **Головной EN-запрос «hire freelance React/Next.js developer» не целимся:** выдачу держат
   маркетплейсы. Новый домен конкурировать там не будет (вывод по типу выдачи; сила конкурентов
   не измерена). Целимся в нишевые запросы (Mini Apps, React Native, SaaS MVP, GEO).
3. **GEO-страница — объяснение + услуга.** RU-выдача информационная; чистая «продающая»
   страница даёт несовпадение типа. Структура: что такое GEO, что входит, как измеряем
   (без обещаний), затем услуга.
4. **PWA — гипотеза:** RU-выдача не проверялась. Сначала блок внутри веб-разработки/мобильных,
   отдельная страница — по данным Search Console.

## Структура (hub-and-spoke)

Хаб: главная `/`. Спицы (URL одинаковые для EN, для RU добавляется `/ru`):

| Кластер | Страница | Ключ RU (ориентир) | Ключ EN (ориентир) | Волна |
|---------|----------|--------------------|--------------------|-------|
| Веб и SaaS | `/services/web-development` | разработка сайтов на заказ React / Next.js | Next.js React web development | 1 |
| Веб и SaaS | `/services/saas-mvp` | разработка SaaS MVP | SaaS MVP development | 2 |
| Telegram | `/services/telegram-mini-apps` | разработка Telegram Mini App на заказ | Telegram Mini App development | 1 |
| Telegram | `/services/telegram-bots` | разработка Telegram бота под ключ | Telegram bot development | 2 |
| Мобильные и PWA | `/services/mobile-apps` | разработка мобильных приложений React Native | React Native app development | 1 |
| Мобильные и PWA | `/services/pwa` | PWA (не проверено) | PWA development services | 3 |
| Поиск и ИИ | `/services/seo-geo` | GEO оптимизация для нейросетей | generative engine optimization | 2 |

Ключи — ориентиры по формулировкам из выдачи, **частотность неизвестна**. Объём страницы
900–1300 слов — рабочая оценка, а не требование из данных. Блогов и статей на этом этапе нет.

Внутренние ссылки: хаб ↔ каждая страница (обязательно); Mini Apps ↔ боты; веб ↔ SaaS;
мобильные ↔ PWA; веб ↔ PWA; Mini Apps ↔ веб и мобильные; веб ↔ SEO/GEO. Страницы услуг
ссылаются на релевантные кейсы (Client Base → SaaS/веб; eKhonish, «Железнодорожная
логистика», MedTech → веб-разработка). Всего 28 ссылок в `cluster-plan.json`.

## Главный риск: нет подтверждений опыта

Среди четырёх кейсов нет Telegram Mini App, React Native-приложения и бота. Страницы услуг
без примеров проигрывают конкурентам с кейсами и несут риск E-E-A-T (опыт, доверие). Перед
Волной 1 нужны реальные материалы: демо или pet-проект, репозиторий, скриншоты, описание
личного вклада. Выдумывать клиентов и результаты нельзя. Если материалов нет, страница
создаётся только после появления хотя бы одного проверяемого примера.
