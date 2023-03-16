export default [
	{
		compositeMetrics: [
			{
				name: 'anonymousVisitorsMetric',
				title: Liferay.Language.get('anonymous-visitors'),
				tooltipTitle: Liferay.Language.get('anonymous'),
				type: 'number'
			},
			{
				name: 'knownVisitorsMetric',
				title: Liferay.Language.get('known-visitors'),
				tooltipTitle: Liferay.Language.get('known'),
				type: 'number'
			}
		],
		name: 'visitorsMetric',
		title: Liferay.Language.get('unique-visitors'),
		type: 'number'
	},
	{
		name: 'sessionsPerVisitorMetric',
		title: Liferay.Language.get('sessions-visitor'),
		tooltipTitle: Liferay.Language.get('avg-sessions'),
		type: 'number'
	},
	{
		name: 'sessionDurationMetric',
		title: Liferay.Language.get('session-duration'),
		tooltipTitle: Liferay.Language.get('avg-duration'),
		type: 'time'
	},
	{
		name: 'bounceRateMetric',
		title: Liferay.Language.get('bounce-rate'),
		tooltipTitle: Liferay.Language.get('avg-bounce'),
		type: 'percentage'
	}
];
