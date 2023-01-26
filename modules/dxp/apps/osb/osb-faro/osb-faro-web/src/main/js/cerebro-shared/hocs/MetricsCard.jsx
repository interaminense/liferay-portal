import BaseCard from 'cerebro-shared/components/base-card';
import Card from 'shared/components/Card';
import Metrics from 'cerebro-shared/components/Metrics';
import React, {useCallback, useState} from 'react';
import {compose} from 'redux';
import {HOC_CARD_PROPTYPES} from 'shared/util/proptypes';
import {withEmpty} from 'cerebro-shared/hocs/utils';
import {withError, withLoading} from 'shared/hoc';

/**
 * HOC
 * @description Metrics Card
 * @param {function} withMetrics
 */
const withMetricsCard = (withMetrics, baseCardProps = {}) => {
	const MetricsWithData = compose(
		withMetrics(),
		withLoading({alignCenter: true, page: false}),
		withEmpty(),
		withError({page: false})
	)(Metrics);

	MetricsWithData.propTypes = HOC_CARD_PROPTYPES;

	const defaultProps = {
		className: 'analytics-metrics-card'
	};

	const MetricsCard = ({className, label, legacyDropdownRangeKey}) => {
		const [activeItemIndex, setActiveItemIndex] = useState(0);
		const [showPrevious, setShowPrevious] = useState(false);

		const handleActiveItemIndexChanged = useCallback(
			newVal => setActiveItemIndex(newVal),
			[]
		);
		const handleShowPreviousChanged = useCallback(
			newVal => setShowPrevious(newVal),
			[]
		);

		return (
			<BaseCard
				className={className}
				label={label}
				legacyDropdownRangeKey={legacyDropdownRangeKey}
				minHeight={605}
				{...baseCardProps}
			>
				{({filters, interval, rangeSelectors, router}) => (
					<Card.Body>
						<MetricsWithData
							activeItemIndex={activeItemIndex}
							filters={filters}
							interval={interval}
							onActiveItemIndexChange={
								handleActiveItemIndexChanged
							}
							onShowPreviousChange={handleShowPreviousChanged}
							rangeSelectors={rangeSelectors}
							router={router}
							showPrevious={showPrevious}
						/>
					</Card.Body>
				)}
			</BaseCard>
		);
	};

	MetricsCard.defaultProps = defaultProps;

	return MetricsCard;
};

export {withMetricsCard};
export default withMetricsCard;
