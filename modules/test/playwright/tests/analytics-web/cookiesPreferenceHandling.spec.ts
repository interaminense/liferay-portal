/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {featureFlagsTest} from '../../fixtures/featureFlagsTest';
import {loginAnalyticsCloudTest} from '../../fixtures/loginAnalyticsCloudTest';
import {loginTest} from '../../fixtures/loginTest';
import {liferayConfig} from '../../liferay.config';
import {HomePage} from '../../pages/portal-web/HomePage';
import {
	connectToAnalyticsCloud,
	disconnectFromAnalyticsCloud,
	goToAnalyticsCloudInstanceSettings,
	syncAllContacts,
	syncSite,
} from '../analytics-settings-web/utils/analyticsSettings';
import {createDataSource} from '../osb-faro-web/utils/dataSource';

export const test = mergeTests(
	loginAnalyticsCloudTest(),
	loginTest(),
	featureFlagsTest({
		'LPD-10588': true,
	})
);

async function changeCookiePreferenceHandling(
	page,
	{enableCookie, enableExplicitCookieConsentMode}
) {
	const homepage = new HomePage(page);

	await homepage.openApplicationMenu();

	await page.getByRole('tab', {name: 'Control Panel'}).click();

	await page.getByRole('menuitem', {name: 'Instance Settings'}).click();

	await page.getByRole('link', {name: 'Cookies'}).click();

	if (enableCookie) {
		await page.getByLabel('Enabled').check();
	} else {
		await page.getByLabel('Enabled').uncheck();
	}

	if (enableExplicitCookieConsentMode) {
		await page.getByLabel('Explicit Cookie Consent Mode').check();
	} else {
		await page.getByLabel('Explicit Cookie Consent Mode').uncheck();
	}

	await page.getByRole('button', {name: 'Update'}).click();

	await page
		.getByText('Success:Your request completed successfully.')
		.click();
}

async function connectACWithDXP(page) {
	await createDataSource(page);

	await goToAnalyticsCloudInstanceSettings(page);

	const cookieBannerElement = await page.$('div.portlet-cookies-banner');

	if (cookieBannerElement) {
		await cookieBannerElement.evaluate((div) => {
			div.style.display = 'none';
		});
	}

	await disconnectFromAnalyticsCloud(page);

	await connectToAnalyticsCloud(page);

	await syncSite(page);

	await syncAllContacts(page);

	await page.getByRole('button', {name: 'Finish'}).click();
}

async function checkAnalyticsInstance(page) {
	return await page.evaluate(() => {
		// @ts-ignore

		return !!window.Analytics;
	});
}

test.describe('LPD-6540 Support Liferay Cookie Manager', () => {
	test('When Cookie Preference Handling and Explicit Cookie Consent Mode are both Enabled, AC tracking should be enabled as soon the user accepts the performance cookies', async ({
		page,
	}) => {
		await connectACWithDXP(page);

		await changeCookiePreferenceHandling(page, {
			enableCookie: true,
			enableExplicitCookieConsentMode: true,
		});

		await page.goto(liferayConfig.environment.baseUrl);

		await page.getByRole('button', {name: 'Accept All'}).click();

		await page.waitForTimeout(3000);

		expect(await checkAnalyticsInstance(page)).toBeTruthy();
	});

	test('When Cookie Preference Handling and Explicit Cookie Consent Mode are both Enabled, AC tracking should be disabled if end user did not accept the perfomance cookies', async ({
		page,
	}) => {
		await connectACWithDXP(page);

		await changeCookiePreferenceHandling(page, {
			enableCookie: true,
			enableExplicitCookieConsentMode: true,
		});

		await page.goto(liferayConfig.environment.baseUrl);

		await page.getByRole('button', {name: 'Decline All'}).click();

		await page.waitForTimeout(3000);

		expect(await checkAnalyticsInstance(page)).toBeFalsy();
	});

	test('When Cookie Preference Handling is Enabled and Explicit Cookie Consent Mode is not Enabled, AC tracking should be enabled by default ', async ({
		page,
	}) => {
		await connectACWithDXP(page);

		await changeCookiePreferenceHandling(page, {
			enableCookie: true,
			enableExplicitCookieConsentMode: false,
		});

		await page.goto(liferayConfig.environment.baseUrl);

		await page.waitForTimeout(3000);

		expect(await checkAnalyticsInstance(page)).toBeTruthy();
	});

	test('When Cookie Preference Handling is Enabled and Explicit Cookie Consent Mode is not Enabled, AC tracking should be enabled until the user rejects the performance cookies', async ({
		page,
	}) => {
		await connectACWithDXP(page);

		await changeCookiePreferenceHandling(page, {
			enableCookie: true,
			enableExplicitCookieConsentMode: false,
		});

		await page.goto(liferayConfig.environment.baseUrl);

		await page.waitForTimeout(3000);

		expect(await checkAnalyticsInstance(page)).toBeTruthy();

		await page.getByRole('button', {name: 'Decline All'}).click();

		await page.reload();

		await page.waitForTimeout(3000);

		expect(await checkAnalyticsInstance(page)).toBeFalsy();
	});

	test('When Cookie Preference Handling is not Enabled, AC tracking should be enabled by default', async ({
		page,
	}) => {
		await connectACWithDXP(page);

		await changeCookiePreferenceHandling(page, {
			enableCookie: false,
			enableExplicitCookieConsentMode: false,
		});

		await page.goto(liferayConfig.environment.baseUrl);

		await page.waitForTimeout(3000);

		expect(await checkAnalyticsInstance(page)).toBeTruthy();
	});
});
