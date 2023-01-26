import getCN from 'classnames';
import React, {Fragment} from 'react';

interface IMetricValueProps extends React.HTMLAttributes<HTMLDivElement> {
	type?: Type;
	value: string;
}

type Type = 'number' | 'percentage' | 'time' | 'ratings';

const getRegexType = (type: Type): RegExp => {
	if (type === 'ratings') {
		return /([/][0-9]+)/g;
	} else {
		return /([a-zA-Z%])+/g;
	}
};

const formatValue = (value: string, regex: RegExp): React.ReactElement[] => {
	const items = value.split(' ');

	return items.map((item, i) => {
		const [value, unit] = item.split(regex);

		return (
			<Fragment key={i}>
				{value}

				<span className='metric-value-letter'>{unit}</span>
			</Fragment>
		);
	});
};

const MetricValue: React.FC<IMetricValueProps> = ({
	className,
	type = 'number',
	value
}) => (
	<div className={getCN('metric-value', className)}>
		{formatValue(value, getRegexType(type))}
	</div>
);

export default MetricValue;
