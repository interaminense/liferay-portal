/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Page} from '@playwright/test';

type EventProps = {
	[key in string]: string | number | Date;
};

export class Analytics {
	Analytics: {
		_disposed: boolean;
		send: (
			applicationId: string,
			eventId: string,
			props: EventProps
		) => void;
		track: (eventId: string, props: EventProps) => void;
	} = null;
	page: Page = null;

	constructor(page: Page) {

		// @ts-ignore

		if (!window.Analytics) {
			throw new Error('window.Analytics is not defined.');
		}

		// @ts-ignore

		this.Analytics = window.Analytics;
		this.page = page;
	}

	async send(applicationId: string, eventId: string, props: EventProps) {
		return await this.page.evaluate(() => {
			this.Analytics.send(applicationId, eventId, props);
		});
	}

	async track(eventId: string, props: EventProps) {
		return await this.page.evaluate(() => {
			this.Analytics.track(eventId, props);
		});
	}

	async isDisposed() {
		return await this.page.evaluate(() => {
			return this.Analytics._disposed;
		});
	}
}
