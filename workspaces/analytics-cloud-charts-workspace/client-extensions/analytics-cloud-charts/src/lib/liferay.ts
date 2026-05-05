/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const FALLBACK_PORTLET_ID = 'analytics-cloud-charts-default';

export const EMPTY_STATE_IMG_SRC =
	'/o/classic-theme/images/states/empty_state.svg';

/**
 * Walks up the DOM from `element` looking for the Liferay portlet boundary
 * container (`<section id="p_p_id_<portletId>_">`) and returns the portletId.
 * Returns a fallback constant when the widget is not embedded in a portlet
 * (e.g. local dev preview).
 */
export function extractPortletId(element: HTMLElement): string {
	const container = element.closest<HTMLElement>('[id^="p_p_id_"]');

	if (!container?.id) {
		console.warn(
			'[analytics-cloud-charts] Could not find portlet boundary; falling back to default ID.'
		);

		return FALLBACK_PORTLET_ID;
	}

	const match = container.id.match(/^p_p_id_(.+)_$/);

	return match ? match[1] : FALLBACK_PORTLET_ID;
}
