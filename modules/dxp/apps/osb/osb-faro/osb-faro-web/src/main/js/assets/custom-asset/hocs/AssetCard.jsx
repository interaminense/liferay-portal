import BaseCard from 'cerebro-shared/components/base-card';
import Button from 'shared/components/Button';
import Card from 'shared/components/Card';
import getMetricsMapper from 'cerebro-shared/hocs/mappers/metrics';
import Metrics from 'cerebro-shared/components/Metrics';
import React, {useCallback, useState} from 'react';
import {ASSET_METRICS} from 'shared/util/constants';
import {compose} from 'redux';
import {graphql} from '@apollo/react-hoc';
import {PropTypes} from 'prop-types';
import {withEmpty, withError} from 'cerebro-shared/hocs/utils';
import {withLoading} from 'shared/hoc';

const CHARTS = {
	line: {
		component: Metrics,
		mapper: getMetricsMapper
	}
};

/**
 * Chart Component
 * @param {object} props
 * @description Returns a component based on chart type
 * @returns JSX Element
 */
const Chart = props => {
	const {
		handleShowPreviousChanged,
		id,
		onRemoveAsset,
		panel: {chartType},
		showPrevious
	} = props;
	const Chart = CHARTS[chartType].component;

	return (
		<>
			<Chart
				onShowPreviousChange={handleShowPreviousChanged}
				showPrevious={showPrevious}
				{...props}
			/>

			<div className='d-flex justify-content-end'>
				<Button
					aria-label={Liferay.Language.get('delete')}
					borderless
					display='secondary'
					icon='trash'
					iconAlignment='right'
					onClick={() => onRemoveAsset(Number(id))}
					size='sm'
				/>
			</div>
		</>
	);
};

/**
 * Get Metric
 * @description Used exclusively to Metris Card
 * @returns {array}
 */
const getMetric = name => {
	const {title, type} = ASSET_METRICS.find(({key}) => key == name);

	return [{name, title, type}];
};

/**
 * Get Mapper
 * @description Returns a mapper based on chart type
 * @returns mapper
 */
const getMapper = ({chartType, metric}) => {
	const mapper = CHARTS[chartType].mapper;

	if (chartType === 'line') {
		return mapper(({custom}) => custom, getMetric(metric));
	}

	return mapper(({custom}) => custom);
};

const propTypes = {
	/**
	 * @type {string}
	 * @description asset id
	 * @default undefined
	 */
	assetId: PropTypes.string,

	/**
	 * @type {string|number}
	 * @description dashboard id
	 * @default undefined
	 */
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

	/**
	 * @type {object}
	 * @description GraphQL Query to Custom Asset
	 * @default undefined
	 */
	itemQuery: PropTypes.object,

	/**
	 * @type {object}
	 * @description Define a chartType and metric to config the card
	 */
	panel: PropTypes.shape({
		chartType: PropTypes.string,
		metric: PropTypes.string
	})
};

const defaultProps = {
	className: 'analytics-custom-metrics-card'
};

const AssetCard = ({
	assetId,
	className,
	id,
	itemQuery,
	label,
	legacyDropdownRangeKey,
	onRemoveAsset,
	panel
}) => {
	const AssetComponent = compose(
		graphql(itemQuery, getMapper(panel)),
		withLoading({alignCenter: true, page: false}),
		withError(),
		withEmpty()
	)(Chart);

	const [showPrevious, setShowPrevious] = useState(false);

	const handleShowPreviousChanged = useCallback(
		newVal => setShowPrevious(newVal),
		[]
	);

	return (
		<BaseCard
			className={className}
			label={label}
			legacyDropdownRangeKey={legacyDropdownRangeKey}
			minHeight={536}
		>
			{({rangeSelectors, router}) => (
				<Card.Body>
					<AssetComponent
						assetId={assetId}
						chartHeight={416}
						handleShowPreviousChanged={handleShowPreviousChanged}
						id={String(id)}
						onRemoveAsset={onRemoveAsset}
						panel={panel}
						rangeSelectors={rangeSelectors}
						router={router}
						showPrevious={showPrevious}
						showTabs={false}
					/>
				</Card.Body>
			)}
		</BaseCard>
	);
};

AssetCard.propTypes = propTypes;
AssetCard.defaultProps = defaultProps;

export default AssetCard;
