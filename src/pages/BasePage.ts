import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
    protected abstract readonly path: string;

    constructor(protected readonly page: Page) {}

    async open(): Promise<void> {
        // Nečakáme na všetky obrázky a skripty – Playwright čaká na prvky automaticky
        await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
        await this.dismissConsentIfVisible();
    }

    // Na automationexercise.com sa v EÚ zobrazuje cookie consent (Google FC)
    private async dismissConsentIfVisible(): Promise<void> {
        const consent: Locator = this.page.getByRole('button', { name: 'Consent' });
        if (await consent.isVisible({ timeout: 2000 }).catch(() => false)) {
            await consent.click();
        }
    }
}
