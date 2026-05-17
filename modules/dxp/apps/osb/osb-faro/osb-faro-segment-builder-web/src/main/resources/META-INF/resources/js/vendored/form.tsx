/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import getCN from 'classnames';
import React from 'react';

/**
 * Minimal vendored slice of osb-faro-web's `shared/components/form`
 * namespace. The engine's `CriteriaRow.renderOperator` only uses
 * `Form.GroupItem`, so this file ships just that as a default-export
 * namespace `{GroupItem}` — same import shape consumers had before.
 */

interface IFormGroupItemProps extends React.HTMLAttributes<HTMLDivElement> {
	label?: boolean;
	labelSpacer?: boolean;
	shrink?: boolean;
}

const FormGroupItem: React.FC<IFormGroupItemProps> = ({
	children,
	className,
	label = false,
	labelSpacer = false,
	shrink = false,
}) => {
	const classes = getCN('form-group-item', className, {
		'form-group-item-label': label,
		'form-group-item-label-spacer': labelSpacer,
		'form-group-item-shrink': shrink,
	});

	return <div className={classes}>{children}</div>;
};

const Form = {
	GroupItem: FormGroupItem,
};

export default Form;
