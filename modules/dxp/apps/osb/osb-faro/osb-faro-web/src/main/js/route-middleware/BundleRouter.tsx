import React from 'react';
import {useMatch, useNavigate, useParams} from 'react-router';
import {useQueryParams} from 'shared/hooks/useQueryParams';

type BundleRouterProps = {
	data: React.FC<any>;
	componentProps?: Record<string, any>;
	destructured?: boolean;
	path: string | string[];
};

const BundleRouter: React.FC<BundleRouterProps> = ({
	data: Component,
	componentProps = {},
	destructured = true,
	path
}) => {
	const navigate = useNavigate();
	const params = useParams();
	const query = useQueryParams();

	const paths = Array.isArray(path) ? path : [path];
	const matches = paths.map(p => useMatch(p));
	const match = matches.find(Boolean);

	if (destructured) {
		return (
			<Component
				navigate={navigate}
				{...query}
				{...params}
				{...componentProps}
			/>
		);
	}

	return (
		<Component
			navigate={navigate}
			router={{
				params: {
					...params,
					touchpoint: match?.params?.touchpoint
				},
				query
			}}
			{...componentProps}
		/>
	);
};

export default BundleRouter;
