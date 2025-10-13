import {ITimeZone} from 'shared/util/records/TimeZone';
import {useProject} from '../../AppContext';

// Remover o useTimeZone e usar o project diretamente

export const useTimeZone = (): ITimeZone => {
	const project = useProject();

	return project.timeZone;
};
