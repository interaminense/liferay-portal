import TimeZone from 'shared/util/records/TimeZone';
import {useProject} from './useProject';

export const useTimeZone = (): TimeZone => {
	const project = useProject();

	return project.get('timeZone').toObject();
};
