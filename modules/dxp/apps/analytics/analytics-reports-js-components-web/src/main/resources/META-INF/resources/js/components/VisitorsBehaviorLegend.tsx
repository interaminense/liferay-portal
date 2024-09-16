/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {DataKey, FormattedData} from '../utils/visitorsBehaviorChart';

interface IVisitorsBehaviorLegendProps {
	data: FormattedData;
	onMouseChange: (dataKey: DataKey | null) => void;
	payload: {dataKey: DataKey}[];
}

const VisitorsBehaviorLegend: React.FC<IVisitorsBehaviorLegendProps> = ({
	data,
	onMouseChange,
	payload,
}) => {
	return (
		<ul className="d-inline-block ml-5 visitors-behavior-chart__legend">
			{payload?.map(({dataKey}) => (
				<li
					className="mr-3"
					key={dataKey}
					onMouseEnter={() => onMouseChange(dataKey)}
					onMouseLeave={() => onMouseChange(null)}
				>
					<div className={`icon__${dataKey.toLowerCase()} mr-2`} />

					{data.data[dataKey].title}
				</li>
			))}
		</ul>
	);
};

export default VisitorsBehaviorLegend;
