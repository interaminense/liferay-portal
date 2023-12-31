import queryString from 'query-string';
import React from 'react';
import {matchPath, Route} from 'react-router-dom';

export default ({
	componentProps = {},
	data: DefaultComponent,
	destructured = true,
	...otherRouteProps
}) => (
	<Route
		{...otherRouteProps}
		render={({history, location: {search}, match: {params, path}}) => {
			const query = queryString.parse(search);

			const renderDefaultComponentDestructured = () => (
				<DefaultComponent
					history={history}
					{...query}
					{...params}
					{...componentProps}
				/>
			);

			const renderDefaultComponent = () => {
				const {
					params: {touchpoint}
				} = matchPath(window.location.pathname, {path});

				return (
					<DefaultComponent
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

			return destructured
				? renderDefaultComponentDestructured()
				: renderDefaultComponent();
		}}
	/>
);
