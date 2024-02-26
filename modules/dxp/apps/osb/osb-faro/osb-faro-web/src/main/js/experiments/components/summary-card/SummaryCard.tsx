import React from 'react';
import {Status} from './types';
import {SummaryCompletedCard} from './SummaryCompletedCard';
import {SummaryDraftCard} from './SummaryDraftCard';
import {SummaryNoWinnerCard} from './SummaryNoWinnerCard';
import {SummaryRunningCard} from './SummaryRunningCard';
import {SummaryTerminatedCard} from './SummaryTerminatedCard';
import {SummaryWinnerCard} from './SummaryWinnerCard';
import {useTimeZone} from 'shared/hooks/useTimeZone';

const Component = {
	[Status.Completed]: SummaryCompletedCard,
	[Status.Draft]: SummaryDraftCard,
	[Status.Running]: SummaryRunningCard,
	[Status.FinishedNoWinner]: SummaryNoWinnerCard,
	[Status.Terminated]: SummaryTerminatedCard,
	[Status.FinishedWinner]: SummaryWinnerCard
};

export const SummaryCard = ({experiment}) => {
	const {timeZoneId} = useTimeZone();
	const SummaryComponent = Component[experiment.status.toLowerCase()];

	return <SummaryComponent experiment={experiment} timeZoneId={timeZoneId} />;
};
