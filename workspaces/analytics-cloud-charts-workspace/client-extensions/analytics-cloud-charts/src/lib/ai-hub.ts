/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export const AI_HUB_BASE_URL = '/o/ai-hub/v1.0';

/**
 * External Reference Code of the chatbot configured in AI Hub for this widget.
 * The chatbot must be created manually by an administrator before enabling
 * Auto-narrative insights. See README for setup instructions.
 */
export const INSIGHTS_CHATBOT_ERC = 'ACC_INSIGHTS';

const MAX_PAYLOAD_CHARS = 2000;

/**
 * Build the prompt sent to the AI Hub chatbot. Truncates the JSON payload to
 * avoid exhausting the model's context window or hitting transport limits.
 */
export function buildInsightPrompt(
	metricLabel: string,
	data: unknown
): string {
	let payload: string;

	try {
		payload = JSON.stringify(data, null, 2);
	}
	catch {
		payload = '{}';
	}

	if (payload.length > MAX_PAYLOAD_CHARS) {
		payload = `${payload.slice(0, MAX_PAYLOAD_CHARS)}\n…(truncated)`;
	}

	return `Metric: ${metricLabel}\n\nData (JSON):\n${payload}`;
}
