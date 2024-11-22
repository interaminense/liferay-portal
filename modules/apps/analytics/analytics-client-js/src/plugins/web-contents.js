/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	getNumberOfWords,
	isTrackable,
	transformAssetTypeToSelector,
} from '../utils/assets';
import {WEB_CONTENT} from '../utils/constants';
import {debounce} from '../utils/debounce';
import {clickEvent, onEvents, onReady} from '../utils/events';
import {isPartiallyInViewport} from '../utils/scroll';

const applicationId = WEB_CONTENT;

export const webContentTypes = [
	'web-content',
	'com.liferay.journal.model.JournalArticle',
];

/**
 * Returns analytics payload with WebContent information.
 * @param {Object} webContent The webContent DOM element
 * @returns {Object} The payload with webContent information
 */
function getWebContentPayload({dataset}) {
	const payload = {
		articleId: dataset.analyticsAssetId.trim(),
	};

	if (dataset.analyticsAssetSubtype) {
		Object.assign(payload, {subtype: dataset.analyticsAssetSubtype.trim()});
	}

	if (dataset.analyticsAssetTitle) {
		Object.assign(payload, {title: dataset.analyticsAssetTitle.trim()});
	}

	if (dataset.analyticsAssetType) {
		Object.assign(payload, {type: dataset.analyticsAssetType.trim()});
	}

	if (dataset.analyticsWebContentResourcePk) {
		Object.assign(payload, {
			webContentResourcePk: dataset.analyticsWebContentResourcePk.trim(),
		});
	}

	return payload;
}

/**
 * Web content validation to check if the element is trackable
 * @param {Object} element HTML DOM Element
 * @param {string} action: 'view' | 'impression'
 * @returns Boolean
 */
const _isTrackable = (element, action) => {
	const isBackwardsCompatibleAction =
		isTrackable(element) &&
		!element.dataset?.analyticsAssetAction &&
		action === 'view';

	const matchesDefinedAction =
		isTrackable(element) &&
		element.dataset?.analyticsAssetAction === action;

	return isBackwardsCompatibleAction || matchesDefinedAction;
};

/**
 * Sends information when user clicks on a Web Content.
 * @param {Object} The Analytics client instance
 */
function trackWebContentClicked(analytics) {
	return clickEvent({
		analytics,
		applicationId,
		eventType: 'webContentClicked',
		getPayload: getWebContentPayload,
		isTrackable,
		type: webContentTypes,
	});
}

/**
 * Sends information the first time a WebContent enters into the viewport.
 * @param {Object} analytics: The Analytics client instance
 * @param {Object} props: {action: 'view' | 'impression', eventId: string}
 */
function trackWebContent(analytics, {action, eventId}) {
	const selector = transformAssetTypeToSelector(
		webContentTypes,
		':not([data-analytics-asset-viewed="true"])'
	);

	const markViewedElements = debounce(() => {
		const elements = Array.prototype.slice
			.call(document.querySelectorAll(selector))
			.filter((element) => _isTrackable(element, action));

		elements.forEach((element) => {
			if (isPartiallyInViewport(element)) {
				const payload = getWebContentPayload(element);

				Object.assign(payload, {
					numberOfWords: getNumberOfWords(element),
				});

				element.dataset.analyticsAssetViewed = true;

				analytics.send(eventId, applicationId, payload);
			}
		});
	}, 250);

	const stopTrackingOnReady = onReady(markViewedElements);
	const stopTrackingEvents = onEvents(
		['scroll', 'resize', 'orientationchange'],
		markViewedElements
	);

	return () => {
		stopTrackingEvents();
		stopTrackingOnReady();
	};
}

/**
 * Plugin function that registers listeners for Web Content events
 * @param {Object} analytics The Analytics client
 */
function webContent(analytics) {
	const stopTrackingWebContentClicked = trackWebContentClicked(analytics);
	const stopTrackingWebContentImpressionMade = trackWebContent(analytics, {
		action: 'impression',
		eventId: 'webContentImpressionMade',
	});
	const stopTrackingWebContentViewed = trackWebContent(analytics, {
		action: 'view',
		eventId: 'webContentViewed',
	});

	return () => {
		stopTrackingWebContentClicked();
		stopTrackingWebContentImpressionMade();
		stopTrackingWebContentViewed();
	};
}

export {webContent};
export default webContent;
