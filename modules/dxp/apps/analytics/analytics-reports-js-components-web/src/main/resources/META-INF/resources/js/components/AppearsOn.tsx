/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import React, {useContext, useEffect, useState} from 'react';

import {AnalyticsReportsContext} from '../AnalyticsReportsContext';
import {fetchTopPageAssetAppearsOnMetrics} from '../apis/asset-metrics';
import { AssetTypes, MetricName, MetricType } from '../types/global';
import { formattedAppearsOnData } from '../utils/appearsOnChart';
import { assetMetricsComplement, metricNameByType } from '../utils/metrics';
import Title from './Title';


type AssetAppearsOnHistograms = {
    appearsOnHistograms: AppearsOnHistogram[];
    metricName: MetricName;
}

type AppearsOnHistogram = {
    metrics: MetricData[];
    pageTitle: string;
}

type MetricData = {
    value: number;
    valueKey: string;
}

type Data = {
	assetAppearsOnHistograms: AssetAppearsOnHistograms[];
};

interface IAppearsOnRenderer {
	data: Data | null;
	error: string;
	loading: boolean;
}

const AppearsOnRenderer: React.FC<IAppearsOnRenderer> = ({
	data, error, loading
}) => {
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

		const assetAppearsOnHistogram = data.assetAppearsOnHistograms.find(assetAppearsOnHistogram => assetAppearsOnHistogram.metricName === metricName);
		
		if (assetAppearsOnHistogram) {
			const initialData = {
				...assetAppearsOnHistogram,
				appearsOnHistograms: assetAppearsOnHistogram
						.appearsOnHistograms.map(appearsOnHistogram => ({
							...appearsOnHistogram,
							metrics: appearsOnHistogram.metrics.map(metric => ({
								...metric,
								key: metric.valueKey
							}))
						}))
			}

			const formattedData = formattedAppearsOnData({
				data: initialData, 
				...assetMetricsComplement[metricName]
			});

			if (formattedData) {
				return (
					<div className="top-page-asset-appears-on-metrics">
			
			
					</div>
				);
			}
		}

	}

	return null;
};

const AppearsOn = () => {
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
				const response = await fetchTopPageAssetAppearsOnMetrics({
					assetId,
					assetType: assetType || AssetTypes.Undefined,
					groupId,
					individual: filters.individual,
					rangeSelector: filters.rangeSelector,
				});

				const data = await response.json();

				if (data.error) {
					throw new Error(data.error);
				}

				setData(data);
				setLoading(false);
				setError('');
			}
			catch (error: any) {
				console.error(error);

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

			<AppearsOnRenderer
				data={data}
				error={error}
				loading={loading}
			/>
		</div>
	);
};

export default AppearsOn;
