/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	getUrlParameter,
	removeUrlParameter,
} from '../../../src/main/resources/META-INF/resources/js/util/navigation.es';

describe('getUrlParameter', () => {
	it('returns an URL parameter', () => {
		const urlSearchParams = new URLSearchParams(
			'segmentsExperimentKey=636029195608829519&segmentExperimentAction=reviewAndRun'
		);

		Object.defineProperty(window, 'location', {
			value: {
				search: urlSearchParams.toString(),
			},
			writable: true,
		});

		expect(getUrlParameter('segmentExperimentAction')).toEqual(
			'reviewAndRun'
		);
	});
});

describe('removeUrlParameter', () => {
	it('removes an URL parameter', () => {
		const url = new URL(
			'https://liferay.com/web/guest/experiment?segmentsExperimentKey=636029195608829519&segmentExperimentAction=reviewAndRun'
		);

		window.history.replaceState = jest.fn();

		Object.defineProperty(window, 'location', {
			value: {
				href: url.toString(),
			},
			writable: true,
		});

		removeUrlParameter('segmentExperimentAction');

		expect(window.history.replaceState).toBeCalledWith(
			null,
			null,
			'https://liferay.com/web/guest/experiment?segmentsExperimentKey=636029195608829519'
		);
	});
});
