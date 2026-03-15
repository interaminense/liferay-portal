import getCN from 'classnames';
import React from 'react';
import TextTruncate from 'shared/components/TextTruncate';
import {Column} from '../Row';
import {Link} from 'react-router';
import {noop} from 'lodash';

const Name: Column['cellRenderer'] = ({
	className,
	data,
	disabled = false,
	maxWidth,
	nameKey = 'name',
	renderIcon,
	renderSecondaryInfo,
	routeFn = noop,
	tooltip = false
}) => {
	const getSecondaryInfo = () =>
		!!renderSecondaryInfo && (
			<div className='secondary-info text-truncate'>
				{renderSecondaryInfo(data) || '-'}
			</div>
		);

	const displayName = data[nameKey] || '-';

	const url = routeFn({data});

	const titleContent = tooltip ? (
		<TextTruncate title={displayName} />
	) : (
		displayName
	);

	return (
		<td className={getCN('name-cell-root', className)}>
			<div
				className='content-container'
				style={maxWidth && {maxWidth: `${maxWidth}px`}}
			>
				{!!renderIcon && (
					<div className='icon-container'>{renderIcon(data)}</div>
				)}

				<div className='text-truncate'>
					<div className='table-title text-truncate'>
						{disabled || !url ? (
							titleContent
						) : (
							<Link className='text-truncate' to={url}>
								{titleContent}
							</Link>
						)}
					</div>

					{getSecondaryInfo()}
				</div>
			</div>
		</td>
	);
};

export default Name;
