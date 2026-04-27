import BundleElement from 'route-middleware/BundleRouter';
import omitDefinedProps from 'shared/util/omitDefinedProps';
import React from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import {PropTypes} from 'prop-types';
import {Route, Routes as RouterRoutes} from 'react-router-dom';

export default class TabRoutes extends React.Component {
	static propTypes = {
		routes: PropTypes.arrayOf(
			PropTypes.shape({
				component: PropTypes.func,
				path: PropTypes.string
			})
		)
	};

	render() {
		const {routes, ...otherProps} = this.props;

		return (
			<RouterRoutes>
				{routes.map(({component: Component, path}) => (
					<Route
						element={
							<BundleElement
								componentProps={omitDefinedProps(
									otherProps,
									TabRoutes.propTypes
								)}
								data={Component}
							/>
						}
						key={path}
						path={path}
					/>
				))}

				<Route element={<RouteNotFound />} path='*' />
			</RouterRoutes>
		);
	}
}
