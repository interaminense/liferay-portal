import {useUnsavedChangesPrompt} from 'shared/hooks/useUnsavedChangesPrompt';

interface Props {
	message?: string;
	when: boolean;
}

const NavigationWarning = ({message, when}: Props) => {
	useUnsavedChangesPrompt(when, message);

	return null;
};

export default NavigationWarning;
