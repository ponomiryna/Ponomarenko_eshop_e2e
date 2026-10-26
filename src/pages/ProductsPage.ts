import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
    protected readonly path = '/products';

    private readonly searchInput: Locator;
    private readonly searchButton: Locator;
    private readonly continueShoppingButton: Locator;
    readonly searchedTitle: Locator;
    readonly productCards: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
        this.searchedTitle = page.getByRole('heading', { name: 'Searched Products' });
        this.productCards = page.locator('.features_items .product-image-wrapper');
    }

    async search(term: string): Promise<void> {
        await this.searchInput.fill(term);
        await this.searchButton.click();
        await expect(this.searchedTitle).toBeVisible();
    }

    productCard(name: string): Locator {
        return this.productCards.filter({
            has: this.page.locator('.productinfo p', { hasText: name }),
        });
    }

    async addToCart(name: string): Promise<void> {
        const card = this.productCard(name);
        // Pri hoveri sa nad kartou zobrazí overlay s vlastným tlačidlom „Add to cart“,
        // ktoré prekryje tlačidlo v .productinfo. Správame sa ako používateľ:
        // najprv hover, potom klik na tlačidlo v overlayi.
        await card.hover();
        await card.locator('.product-overlay .add-to-cart').click();
        await expect(this.continueShoppingButton).toBeVisible();
        await this.continueShoppingButton.click();
    }
}
