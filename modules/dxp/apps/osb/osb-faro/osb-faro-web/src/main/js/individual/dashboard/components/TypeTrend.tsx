import Chart, {CHART_COLOR_NAMES} from 'shared/components/Chart';
import getCN from 'classnames';
import Icon from 'shared/components/Icon';
import InfoPopover from 'shared/components/InfoPopover';
import React from 'react';
import {formatChange} from 'shared/util/change';
import {isFinite} from 'lodash';
import {sub} from 'shared/util/lang';

const {lannister: CHART_RED, stark: CHART_BLUE} = CHART_COLOR_NAMES;

interface ITrendItemProps {
	change: number;
	data: number[];
	id: string;
	info?: {content: string; title: string};
	title: string;
	total: number;
}

export const TrendItem: React.FC<ITrendItemProps> = ({
	change,
	data,
	id,
	info,
	title,
	total
}) => {
	const finiteChange = isFinite(change);

	return (
		<div className='trend-item-root' key={title}>
			<div className='trend-item-title d-flex justify-content-between'>
				<h5 className='card-title'>{title}</h5>

				{info && <InfoPopover {...info} />}
			</div>

			<div className='d-flex align-items-center flex-grow-1 justify-content-center'>
				{!!total && (
					<Chart
						area={{linearGradient: true}}
						axisX={{
							show: false
						}}
						axisY={{
							show: false
						}}
						chartType='area'
						data={[
							{
								color: change < 0 ? CHART_RED : CHART_BLUE,
								data,
								id
							}
						]}
						dataId={`${id}Data`}
						grid={{x: {show: false}, y: {show: false}}}
						height={40}
						id={id}
						interaction={{enabled: false}}
						tooltip={{show: false}}
					/>
				)}

				<div className='total'>{total.toLocaleString()}</div>
			</div>

			{!!total && (
				<div className='change description'>
					{sub(
						Liferay.Language.get('x-vs-previous-30-days'),
						[
							<span
								className={getCN({
									decrease: change < 0 && finiteChange,
									increase: change > 0 && finiteChange
								})}
								key='CHANGE'
							>
								{finiteChange && !!change && (
									<Icon
										symbol={
											change > 0
												? 'caret-top'
												: 'caret-bottom'
										}
									/>
								)}

								<b>
									{finiteChange
										? `${formatChange(change)}%`
										: '--'}
								</b>
							</span>
						],
						false
					)}
				</div>
			)}
		</div>
	);
};

const TypeTrend: React.FC<{items: ITrendItemProps[]}> = ({items}) => (
	<div className='type-trend-root'>
		{items.map((item, i) => (
			<TrendItem {...item} key={i} />
		))}
	</div>
);

TypeTrend.defaultProps = {
	items: []
};

export default TypeTrend;
