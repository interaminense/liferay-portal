import PreferenceQuery from 'shared/queries/PreferenceQuery';
import {convertMillisecondsToMonths} from 'shared/util/date';
import {DATA_RETENTION_PERIOD_KEY} from 'shared/util/constants';
import {useQuery} from '@apollo/client/react';

export const useRetentionPeriod = () => {
	const {data, error, loading} = useQuery<{preference: {value: string}}>(
		PreferenceQuery,
		{
			variables: {
				key: DATA_RETENTION_PERIOD_KEY
			}
		}
	);

	if (error) {
		throw error;
	}

	if (loading) return null;

	return convertMillisecondsToMonths(parseInt(data.preference.value));
};
