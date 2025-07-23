/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Text} from '@clayui/core';
import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import classNames from 'classnames';
import React, {useContext, useEffect, useState} from 'react';

import {Context} from '../../Context';
import {MetricType} from '../../types/global';
import {toThousands} from '../../utils/math';
import {
	TrendClassification,
	getStatsColor,
	getStatsIcon,
} from '../../utils/metrics';

type Metric = {
	metricType: MetricType;
	trend: {
		percentage: number;
		trendClassification: TrendClassification;
	};
	value: number;
};

interface IMetricsContentProps {
	defaultMetric: Metric;
	selectedMetrics: Metric[];
}

const MetricsContent: React.FC<IMetricsContentProps> = ({selectedMetrics}) => {
	const {changeMetricFilter, filters} = useContext(Context);

	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLDivElement>,
		metricType: MetricType
	) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();

			changeMetricFilter(metricType);
		}
	};

	return (
		<div className="d-flex flex-row justify-content-between metrics-container">
			{selectedMetrics.map((metric) => {
				const statsColor = getStatsColor(
					metric.trend.trendClassification
				);

				const selected = metric.metricType === filters.metric;
				const statsIcon = getStatsIcon(metric.trend.percentage);

				return (
					<div
						aria-pressed={selected}
						className={classNames(
							'cursor-pointer flex-grow-1 metrics-card rounded-lg',
							{
								'selected tab-focus': selected,
							}
						)}
						key={metric.metricType}
						onClick={() => changeMetricFilter(metric.metricType)}
						onKeyDown={(event) =>
							handleKeyDown(event, metric.metricType)
						}
						role="button"
						tabIndex={0}
					>
						<Text size={3} weight="semi-bold">
							{metric.metricType.toUpperCase()}
						</Text>

						<div className="mt-2">
							<Text size={7} weight="bold">
								{toThousands(metric.value)}
							</Text>

							<div>
								<Text color={statsColor}>
									<>
										{statsIcon && (
											<span className="mr-1">
												<ClayIcon symbol={statsIcon} />
											</span>
										)}
										{Math.abs(metric.trend.percentage)}%
									</>
								</Text>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

type MetricsApiResponse = {
	defaultMetric: Metric;
	selectedMetrics: Metric[];
};

async function fetchMetricsData(): Promise<MetricsApiResponse> {

	// TODO fetch from API

	return {
		defaultMetric: {
			metricType: MetricType.Views,
			trend: {
				percentage: 50,
				trendClassification: TrendClassification.Neutral,
			},
			value: 456000,
		},
		selectedMetrics: [
			{
				metricType: MetricType.Impressions,
				trend: {
					percentage: 2,
					trendClassification: TrendClassification.Positive,
				},
				value: 3000,
			},
			{
				metricType: MetricType.Views,
				trend: {
					percentage: 50,
					trendClassification: TrendClassification.Neutral,
				},
				value: 456000,
			},
			{
				metricType: MetricType.Downloads,
				trend: {
					percentage: -100,
					trendClassification: TrendClassification.Negative,
				},
				value: 15000,
			},
		],
	};
}

const Metrics: React.FC<React.HTMLAttributes<HTMLElement>> = () => {
	const {changeMetricFilter, filters} = useContext(Context);
	const [data, setData] = useState<MetricsApiResponse | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const data = await fetchMetricsData();

				if (filters.metric === MetricType.Undefined) {
					changeMetricFilter(data.defaultMetric.metricType);
				}

				setData(data);
				setLoading(false);
			}
			catch (error) {
				console.error(error);

				setLoading(false);
			}
		};

		fetchData();
	}, [changeMetricFilter, filters.metric]);

	if (loading) {
		return <ClayLoadingIndicator />;
	}

	if (!data) {
		return null;
	}

	return <MetricsContent {...data} />;
};

export {Metrics, MetricsContent};
