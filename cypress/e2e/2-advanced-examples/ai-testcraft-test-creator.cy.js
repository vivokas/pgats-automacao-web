// totalPage.js
class TotalPage {
    constructor(page) {
        this.page = page;
    }

    get totalDisplay() {
        return this.page.locator('#totalDisplay');
    }

    async getTotalAmount() {
        return await this.totalDisplay.innerText();
    }

    async waitForTotalAmount() {
        await this.totalDisplay.waitFor({ state: 'visible' });
    }
}

module.exports = TotalPage;

// total.test.js
const { test, expect } = require('@playwright/test');
const TotalPage = require('./totalPage');

test.describe('Total Amount Tests', () => {
    let totalPage;

    test.beforeEach(async ({ page }) => {
        totalPage = new TotalPage(page);
        await page.goto('https://devfinance-agilizei.netlify.app/');
    });

    test('Verify that the displayed total amount starts at "R$ 0,00" when the page is loaded', async () => {
        await totalPage.waitForTotalAmount();
        const totalAmount = await totalPage.getTotalAmount();
        expect(totalAmount).toBe('R$ 0,00');
    });

    test('Verify that an error message appears if the total amount fails to load due to a network issue', async () => {
        await page.route('**/*', route => route.abort()); // Simulate network issue
        await page.reload();
        
        // Assuming there is an error message element, replace '.error-message' with actual selector
        const errorMessage = await page.locator('.error-message');
        await errorMessage.waitFor({ state: 'visible' });
        expect(await errorMessage.isVisible()).toBeTruthy();
    });

    test('Test the total display on different screen sizes and orientations to ensure it remains responsive and accessible', async () => {
        const screenSizes = [
            { width: 320, height: 480 }, // Mobile portrait
            { width: 768, height: 1024 }, // Tablet
            { width: 1024, height: 768 }, // Tablet landscape
            { width: 1440, height: 900 }, // Desktop
        ];

        for (const size of screenSizes) {
            await page.setViewportSize(size);
            await totalPage.waitForTotalAmount();
            const totalAmount = await totalPage.getTotalAmount();
            expect(totalAmount).toBe('R$ 0,00');
        }
    });
});