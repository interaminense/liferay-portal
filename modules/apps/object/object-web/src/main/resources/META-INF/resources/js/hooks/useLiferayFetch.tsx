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

import {useEffect, useState} from 'react';

const HEADERS = new Headers({
	Accept: 'application/json',
	'Content-Type': 'application/json',
});

type TUseLiferayFetch = ({
	apiURL,
	options,
}: {
	apiURL: string;
	options: {};
}) => any;

const useLiferayFetch: TUseLiferayFetch = ({apiURL, options}) => {
	const [result, setResult] = useState<any>({});

	useEffect(() => {
		const makeFetch = async () => {
			const response = await Liferay.Util.fetch(apiURL, {
				headers: HEADERS,
				...options,
			});

			const result = await response.json();

			setResult(result);
		};

		makeFetch();
	}, [apiURL, options]);

	return () => result;
};

export default useLiferayFetch;
