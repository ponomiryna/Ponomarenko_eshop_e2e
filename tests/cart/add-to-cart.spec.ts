import { test, expect } from '@fixtures/pages.fixture';
import productsJson from '@data/products.json';
import { ProductData } from '@data/types';

const products: ProductData[] = productsJson;

test.describe('Cart: positive flow', () => {
    for (const product of products) {
        test(`search "${product.searchTerm}" and add to cart`, async ({ productsPage, cartPage }) => {
            await test.step('Search for product', async () => {
                await productsPage.open();
                await productsPage.search(product.searchTerm);
                await expect(productsPage.productCard(product.expectedName)).toBeVisible();
            });

            await test.step('Add product to cart', async () => {
                await productsPage.addToCart(product.expectedName);
            });

            await test.step('Verify cart contains the product', async () => {
                await cartPage.open();
                await expect(cartPage.cartRows).toHaveCount(1);
                await expect(cartPage.cartItem(product.expectedName)).toBeVisible();
                await expect(cartPage.cartItem(product.expectedName).locator('.cart_quantity'))
                    .toHaveText('1');
            });
        });
    }
});