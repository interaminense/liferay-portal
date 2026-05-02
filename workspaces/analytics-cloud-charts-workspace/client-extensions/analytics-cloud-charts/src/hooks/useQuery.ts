/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useEffect, useState} from 'react';

import {graphqlFetch} from '../lib/analytics';

export type FetchPolicy = 'cache-first' | 'network-only';

export interface UseQueryOptions {
	fetchPolicy?: FetchPolicy;
}

export interface UseQueryResult<T> {
	data?: T;
	error: Error | null;
	loading: boolean;
}

const CACHE = new Map<string, unknown>();

export function useQuery<T>(
	query: string,
	variables?: Record<string, unknown>,
	options?: UseQueryOptions
): UseQueryResult<T> {
	const fetchPolicy: FetchPolicy = options?.fetchPolicy ?? 'network-only';
	const variablesKey = variables ? JSON.stringify(variables) : '';
	const cacheKey = `${query}|${variablesKey}`;

	const cachedHit =
		fetchPolicy === 'cache-first' && CACHE.has(cacheKey)
			? (CACHE.get(cacheKey) as T)
			: undefined;

	const [data, setData] = useState<T | undefined>(cachedHit);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(cachedHit === undefined);

	useEffect(() => {
		if (fetchPolicy === 'cache-first' && CACHE.has(cacheKey)) {
			setData(CACHE.get(cacheKey) as T);
			setError(null);
			setLoading(false);

			return;
		}

		const controller = new AbortController();

		(async () => {
			setLoading(true);
			setError(null);

			try {
				const result = await graphqlFetch<T>(
					query,
					variables,
					controller.signal
				);

				CACHE.set(cacheKey, result);

				setData(result);
			}
			catch (caught) {
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
				setLoading(false);
			}
		})();

		return () => controller.abort();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cacheKey, fetchPolicy]);

	return {data, error, loading};
}
