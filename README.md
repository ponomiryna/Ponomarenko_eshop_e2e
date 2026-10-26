# E2E testy e-shopu (Playwright + TypeScript)

Automatizovaná testovacia sada pre demo e-shop [automationexercise.com](https://automationexercise.com).

[![Playwright E2E](https://github.com/ponomiryna/Ponomarenko_eshop_e2e/actions/workflows/playwright.yml/badge.svg)](https://github.com/ponomiryna/Ponomarenko_eshop_e2e/actions/workflows/playwright.yml)

**Posledný HTML report:** https://ponomiryna.github.io/Ponomarenko_eshop_e2e/

## Spustenie

Požiadavky: Node.js 20+

```bash
npm ci
npx playwright install chromium
npm test             # všetky testy (headless)
npm run test:headed  # s viditeľným prehliadačom
npm run test:ui      # interaktívny UI mód
npm run report       # otvorí HTML report z posledného behu
```

Spustenie konkrétneho súboru alebo testu:

```bash
npx playwright test tests/cart/add-to-cart.spec.ts
npx playwright test -g "Blue Top"
```

## Štruktúra

```
src/
├── pages/       # Page Objects (BasePage, ProductsPage, CartPage)
├── fixtures/    # custom fixtures – page objekty sa injektujú do testov, blokovanie reklamy
└── data/        # testovacie dáta (JSON) + TypeScript typy
tests/
└── cart/        # testy rozdelené podľa funkcionality
.github/workflows/playwright.yml   # CI pipeline (GitHub Actions)
```

## Scenáre

| Typ | Scenár | Dáta |
|---|---|---|
| Positive | Vyhľadanie tovaru → pridanie do košíka → overenie, že košík obsahuje práve 1 položku so správnym názvom a množstvom 1 | `src/data/products.json` |
| Negative | Vyhľadanie neexistujúceho tovaru / špeciálnych znakov → žiadne výsledky, košík zostáva prázdny | `src/data/invalid-search.json` |

Nový tovar na otestovanie = nový riadok v JSON, bez zmeny kódu.

## Prístup

- **Page Object Model + `BasePage`:** lokátory a akcie sú na jednom mieste. Pri zmene UI sa upravuje jeden súbor, nie desiatky testov. Spoločná logika (navigácia, cookie banner) je v abstraktnej `BasePage`, každá stránka definuje len svoj `path`.
- **Custom fixtures:** page objekty sa do testov injektujú automaticky (`async ({ productsPage, cartPage }) => …`), testy neobsahujú `new …`. Nová stránka = jedna trieda + jeden riadok vo fixture.
- **Data-driven testy:** každý záznam v JSON je samostatný test s unikátnym názvom. Dáta sú typované (`ProductData`, `InvalidSearchData`), takže preklepy v štruktúre zachytí TypeScript.
- **Lokátory podľa obsahu, nie indexu:** `productCard(name)` a `cartItem(name)` hľadajú prvok podľa názvu tovaru, testy nezávisia od poradia produktov.
- **`test.step`:** čitateľná štruktúra v HTML reporte – hneď vidno, v ktorom kroku test zlyhal.
- **Izolácia testov:** každý test má vlastný browser context (prázdny košík), preto môžu bežať paralelne a nezávisle.
- **Path aliasy** (`@pages`, `@fixtures`, `@data`) v `tsconfig.json` – importy nezávisia od hĺbky priečinka.

## Výzvy a rozhodnutia

- **Výber e-shopu:** najprv som skúšala reálny e-shop (notino.sk), ale je chránený Cloudflare bot ochranou (captcha). To znemožňuje stabilné spúšťanie v CI a obchádzanie ochrany nie je správny prístup. Preto som zvolila demo e-shop určený na testovanie.
- **Reklama na stránke:** reklamy spomaľovali načítanie stránky (timeouty) a prekrývali prvky. Riešenie: blokovanie reklamných domén cez `page.route()` v prepísanom fixture `page` (platí automaticky pre všetky testy) a `goto` s `waitUntil: 'domcontentloaded'`.
- **Duplicitné tlačidlá „Add to cart“:** na karte produktu sú dve (druhé v hover overlay), preto je lokátor obmedzený na `.productinfo`, inak Playwright hlási strict mode violation.
- **Cookie consent:** v EÚ sa zobrazuje Google consent dialóg; `BasePage` ho zavrie, ak je viditeľný.
- **CI:** GitHub Actions spúšťa testy pri push/PR do `main` a ručne (`workflow_dispatch`). Inštaluje sa len Chromium (rýchlejší beh). HTML report sa nahráva ako artifact a publikuje na GitHub Pages aj pri zlyhaní testov. Na CI sú zapnuté retries, trace, screenshot a video pri zlyhaní.
