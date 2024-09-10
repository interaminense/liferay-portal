/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Page, expect, mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../fixtures/apiHelpersTest';
import {dataApiHelpersTest} from '../../fixtures/dataApiHelpersTest';
import {featureFlagsTest} from '../../fixtures/featureFlagsTest';
import {isolatedSiteTest} from '../../fixtures/isolatedSiteTest';
import {loginAnalyticsCloudTest} from '../../fixtures/loginAnalyticsCloudTest';
import {loginTest} from '../../fixtures/loginTest';
import getRandomString from '../../utils/getRandomString';
import {syncAnalyticsCloud} from '../analytics-settings-web/utils/analytics-settings';
import {blogsPagesTest} from '../blogs-web/fixtures/blogsPagesTest';
import {contentDashboardPagesTest} from '../content-dashboard-web/fixtures/contentDashboardPagesTest';
import {
	createIndividuals,
	generateIndividual,
} from '../osb-faro-web/utils/individuals';

export const test = mergeTests(
	apiHelpersTest,
	blogsPagesTest,
	contentDashboardPagesTest,
	dataApiHelpersTest,
	isolatedSiteTest,
	featureFlagsTest({
		'LPD-28830': true,
	}),
	loginAnalyticsCloudTest(),
	loginTest()
);

type Metric = {
	expectedValue: number;
	metricName: string;
};

function expectMatchMetricValues(metrics: Metric[], page: Page) {
	metrics.forEach(async ({expectedValue, metricName}) => {
		const metric = page.getByTestId(`overview__${metricName}-metric`);

		expect(
			await metric.locator('.overview-metric__value').innerText()
		).toBe(String(expectedValue));
	});
}

test('Overview Metrics - User is able to filter Overview Metric by individuals', async ({
	apiHelpers,
	blogsEditBlogEntryPage,
	contentDashboardPage,
	page,
	site,
}) => {
	let assetId = null;
	let individualIdentities = null;
	let individuals = null;

	const assetTitle = getRandomString();
	const channelName = 'My Property - ' + getRandomString();

	const {channel} = await syncAnalyticsCloud({
		apiHelpers,
		channelName,
		page,
		siteName: site.name,
	});

	await test.step('Sync to Analytics Cloud and create a blog', async () => {
		await blogsEditBlogEntryPage.goto(site.friendlyUrlPath);

		await blogsEditBlogEntryPage.editBlogEntry({
			content: getRandomString(),
			title: assetTitle,
		});
	});

	await test.step('Go to Content Dashboard and copy blogId from details tab', async () => {
		await contentDashboardPage.goto(site.friendlyUrlPath);

		const searchBar = page.getByPlaceholder('Search for');

		await searchBar.fill(assetTitle);

		await page.keyboard.press('Enter');

		const dropDownButton = page
			.locator('.lfr-entry-action-column .dropdown-action button')
			.first();

		await dropDownButton.click();

		const showInfoButton = page.locator('[data-action=showInfo]').first();

		await showInfoButton.click();

		await page.waitForTimeout(1000);

		assetId = await page
			.locator(
				'.panel-body .sidebar-section:nth-of-type(4) .text-secondary'
			)
			.innerText();
	});

	await test.step('Create Individuals', async () => {
		individuals = [
			generateIndividual({
				name: 'userA',
			}),
		];

		await createIndividuals({
			apiHelpers,
			individuals,
		});

		individualIdentities = individuals.map(({id}) => ({
			createDate: new Date().toISOString(),
			id,
			individualId: id,
		}));

		const anonymousIndividual = {
			createDate: new Date().toISOString(),
			id: getRandomString(),
			individualId: null,
		};

		individualIdentities.push(anonymousIndividual);

		await apiHelpers.jsonWebServicesOSBAsah.createIdentities(
			individualIdentities
		);
	});

	await test.step('Generate Blog events for known / anonymous individuals', async () => {
		const date = new Date();

		date.setDate(date.getDate() - 30);

		const blogEvents = individualIdentities.map((identity) => ({
			assetId,
			assetTitle,
			canonicalUrl: 'https://www.liferay.com',
			channelId: channel.id,
			clicks: 1,
			comments: 1,
			eventDate: date.toISOString(),
			ratings: 5,
			ratingsScore: 5,
			readTime: 1,
			sessions: 1,
			userId: identity.id,
			views: 1,
		}));

		await apiHelpers.jsonWebServicesOSBAsah.createBlogsDaily(blogEvents);
	});

	await page.getByRole('tab', {name: 'Performance'}).click();

	await page.waitForTimeout(1000);

	test.step('User is able to see metrics by all individuals (all individuals filter selected by default)', () => {
		const metrics = [
			{
				expectedValue: 2,
				metricName: 'views',
			},
			{
				expectedValue: 2,
				metricName: 'comments',
			},
		];

		expectMatchMetricValues(metrics, page);
	});

	await test.step('Change individuals filter to filter by known individuals', async () => {
		await page.getByTestId('individuals').click();

		await page.getByTestId('filter-item-KNOWN').click();

		await page.waitForTimeout(1000);

		const metrics = [
			{
				expectedValue: 1,
				metricName: 'views',
			},
			{
				expectedValue: 1,
				metricName: 'comments',
			},
		];

		expectMatchMetricValues(metrics, page);
	});

	await test.step('Change individuals filter to filter by anonymous individuals', async () => {
		await page.getByTestId('individuals').click();

		await page.getByTestId('filter-item-UNKNOWN').click();

		await page.waitForTimeout(1000);

		const metrics = [
			{
				expectedValue: 1,
				metricName: 'views',
			},
			{
				expectedValue: 1,
				metricName: 'comments',
			},
		];

		expectMatchMetricValues(metrics, page);
	});
});

test('Overview Metrics - User is able to filter Overview Metric by range selectors', async ({
	apiHelpers,
	blogsEditBlogEntryPage,
	contentDashboardPage,
	page,
	site,
}) => {
	let assetId = null;
	let individualIdentities = null;
	let individuals = null;

	const assetTitle = getRandomString();
	const channelName = 'My Property - ' + getRandomString();

	const {channel} = await syncAnalyticsCloud({
		apiHelpers,
		channelName,
		page,
		siteName: site.name,
	});

	await test.step('Sync to Analytics Cloud and create a blog', async () => {
		await blogsEditBlogEntryPage.goto(site.friendlyUrlPath);

		await blogsEditBlogEntryPage.editBlogEntry({
			content: getRandomString(),
			title: assetTitle,
		});
	});

	await test.step('Go to Content Dashboard and copy blogId from details tab', async () => {
		await contentDashboardPage.goto(site.friendlyUrlPath);

		const searchBar = page.getByPlaceholder('Search for');

		await searchBar.fill(assetTitle);

		await page.keyboard.press('Enter');

		const dropDownButton = page
			.locator('.lfr-entry-action-column .dropdown-action button')
			.first();

		await dropDownButton.click();

		const showInfoButton = page.locator('[data-action=showInfo]').first();

		await showInfoButton.click();

		await page.waitForTimeout(1000);

		assetId = await page
			.locator(
				'.panel-body .sidebar-section:nth-of-type(4) .text-secondary'
			)
			.innerText();
	});

	await test.step('Create Individuals', async () => {
		individuals = [
			generateIndividual({
				name: 'userA',
			}),
		];

		await createIndividuals({
			apiHelpers,
			individuals,
		});

		individualIdentities = individuals.map(({id}) => ({
			createDate: new Date().toISOString(),
			id,
			individualId: id,
		}));

		const anonymousIndividual = {
			createDate: new Date().toISOString(),
			id: getRandomString(),
			individualId: null,
		};

		individualIdentities.push(anonymousIndividual);

		await apiHelpers.jsonWebServicesOSBAsah.createIdentities(
			individualIdentities
		);
	});

	await test.step('Generate Blog events for known / anonymous individuals', async () => {
		const rangeSelectors = [7, 28, 30, 90];

		const datesByRangeSelectors = rangeSelectors.map((rangeSelector) => {
			const date = new Date();
			date.setDate(date.getDate() - rangeSelector);

			return date;
		});

		const blogEvents = [];

		datesByRangeSelectors.map((date) => {
			individualIdentities.map((identity) => {
				blogEvents.push({
					assetId,
					assetTitle,
					canonicalUrl: 'https://www.liferay.com',
					channelId: channel.id,
					clicks: 1,
					comments: 1,
					eventDate: date.toISOString(),
					ratings: 5,
					ratingsScore: 5,
					readTime: 1,
					sessions: 1,
					userId: identity.id,
					views: 1,
				});
			});
		});

		await apiHelpers.jsonWebServicesOSBAsah.createBlogsDaily(blogEvents);
	});

	await page.getByRole('tab', {name: 'Performance'}).click();

	await page.waitForTimeout(1000);

	await test.step('Change individuals filter to filter by known individuals to last 90 days', async () => {
		await page.getByTestId('rangeSelectors').click();

		await page.getByTestId('filter-item-90').click();

		await page.waitForTimeout(1000);

		const metrics = [
			{
				expectedValue: 8,
				metricName: 'views',
			},
			{
				expectedValue: 8,
				metricName: 'comments',
			},
		];

		expectMatchMetricValues(metrics, page);
	});

	await test.step('Change individuals filter to filter by known individuals to last 30 days', async () => {
		await page.getByTestId('rangeSelectors').click();

		await page.getByTestId('filter-item-30').click();

		await page.waitForTimeout(1000);

		const metrics = [
			{
				expectedValue: 6,
				metricName: 'views',
			},
			{
				expectedValue: 6,
				metricName: 'comments',
			},
		];

		expectMatchMetricValues(metrics, page);
	});

	await test.step('Change individuals filter to filter by known individuals to last 28 days', async () => {
		await page.getByTestId('rangeSelectors').click();

		await page.getByTestId('filter-item-28').click();

		await page.waitForTimeout(1000);

		const metrics = [
			{
				expectedValue: 4,
				metricName: 'views',
			},
			{
				expectedValue: 4,
				metricName: 'comments',
			},
		];

		expectMatchMetricValues(metrics, page);
	});

	await test.step('Change individuals filter to filter by known individuals to last 7 days', async () => {
		await page.getByTestId('rangeSelectors').click();

		await page.getByTestId('filter-item-7').click();

		await page.waitForTimeout(1000);

		const metrics = [
			{
				expectedValue: 2,
				metricName: 'views',
			},
			{
				expectedValue: 2,
				metricName: 'comments',
			},
		];

		expectMatchMetricValues(metrics, page);
	});
});
