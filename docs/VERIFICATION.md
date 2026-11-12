# Verification — 4 November 2026

- Production build: passed on Node.js 24.22.1.
- TypeScript: passed as part of the production build.
- Unit tests: 7 passed (game, localized URLs, indexing, metadata, translations).
- HTTP smoke checks: 10 content pages and 4 missing pages passed.
- Infrastructure checks: locale redirect, no forced language redirect, robots,
  sitemap, Open Graph image, and default noindex state passed.
- Browser QA: desktop, EN at 390 px, RU at 320 px, no horizontal overflow.
- Case interaction: modal, Escape, contact link, direct URL, localized titles.
- Language switch: direct MedTech page stays on the same case in EN and RU.
- Game: on-demand load, keyboard and button controls; engine tests cover
  catch/miss rules and end-of-round conditions. Browser round ended correctly
  at 3 misses, showed the score, and offered a new round.
- Original portrait retained; no stock or generated replacement.

Not connected yet: production domain, hosting, Search Console, external analytics.
Search rankings and AI citations are not promised by these technical checks.
