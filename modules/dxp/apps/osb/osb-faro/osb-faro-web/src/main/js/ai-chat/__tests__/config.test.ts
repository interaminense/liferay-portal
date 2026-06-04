/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {AI_MODELS, DEFAULT_MODEL, loadAiConfig, saveAiConfig} from '../config';

describe('ai-chat/config', () => {
	beforeEach(() => localStorage.clear());

	it('returns empty fields and default model when nothing is stored', () => {
		expect(loadAiConfig()).toEqual({
			apiKey: '',
			mcpAuth: '',
			model: DEFAULT_MODEL
		});
	});

	it('round-trips a saved config', () => {
		saveAiConfig({
			apiKey: 'sk-test',
			mcpAuth: 'Bearer tok-123',
			model: AI_MODELS[1].id
		});

		expect(loadAiConfig()).toEqual({
			apiKey: 'sk-test',
			mcpAuth: 'Bearer tok-123',
			model: AI_MODELS[1].id
		});
	});

	it('falls back to defaults on corrupt JSON', () => {
		localStorage.setItem('faro.aiAssistant.config', '{not json');

		expect(loadAiConfig()).toEqual({
			apiKey: '',
			mcpAuth: '',
			model: DEFAULT_MODEL
		});
	});

	it('defaults the missing fields when only a key was stored', () => {
		localStorage.setItem(
			'faro.aiAssistant.config',
			JSON.stringify({apiKey: 'sk-x'})
		);

		expect(loadAiConfig()).toEqual({
			apiKey: 'sk-x',
			mcpAuth: '',
			model: DEFAULT_MODEL
		});
	});
});
