import ErrorDisplay from '../ErrorDisplay';
import React, {PropsWithChildren} from 'react';
import StatesRenderer from 'shared/components/states-renderer/StatesRenderer';
import {ErrorLike} from '@apollo/client';

interface IAudienceReportStateRendererProps {
	error: ErrorLike;
	loading: boolean;
}

const AudienceReportStateRenderer: React.FC<
	PropsWithChildren<IAudienceReportStateRendererProps>
> = ({children, error, loading}) => (
	<StatesRenderer empty={false} error={!!error} loading={loading}>
		<StatesRenderer.Loading />
		<StatesRenderer.Error apolloError={error}>
			<ErrorDisplay />
		</StatesRenderer.Error>
		<StatesRenderer.Success>{children}</StatesRenderer.Success>
	</StatesRenderer>
);

export default AudienceReportStateRenderer;
