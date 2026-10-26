import { test, expect } from '@fixtures/pages.fixture';
import invalidJson from '@data/invalid-search.json';
import { InvalidSearchData } from '@data/types';

const invalidSearches: InvalidSearchData[] = invalidJson;

test.describe('Search: negative flow', () => {
    for (const data of invalidSearches) {
        test(`search "${data.searchTerm}" returns no products`, async ({ productsPage, cartPage }) => {
            await test.step('Search for non-existing product', async () => {
                await productsPage.open();
                await productsPage.search(data.searchTerm);
            });

            await test.step('Verify no products are found', async () => {
                await expect(productsPage.productCards).toHaveCount(0);
            });

            await test.step('Verify cart stays empty', async () => {
                await cartPage.open();
                await expect(cartPage.cartRows).toHaveCount(0);
                await expect(cartPage.emptyCartMessage).toBeVisible();
            });
        });
    }
});