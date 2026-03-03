import {ErrorLike} from '@apollo/client';
import ErrorDisplay from '../ErrorDisplay';
import React from 'react';
import StatesRenderer from 'shared/components/states-renderer/StatesRenderer';

interface IMetricStateRendererProps {
	error: ErrorLike;
	loading: boolean;
	spacer?: boolean;
}

const MetricStateRenderer: React.FC<IMetricStateRendererProps> = ({
	children,
	error,
	loading,
	spacer = false
}) => (
	<StatesRenderer empty={false} error={!!error} loading={loading}>
		<StatesRenderer.Loading spacer={spacer} />
		<StatesRenderer.Error apolloError={error}>
			<ErrorDisplay />
		</StatesRenderer.Error>
		<StatesRenderer.Success>{children}</StatesRenderer.Success>
	</StatesRenderer>
);

export default MetricStateRenderer;
