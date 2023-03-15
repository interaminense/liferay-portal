export default [
	{
		name: 'submissionsMetric',
		sortField: 'submissionsMetric',
		title: Liferay.Language.get('submissions'),
		type: 'number'
	},
	{
		name: 'viewsMetric',
		sortField: 'viewsMetric',
		title: Liferay.Language.get('views'),
		type: 'number'
	},
	{
		name: 'abandonmentsMetric',
		sortField: 'abandonmentsMetric',
		title: Liferay.Language.get('abandonment'),
		type: 'percentage'
	},
	{
		name: 'completionTimeMetric',
		sortField: 'completionTimeMetric',
		title: Liferay.Language.get('completion-time'),
		type: 'time'
	}
];
