import getCN from 'classnames';
import Icon from 'shared/components/Icon';
import React from 'react';
import {CHART_COLORS} from 'shared/components/Chart';
import {PropTypes} from 'prop-types';

export default class ChangeLegend extends React.Component {
	static propTypes = {
		items: PropTypes.arrayOf(
			PropTypes.shape({
				change: PropTypes.number,
				id: PropTypes.string,
				secondaryInfo: PropTypes.string,
				title: PropTypes.string
			})
		).isRequired
	};

	render() {
		const {className, items} = this.props;

		return (
			<div className={getCN('change-legend-root', className)}>
				{items.map((item, i) => {
					const {change, id, secondaryInfo, title} = item;

					const decrease = change < 0;

					const percentChange = isFinite(change)
						? `${Math.abs(change * 100).toFixed(1)}%`
						: '--';

					return (
						<div className={`legend-item ${id}`} key={id}>
							<div className='legend-header'>
								<span
									className='legend-color'
									style={{backgroundColor: CHART_COLORS[i]}}
								/>

								<span className='title'>{title}</span>
							</div>

							<div className='secondary-info'>
								{secondaryInfo}

								<span
									className={getCN('change', {
										decrease,
										increase: change > 0
									})}
								>
									{!!change && !isNaN(change) && (
										<Icon
											symbol={
												decrease
													? 'caret-bottom'
													: 'caret-top'
											}
										/>
									)}

									{percentChange}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}
