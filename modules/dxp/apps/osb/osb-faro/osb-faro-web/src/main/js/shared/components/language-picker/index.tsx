import React from 'react';
import {LanguagePicker as ClayLanguagePicker} from '@clayui/core';

import {getFlagSymbol} from 'shared/util/locale';

type Language = {id: string; label: string};

interface ILanguagePickerProps {
	languages: Language[];
	onSelect: (id: string) => void;
	selectedLanguageId: string;
}

const LanguagePicker: React.FC<ILanguagePickerProps> = ({
	languages,
	onSelect,
	selectedLanguageId
}) => {
	const locales = languages.map(({id, label}) => ({
		id,
		label,
		symbol: getFlagSymbol(id) ?? ''
	}));

	const handleSelectedLocaleChange = (key: React.Key) => {
		const id = String(key);

		if (id !== selectedLanguageId) {
			onSelect(id);
		}
	};

	return (
		<ClayLanguagePicker
			locales={locales}
			onSelectedLocaleChange={handleSelectedLocaleChange}
			selectedLocaleId={selectedLanguageId}
		/>
	);
};

export default LanguagePicker;
