/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {Alignments, RangeSelectors, Weights} from '../types/global';
import {formatTooltipDate} from '../utils/date';
import {DataKey, FormattedData} from '../utils/visitorsBehaviorChart';
import ChartTooltip from './ChartTooltip';

interface IVisitorsBehaviorTooltipProps {
	data: FormattedData;
	payload: any;
	rangeSeletor: RangeSelectors;
}

const VisitorsBehaviorTooltip: React.FC<IVisitorsBehaviorTooltipProps> = ({
	data,
	payload: rawPayload,
	rangeSeletor,
}) => {
	const payload = rawPayload[0].payload;

	const metricData = data.data[DataKey.Metric];
	const publishedVersionData = data.data[DataKey.PublishedVersionData];

	const header = [
		{
			columns: [
				{
					label: Liferay.Language.get('visitors-behavior'),
					weight: Weights.Semibold,
					width: 155,
				},
				{
					align: Alignments.Right,
					label: formatTooltipDate(
						payload.date as Date,
						rangeSeletor
					),
					width: 55,
				},
			],
		},
	];

	const rows = [
		{
			columns: [
				{
					label: () => (
						<>
							<div
								className={`icon__${DataKey.Metric.toLowerCase()} mr-2`}
							/>

							{metricData.title}
						</>
					),
				},
				{
					align: Alignments.Right,
					label: metricData.format?.(payload[DataKey.Metric]),
				},
			],
		},
	];

	if (payload[DataKey.PublishedVersionValue]) {
		rows.push({
			columns: [
				{
					label: () => (
						<>
							<div
								className={`icon__${DataKey.PublishedVersionData.toLowerCase()} mr-2`}
							/>

							{publishedVersionData.title}
						</>
					),
				},
				{
					align: Alignments.Right,
					label: publishedVersionData.format?.(
						payload[DataKey.PublishedVersionValue]
					),
				},
			],
		});
	}

	return (
		<div
			className="bb-tooltip-container visitors-behavior-chart__tooltip"
			style={{maxWidth: 400, position: 'static'}}
		>
			<ChartTooltip header={header} rows={rows} />
		</div>
	);
};

export default VisitorsBehaviorTooltip;
