import React from 'react';
import {useParams} from 'react-router-dom';
import {useQueryParams} from 'shared/hooks/useQueryParams';

interface BundleElementProps {
	componentProps?: Record<string, unknown>;
	data: React.ComponentType<any>;
	destructured?: boolean;
}

const BundleElement = ({
	componentProps = {},
	data: Component,
	destructured = true
}: BundleElementProps) => {
	const params = useParams();
	const query = useQueryParams();

	if (destructured) {
		return <Component {...query} {...params} {...componentProps} />;
	}

	return (
		<Component
			router={{
				params,
				query
			}}
			{...componentProps}
		/>
	);
};

export default BundleElement;
