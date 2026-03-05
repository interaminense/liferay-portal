import React from 'react';
import {useNavigate, useParams, useLocation, matchPath} from 'react-router';
import {useQueryParams} from 'shared/hooks/useQueryParams';

const BundleRouter = ({
	componentProps = {},
	data: Component,
	destructured = true,
	path
}) => {
	const navigate = useNavigate();

	const params = useParams();
	const query = useQueryParams();
	const {pathname} = useLocation();

	let routerData = {};

	if (!destructured) {
		const matchedPath = matchPath({path}, pathname);

		routerData = {
			params: {
				...params,
				touchpoint: matchedPath?.params?.['touchpoint']
			},
			query
		};
	}

	return (
		<Component
			navigate={navigate}
			{...(destructured ? {...query, ...params} : {router: routerData})}
			{...componentProps}
		/>
	);
};

export default BundleRouter;
