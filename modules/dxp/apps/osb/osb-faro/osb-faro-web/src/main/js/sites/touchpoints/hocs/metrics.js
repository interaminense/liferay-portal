export default [
	{
		name: 'visitorsMetric',
		sortField: 'visitorsMetric',
		title: Liferay.Language.get('unique-visitors'),
		type: 'number'
	},
	{
		name: 'viewsMetric',
		sortField: 'viewsMetric',
		title: Liferay.Language.get('views'),
		type: 'number'
	},
	{
		name: 'bounceRateMetric',
		sortField: 'bounceRateMetric',
		title: Liferay.Language.get('bounce-rate'),
		type: 'percentage'
	},
	{
		name: 'avgTimeOnPageMetric',
		sortField: 'avgTimeOnPageMetric',
		title: Liferay.Language.get('time-on-page'),
		type: 'time'
	},
	{
		name: 'entrancesMetric',
		sortField: 'entrancesMetric',
		title: Liferay.Language.get('entrances'),
		type: 'number'
	},
	{
		name: 'exitRateMetric',
		sortField: 'exitRateMetric',
		title: Liferay.Language.get('exit-rate'),
		type: 'percentage'
	}
];
