import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    protected readonly path = '/view_cart';

    readonly cartRows: Locator;
    readonly itemNameLinks: Locator;
    readonly emptyCartMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.cartRows = page.locator('#cart_info_table tbody tr');
        this.itemNameLinks = this.cartRows.locator('.cart_description h4 a');
        this.emptyCartMessage = page.locator('#empty_cart');
    }

    cartItem(name: string): Locator {
        return this.cartRows.filter({
            has: this.page.locator('.cart_description h4 a', { hasText: name }),
        });
    }

    async itemNames(): Promise<string[]> {
        const names = await this.itemNameLinks.allTextContents();
        return names.map((n) => n.trim());
    }
}