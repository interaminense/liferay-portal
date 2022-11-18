/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import {useCallback, useEffect, useState} from 'react';

export type TUseFecthDataResult = {
	data?: any;
	error: boolean;
	loading: boolean;
	refetch: () => void;
	refetching: boolean;
};

function useFetchData(
	fetchFn: (params?: any) => Promise<any>,
	params?: any
): TUseFecthDataResult {
	const [data, setData] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [refetching, setRefetching] = useState(false);

	const _fetchFn = useCallback(() => {
		const request = async () => {
			const response = await fetchFn(params);

			try {
				if (response.error) {
					throw response.error;
				} else {
					setData(response);
				}
			} catch (error) {
				console.error(error);

				setError(true);
			}

			setLoading(false);
			setRefetching(false);
		};

		request();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchFn, JSON.stringify(params)]);

	useEffect(() => {
		_fetchFn();
	}, [_fetchFn]);

	return {
		data,
		error,
		loading,
		refetch: () => {
			setError(false);
			setLoading(true);
			setRefetching(true);

			_fetchFn();
		},
		refetching,
	};
}

export default useFetchData;
