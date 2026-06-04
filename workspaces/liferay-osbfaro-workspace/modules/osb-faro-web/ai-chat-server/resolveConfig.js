/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

// Keep in sync with src/main/js/ai-chat/config.ts DEFAULT_MODEL.
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

// API key comes from the settings page (request) only. The ANTHROPIC_API_KEY
// env var is intentionally NOT consulted.
function resolveApiKey(body) {
	return (body && body.apiKey) || '';
}

// Model comes from the settings page (request) only, falling back to the
// built-in default. The AC_CHAT_MODEL env var is intentionally NOT consulted.
function resolveModel(body) {
	return (body && body.model) || DEFAULT_MODEL;
}

function missingKeyError(apiKey) {
	return apiKey ? null : {error: 'API key is required.', ok: false};
}

module.exports = {
	DEFAULT_MODEL,
	missingKeyError,
	resolveApiKey,
	resolveModel
};
