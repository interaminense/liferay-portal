/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useCallback, useEffect, useRef, useState} from 'react';

// TEMPORARY: dev-mode Anthropic fallback. See src/lib/anthropic-dev.ts for
// the revert checklist when AI Hub becomes available.
import {callAnthropicForInsight} from '../lib/anthropic-dev';

export interface UseAIInsightResult {
	error: Error | null;
	insight: string;
	loading: boolean;
	refresh: () => void;
}

const CACHE = new Map<string, string>();

export function useAIInsight(
	enabled: boolean,
	prompt: string | null
): UseAIInsightResult {
	const cacheKey = prompt ?? '';
	const cachedHit = enabled && cacheKey ? CACHE.get(cacheKey) : undefined;

	const [insight, setInsight] = useState<string>(cachedHit ?? '');
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState<boolean>(
		enabled && !!cacheKey && cachedHit === undefined
	);
	const [refreshKey, setRefreshKey] = useState(0);

	const cancelledRef = useRef(false);

	useEffect(() => {
		cancelledRef.current = false;

		if (!enabled || !prompt) {
			setInsight('');
			setError(null);
			setLoading(false);

			return;
		}

		const cached = CACHE.get(prompt);

		if (cached !== undefined) {
			setInsight(cached);
			setError(null);
			setLoading(false);

			return;
		}

		setInsight('');
		setError(null);
		setLoading(true);

		const controller = new AbortController();

		(async () => {
			try {
				const text = await callAnthropicForInsight(
					prompt,
					controller.signal
				);

				if (cancelledRef.current) {
					return;
				}

				CACHE.set(prompt, text);

				setInsight(text);
			}
			catch (caught) {
				if (cancelledRef.current) {
					return;
				}

				if (caught instanceof Error && caught.name === 'AbortError') {
					return;
				}

				setError(
					caught instanceof Error
						? caught
						: new Error(String(caught))
				);
			}
			finally {
				if (!cancelledRef.current) {
					setLoading(false);
				}
			}
		})();

		return () => {
			cancelledRef.current = true;

			controller.abort();
		};
	}, [cacheKey, enabled, prompt, refreshKey]);

	const refresh = useCallback(() => {
		if (cacheKey) {
			CACHE.delete(cacheKey);
		}

		setRefreshKey((value) => value + 1);
	}, [cacheKey]);

	return {error, insight, loading, refresh};
}
