/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* ─────────────────────────────────────────────────────────────────────────
 * TEMPORARY — DEVELOPMENT ONLY
 *
 * Direct Anthropic API integration used as a fallback while the
 * Liferay AI Hub project (`ai-hub-liferay` GCP) is not yet provisioned.
 *
 * To revert when AI Hub becomes available:
 *   1. Delete this file
 *   2. Restore the SSE/AI Hub call inside src/hooks/useAIInsight.ts
 *      (see git history for the previous implementation)
 *   3. Remove the "Anthropic API key" field from src/components/SettingsModal.tsx
 *      and any references to anthropic-dev imports
 *
 * The API key is stored in the browser's localStorage only — it never
 * leaves the developer's machine and is never persisted to Liferay.
 * ────────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'analytics-cloud-charts:anthropic-api-key';
const ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 200;

const SYSTEM_PROMPT =
	'You are an analytics assistant. Given a JSON snapshot of an Analytics ' +
	'Cloud metric and its label, write 1-2 short, factual English sentences ' +
	'highlighting the most notable observation (trend, anomaly, comparison). ' +
	'Do not invent numbers. Do not use markdown. Do not exceed 240 characters.';

export function getAnthropicApiKey(): string {
	if (typeof window === 'undefined') {
		return '';
	}

	try {
		return window.localStorage.getItem(STORAGE_KEY) ?? '';
	}
	catch {
		return '';
	}
}

export function setAnthropicApiKey(value: string): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		const trimmed = value.trim();

		if (trimmed) {
			window.localStorage.setItem(STORAGE_KEY, trimmed);
		}
		else {
			window.localStorage.removeItem(STORAGE_KEY);
		}
	}
	catch {
		// ignore storage failures (private mode, quota, etc.)
	}
}

export async function callAnthropicForInsight(
	prompt: string,
	signal: AbortSignal
): Promise<string> {
	const apiKey = getAnthropicApiKey();

	if (!apiKey) {
		throw new Error(
			'Anthropic API key not configured. Open Settings to add one.'
		);
	}

	const response = await fetch(ENDPOINT, {
		body: JSON.stringify({
			max_tokens: MAX_TOKENS,
			messages: [{content: prompt, role: 'user'}],
			model: MODEL,
			system: SYSTEM_PROMPT,
		}),
		headers: {
			'anthropic-dangerous-direct-browser-access': 'true',
			'anthropic-version': '2023-06-01',
			'content-type': 'application/json',
			'x-api-key': apiKey,
		},
		method: 'POST',
		signal,
	});

	if (!response.ok) {
		const errorText = await response.text().catch(() => '');

		throw new Error(
			`Anthropic API ${response.status}: ${
				errorText.slice(0, 200) || response.statusText
			}`
		);
	}

	const json = (await response.json()) as {
		content?: Array<{text?: string; type?: string}>;
	};

	const text = json?.content?.find((part) => part.type === 'text')?.text;

	if (!text) {
		throw new Error('Anthropic returned no text content');
	}

	return text.trim();
}
