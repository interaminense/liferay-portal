import AssetsTouchpointQuery from 'shared/queries/AssetsTouchpointQuery';
import BaseCard from 'cerebro-shared/components/base-card';
import React from 'react';
import TouchpointsListCard from '../components/TouchpointsListCard';
import URLConstants from 'shared/util/url-constants';
import {compose} from 'redux';
import {graphql} from '@apollo/react-hoc';
import {HOC_CARD_PROPTYPES} from 'shared/util/proptypes';
import {
	mapPropsToOptions,
	mapResultToProps
} from './mappers/touchpoint-list-query';
import {PropTypes} from 'prop-types';
import {withEmpty} from 'cerebro-shared/hocs/utils';
import {withError, withLoading} from 'shared/hoc';

const TouchpointListWithData = compose(
	graphql(AssetsTouchpointQuery, {
		options: mapPropsToOptions,
		props: mapResultToProps
	}),
	withLoading({alignCenter: true, page: false}),
	withError({page: false}),
	withEmpty({
		emptyDescription: (
			<>
				<span className='mr-1'>
					{Liferay.Language.get(
						'check-back-later-to-verify-if-data-has-been-received-from-your-data-sources'
					)}
				</span>

				<a
					href={URLConstants.AssetsDefinitionDocumentation}
					key='DOCUMENTATION'
					target='_blank'
				>
					{Liferay.Language.get('learn-more-about-assets')}
				</a>
			</>
		),
		emptyTitle: Liferay.Language.get(
			'there-are-no-assets-on-the-selected-period'
		)
	})
)(TouchpointsListCard);

TouchpointListWithData.propTypes = HOC_CARD_PROPTYPES;

const propTypes = {
	assetType: PropTypes.string
};

const defaultProps = {
	className: 'analytics-touchpoints-list-card'
};

const TouchpointsListBaseCard = ({
	assetType,
	className,
	label,
	legacyDropdownRangeKey
}) => (
	<BaseCard
		className={className}
		label={label}
		legacyDropdownRangeKey={legacyDropdownRangeKey}
		minHeight={536}
	>
		{({filters, rangeSelectors, router}) => (
			<TouchpointListWithData
				assetType={assetType}
				filters={filters}
				rangeSelectors={rangeSelectors}
				router={router}
			/>
		)}
	</BaseCard>
);

TouchpointsListBaseCard.propTypes = propTypes;
TouchpointsListBaseCard.defaultProps = defaultProps;

export default TouchpointsListBaseCard;
