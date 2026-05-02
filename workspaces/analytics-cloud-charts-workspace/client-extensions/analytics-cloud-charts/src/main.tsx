/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Root, createRoot} from 'react-dom/client';

import App from './App';
import {extractPortletId} from './lib/liferay';
import cardStyles from './styles/card.css?inline';

const STYLE_ELEMENT_ID = 'analytics-cloud-charts-styles';

if (
	typeof document !== 'undefined' &&
	!document.getElementById(STYLE_ELEMENT_ID)
) {
	const styleElement = document.createElement('style');

	styleElement.id = STYLE_ELEMENT_ID;
	styleElement.textContent = cardStyles;

	document.head.appendChild(styleElement);
}

const ELEMENT_NAME = 'analytics-cloud-charts';

class AnalyticsCloudChartsElement extends HTMLElement {
	private root: Root | undefined;

	connectedCallback() {
		this.style.display = 'block';
		this.style.height = '100%';
		this.style.width = '100%';

		const instanceId = extractPortletId(this);

		if (!this.root) {
			this.root = createRoot(this);

			this.root.render(<App instanceId={instanceId} />);
		}
	}

	disconnectedCallback() {
		this.root?.unmount();
		this.root = undefined;
	}
}

if (!customElements.get(ELEMENT_NAME)) {
	customElements.define(ELEMENT_NAME, AnalyticsCloudChartsElement);
}
