import React from 'react';
import {useQuery} from '@apollo/client/react';

/**
 * Compatibility Layer to support old version of graphql function after migrating to apollo 4:
 * <--- OLD --->
 * import {graphql} from '@apollo/react-hoc';
 * <--- NEW --->
 * import {graphql} from 'shared/apollo/compatibility-layer';
 */

export function graphql(query, config) {
	return function wrap(WrappedComponent) {
		return function GraphQLCompatWrapper(props) {
			const resolvedOptions =
				typeof config === 'object' && config?.options
					? typeof config.options === 'function'
						? config.options(props)
						: config.options
					: {};

			const {data, error, loading, ...rest} = useQuery(query, {
				...resolvedOptions,
				variables: resolvedOptions?.variables
			});

			let mappedProps;

			if (typeof config === 'function') {
				mappedProps = config({data, error, loading, ...rest}, props);
			} else if (typeof config === 'object' && config?.props) {
				mappedProps = config.props(
					{data, error, loading, ...rest},
					props
				);
			} else {
				const safeData = (data ?? {}) as Record<string, any>;

				mappedProps = {
					data: {
						...safeData,
						error,
						loading
					}
				};
			}

			return <WrappedComponent {...props} {...mappedProps} />;
		};
	};
}
