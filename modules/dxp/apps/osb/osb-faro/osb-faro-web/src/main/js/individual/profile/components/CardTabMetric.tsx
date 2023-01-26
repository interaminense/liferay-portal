import MetricValue from 'cerebro-shared/components/MetricValue';
import React from 'react';
import Trend from 'shared/components/Trend';
import {getMetricFormatter, MetricValueType} from 'shared/util/charts';
import {getStatsColor} from 'shared/util/metrics';
import {toRounded} from 'shared/util/numbers';

interface ICardTabMetricProps extends React.HTMLAttributes<HTMLElement> {
	change: number;
	label?: string;
	type: MetricValueType;
	value: number;
}

const getTrendOptions = (change: number): {color: string; icon: string} => {
	let icon;
	let trendClassification = 'NEUTRAL';

	if (change < 0 && isFinite(change)) {
		icon = 'caret-bottom';
		trendClassification = 'NEGATIVE';
	} else if (change > 0 && isFinite(change)) {
		icon = 'caret-top';
		trendClassification = 'POSITIVE';
	}

	const color = getStatsColor(trendClassification);

	return {color, icon};
};

const CardTabMetric: React.FC<ICardTabMetricProps> = ({
	change,
	label,
	type,
	value
}) => {
	const formatter = getMetricFormatter(type);
	const changeLabel = isFinite(change)
		? `${toRounded(Math.abs(change))}%`
		: '--';
	const {color, icon} = getTrendOptions(change);

	return (
		<span>
			<span className='primary-content'>
				<MetricValue type={type} value={formatter(value)} />
			</span>

			{label ? (
				<span className='text-secondary'>{label}</span>
			) : (
				<Trend color={color} icon={icon} label={changeLabel} />
			)}
		</span>
	);
};

export default CardTabMetric;
