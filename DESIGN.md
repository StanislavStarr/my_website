# Design system: Stanislav Sinitsyn (retro console, evolved)

## Principles
- A real person's handheld console: warm dark ground, amber accent, LCD-green panels, plastic shell.
- No per-section kicker/number labels, no hero-metric rows, no bracketed list numbers. Headings carry themselves; numbering stays only where order matters (process steps).
- Proof is real: figures set as running text; nothing invented.

## Tokens (src/styles/globals.css)
- Ground `--bg #181612`, text `--ink #f0e8da`, muted `--muted #b5aa98`, shell `--surface #2b241c`, rule `--line #51483b`.
- Accent amber `--accent #e5a353`; LED status `--led #9bd07f` (status dot only).
- LCD panel `--lcd #c5bb96` with ink `--lcd-ink #303526`, faint pixel grid overlay.
- Motion ease `--ease cubic-bezier(.22,1,.36,1)`.

## Type
- Display and body: Geologica (variable, latin + cyrillic), weight 300 body/headings, em accent weight 600 in amber, tracking -0.05em on H1.
- Data and controls: JetBrains Mono (`.mono`, proof numerals, stack tags).

## Components
Pill buttons with cursor-origin white fill; console shell with portrait/snake screen; LCD work table with round arrow rows; curtain page transition above the case modal; proof line; brief form with chips.

## Motion
Boot overlay, word-by-word headline reveal, scroll reveals, count-up proof numbers, scramble on step numbers, magnetic buttons, marquee of the real stack. All gated by reduced-motion and the on-page toggle.

## SEO / GEO
Person + ProfessionalService (areaServed named countries (RU/CIS, US) + Europe + remote worldwide, knowsLanguage ru/en) + WebSite + Service list + FAQPage on the landing; WebPage + BreadcrumbList on cases; hreflang en/ru/x-default; indexing gated by SITE_URL + ENABLE_INDEXING.
