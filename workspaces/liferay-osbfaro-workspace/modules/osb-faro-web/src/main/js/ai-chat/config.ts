/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export interface AiConfig {
	apiKey: string;
	mcpAuth: string;
	model: string;
}

export interface AiModel {
	id: string;
	label: string;
}

// Keep DEFAULT_MODEL in sync with ai-chat-server/resolveConfig.js (the dev
// server cannot import this TS module across the build boundary).
export const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

export const AI_MODELS: AiModel[] = [
	{id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5'},
	{id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6'},
	{id: 'claude-opus-4-8', label: 'Claude Opus 4.8'}
];

const STORAGE_KEY = 'faro.aiAssistant.config';

export function loadAiConfig(): AiConfig {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);

		if (!raw) {
			return {apiKey: '', mcpAuth: '', model: DEFAULT_MODEL};
		}

		const parsed = JSON.parse(raw);

		return {
			apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : '',
			mcpAuth: typeof parsed.mcpAuth === 'string' ? parsed.mcpAuth : '',
			model:
				typeof parsed.model === 'string' && parsed.model
					? parsed.model
					: DEFAULT_MODEL
		};
	} catch (error) {
		return {apiKey: '', mcpAuth: '', model: DEFAULT_MODEL};
	}
}

export function saveAiConfig(config: AiConfig): void {
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}
