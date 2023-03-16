import {BAR_CHART} from 'shared/components/Chart';
import {getDate} from 'shared/util/date';
import {getSafeRangeSelectors} from 'shared/util/util';
import {Map} from 'immutable';
import {safeResultToProps} from 'shared/util/mappers';

export const CHART_DATA_ID_1 = 'knownIndividuals';
export const CHART_DATA_ID_2 = 'anonymousIndividuals';

export const LANG_MAP = {
	[CHART_DATA_ID_1]: Liferay.Language.get('known-visitors'),
	[CHART_DATA_ID_2]: Liferay.Language.get('anonymous-visitors')
};

export const mapPropsToOptions = ({channelId, interval, rangeSelectors}) => ({
	variables: {
		channelId,
		interval,
		...getSafeRangeSelectors(rangeSelectors)
	}
});

export const mapResultToProps = safeResultToProps(
	({
		individualMetric: {
			anonymousIndividualsMetric,
			knownIndividualsMetric,
			totalIndividualsMetric
		}
	}) => ({
		items: [
			{
				...totalIndividualsMetric,
				data: totalIndividualsMetric.histogram.metrics,
				id: 'totalIndividuals',
				title: Liferay.Language.get('total-individuals')
			},
			{
				...knownIndividualsMetric,
				data: knownIndividualsMetric.histogram.metrics,
				id: 'knownIndividualsMetric',
				info: {
					content: Liferay.Language.get(
						'current-total-of-known-individuals-that-are-tracked-by-analytics-cloud.-an-individual-is-considered-known-if-we-have-any-identifiable-information-about-the-individual'
					),
					title: Liferay.Language.get('known-individuals')
				},
				title: Liferay.Language.get('known')
			},
			{
				...anonymousIndividualsMetric,
				data: anonymousIndividualsMetric.histogram.metrics,
				id: 'anonymousIndividualsMetric',
				info: {
					content: Liferay.Language.get(
						'current-total-of-anonymous-individuals-that-are-tracked-by-analytics-cloud.-inactive-anonymous-individuals-are-automatically-removed-if-they-dont-have-activities-during-the-retention-period'
					),
					title: Liferay.Language.get('anonymous-individuals')
				},
				title: Liferay.Language.get('anonymous')
			}
		].map(({data, id, info, title, trend: {percentage}, value}) => ({
			change: percentage,
			data: data.map(({value}) => value),
			id,
			info,
			title,
			total: value
		}))
	})
);

export const mapActiveIndividualsResultToProps = safeResultToProps(
	({
		individualMetric: {
			anonymousIndividualsMetric,
			knownIndividualsMetric,
			totalIndividualsMetric
		}
	}) => ({
		data: [
			{
				data: knownIndividualsMetric.histogram.metrics.map(
					({value}) => value
				),
				id: CHART_DATA_ID_1,
				name: LANG_MAP[CHART_DATA_ID_1],
				type: BAR_CHART
			},
			{
				data: anonymousIndividualsMetric.histogram.metrics.map(
					({value}) => value
				),
				id: CHART_DATA_ID_2,
				name: LANG_MAP[CHART_DATA_ID_2],
				type: BAR_CHART
			},
			{
				data: totalIndividualsMetric.histogram.metrics.map(({key}) =>
					getDate(key)
				),
				id: 'x'
			}
		],
		dateKeysIMap: Map(
			totalIndividualsMetric.histogram.metrics.map(({key, valueKey}) => [
				getDate(key),
				valueKey.split('/').map(getDate)
			])
		)
	})
);
