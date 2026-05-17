/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayDropDown, {Align} from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import React from 'react';

/**
 * Vendored from osb-faro-web's `shared/components/RowActions`. The
 * `ClayLink`-based quick-action variant was dropped because the engine
 * only invokes RowActions with menu-style `actions` (duplicate, delete).
 * If a future consumer needs href-based quick actions, re-add the
 * ClayLink branch and add `@clayui/link` to the module's peerDeps.
 */

interface IRowActionsProps {
	actions?: (React.HTMLAttributes<HTMLElement> & {
		className?: string;
		iconSymbol?: string;
		label: string;
		onClick?: any;
	})[];
}

const RowActions: React.FC<IRowActionsProps> = ({actions = []}) => {
	if (!actions?.length) {
		return null;
	}

	return (
		<ClayDropDown
			alignmentPosition={Align.BottomRight}
			className="dropdown-action"
			closeOnClick
			trigger={
				<ClayButton
					aria-label={Liferay.Language.get('menu')}
					className="component-action"
					displayType="unstyled"
				>
					<ClayIcon symbol="ellipsis-v" />
				</ClayButton>
			}
		>
			{actions.map(({className, iconSymbol, label, ...props}) => (
				<ClayDropDown.Item className={className} key={label} {...props}>
					{iconSymbol && (
						<ClayIcon
							className="icon-root mr-2"
							symbol={iconSymbol}
						/>
					)}

					{label}
				</ClayDropDown.Item>
			))}
		</ClayDropDown>
	);
};

export default RowActions;
