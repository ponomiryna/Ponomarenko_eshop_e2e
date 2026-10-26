import { test as base } from '@playwright/test';
import { ProductsPage } from '@pages/ProductsPage';
import { CartPage } from '@pages/CartPage';

type Pages = {
    productsPage: ProductsPage;
    cartPage: CartPage;
};

// Reklamné a consent domény, ktoré spomaľujú načítanie a prekrývajú prvky stránky
const AD_HOSTS = /googlesyndication|doubleclick|googleadservices|adservice\.google|fundingchoicesmessages/;

export const test = base.extend<Pages>({
    page: async ({ page }, use) => {
        await page.route(AD_HOSTS, (route) => route.abort());
        await use(page);
    },
    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
});

export { expect } from '@playwright/test';
