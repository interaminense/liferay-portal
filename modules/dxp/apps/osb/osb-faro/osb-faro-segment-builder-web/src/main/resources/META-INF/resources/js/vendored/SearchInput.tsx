/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import React from 'react';

/**
 * Minimal vendored replacement for osb-faro-web's `shared/components/
 * SearchInput`. The original wired into a Clay context stack and ref
 * forwarding the engine does not need; here we just render a flat
 * `<input>` with a clear/search icon button so the sidebar's search bar
 * preserves the same look without pulling the Input/Stack stack in.
 */

interface ISearchInputProps {
	className?: string;
	disabled?: boolean;
	onChange?: (value: string) => void;
	placeholder?: string;
	type?: string;
	value?: string;
}

const SearchInput: React.FC<ISearchInputProps> = ({
	className,
	disabled = false,
	onChange,
	placeholder = Liferay.Language.get('search'),
	type = 'text',
	value = '',
}) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			onChange(event.target.value);
		}
	};

	const handleClear = () => {
		if (onChange) {
			onChange('');
		}
	};

	return (
		<div className={`input-group ${className ?? ''}`}>
			<div className="input-group-item">
				<div className="input-group input-group-inset">
					<input
						className="form-control input-group-inset-after input-root"
						disabled={disabled}
						onChange={handleChange}
						placeholder={placeholder}
						type={type}
						value={value}
					/>

					<div className="input-group-inset-item input-group-inset-item-after">
						<ClayButton
							aria-label={
								value
									? Liferay.Language.get('clear')
									: Liferay.Language.get('search')
							}
							className="button-root"
							disabled={disabled}
							displayType="unstyled"
							onClick={value ? handleClear : undefined}
						>
							<ClayIcon
								className="icon-root"
								symbol={value ? 'times' : 'search'}
							/>
						</ClayButton>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchInput;
