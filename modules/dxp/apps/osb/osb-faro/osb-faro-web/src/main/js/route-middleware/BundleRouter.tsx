import React from 'react';
import {matchPath, Route} from 'react-router-dom';
import {useQueryParams} from 'shared/hooks';

const DestructuredComponent = ({
	Component,
	componentProps,
	history,
	params
}) => {
	const query = useQueryParams();

	return (
		<Component
			history={history}
			{...query}
			{...params}
			{...componentProps}
		/>
	);
};

const StructuredComponent = ({
	Component,
	componentProps,
	history,
	params,
	path
}) => {
	const query = useQueryParams();

	const {
		// @ts-ignore
		params: {touchpoint}
	} = matchPath(window.location.pathname, {path});

	return (
		<Component
			history={history}
			router={{
				params: {
					...params,
					touchpoint
				},
				query
			}}
			{...componentProps}
		/>
	);
};

export default ({
	componentProps = {},
	data: DefaultComponent,
	destructured = true,
	...otherRouteProps
}) => (
	<Route
		{...otherRouteProps}
		render={({history, match: {params, path}}) => {
			if (destructured) {
				return (
					<DestructuredComponent
						Component={DefaultComponent}
						componentProps={componentProps}
						history={history}
						params={params}
					/>
				);
			}

			return (
				<StructuredComponent
					Component={DefaultComponent}
					componentProps={componentProps}
					history={history}
					params={params}
					path={path}
				/>
			);
		}}
	/>
);
