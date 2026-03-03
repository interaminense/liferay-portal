import {useQuery} from '@apollo/client/react';
import React from 'react';

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

			const {data, loading, error, ...rest} = useQuery(query, {
				...resolvedOptions,
				variables: resolvedOptions?.variables
			});

			let mappedProps;

			if (typeof config === 'function') {
				mappedProps = config({data, loading, error, ...rest}, props);
			} else if (typeof config === 'object' && config?.props) {
				mappedProps = config.props(
					{data, loading, error, ...rest},
					props
				);
			} else {
				const safeData = (data ?? {}) as Record<string, any>;

				mappedProps = {
					data: {
						...safeData,
						loading,
						error
					}
				};
			}

			return <WrappedComponent {...props} {...mappedProps} />;
		};
	};
}
