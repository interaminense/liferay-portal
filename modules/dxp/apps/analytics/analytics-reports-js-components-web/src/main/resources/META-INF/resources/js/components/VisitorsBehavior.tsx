/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import React, {useContext, useEffect, useState} from 'react';

import {AnalyticsReportsContext} from '../AnalyticsReportsContext';
import {fetchHistogram} from '../apis/asset-metrics';
import {AssetTypes, MetricType} from '../types/global';
import {
	assetMetrics,
	assetMetricsComplement,
	metricNameByType,
} from '../utils/metrics';
import {
	Data,
	formattedVisitorsBehaviorData,
} from '../utils/visitorsBehaviorChart';
import Title from './Title';
import VisitorsBehaviorChart from './VisitorsBehaviorChart';

interface IVisitorsBehaviorStateRenderer {
	data: Data | null;
	error: string;
	loading: boolean;
}

const VisitorsBehaviorStateRenderer: React.FC<
	IVisitorsBehaviorStateRenderer
> = ({data, error, loading}) => {
	const {filters} = useContext(AnalyticsReportsContext);
	if (loading) {
		return <ClayLoadingIndicator className="mt-10" />;
	}

	if (error) {
		return <ClayAlert displayType="danger" title={error} />;
	}

	if (data) {
		const metricName =
			metricNameByType[filters?.metric || MetricType.Undefined];

		const initialData = {
			...data,
			histograms: data?.histograms.map((histogram) => ({
				...histogram,
				metrics: histogram.metrics.map((metric) => ({
					...metric,
					key: metric.valueKey,
				})),
			})),
		};

		const formattedData = formattedVisitorsBehaviorData({
			data: initialData,
			metricName,
			...assetMetricsComplement[metricName],
		});

		if (formattedData) {
			return (
				<VisitorsBehaviorChart
					data={formattedData}
					rangeSelector={filters.rangeSelector}
				/>
			);
		}

		return null;
	}

	return null;
};

const VisitorsBehavior = () => {
	const {assetId, assetType, filters, groupId} = useContext(
		AnalyticsReportsContext
	);

	const [data, setData] = useState<Data | null>(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);

			try {
				const response = await fetchHistogram({
					assetId,
					assetType: assetType || AssetTypes.Undefined,
					groupId,
					individual: filters.individual,
					rangeSelector: filters.rangeSelector,
					selectedMetrics:
						assetMetrics[assetType || AssetTypes.Undefined],
				});

				if (!response.ok) {
					throw new Error();
				}

				const data = await response.json();

				if (data.error) {
					throw new Error(data.error);
				}

				setData(data);
				setLoading(false);
				setError('');
			}
			catch (error: any) {
				if (process.env.NODE_ENV === 'development') {
					console.error(error);
				}

				setData(null);
				setLoading(false);
				setError(error.toString());
			}
		}

		fetchData();
	}, [
		assetId,
		assetType,
		filters.individual,
		filters.rangeSelector,
		groupId,
	]);

	return (
		<div>
			<Title
				description={Liferay.Language.get(
					'total-daily-interactions-and-asset-updates'
				)}
				section
				value={Liferay.Language.get('visitors-behavior')}
			/>

			<VisitorsBehaviorStateRenderer
				data={data}
				error={error}
				loading={loading}
			/>
		</div>
	);
};

export default VisitorsBehavior;
