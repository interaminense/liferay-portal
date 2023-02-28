import MetricBar, {Sizes} from 'shared/components/MetricBar';
import React, {FC} from 'react';
import TextTruncate from 'shared/components/TextTruncate';
import {ceil, round} from 'lodash';

interface IRelativeMetricBarProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		count: number;
		name: string;
	};
	empty?: boolean;
	maxCount?: number;
	showName?: boolean;
	total?: number;
	totalCount?: number;
}

const RelativeMetricBar: FC<IRelativeMetricBarProps> = ({
	data: {count, name},
	empty = false,
	maxCount,
	showName = false,
	totalCount
}) => {
	const denominator = ceil(maxCount / totalCount, 1) * totalCount;

	const percent = round(count / denominator, 2);

	const displayName = showName ? name : '';

	return (
		<td className='table-cell-expand relative-metric-bar-root'>
			<MetricBar percent={percent} size={Sizes.Lg}>
				<TextTruncate className='title' title={displayName} />

				{!empty && <span className='count'>{count}</span>}
			</MetricBar>
		</td>
	);
};

export default RelativeMetricBar;
