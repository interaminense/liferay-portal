// @ts-nocheck

import * as API from 'shared/api';
import * as breadcrumbs from 'shared/util/breadcrumbs';
import BasePage from 'settings/components/BasePage';
import DataTransformation, {
	processFieldMappings
} from 'settings/components/DataTransformation';
import getCN from 'classnames';
import React, {useEffect, useState} from 'react';
import Sheet from 'shared/components/Sheet';
import TextTruncate from 'shared/components/TextTruncate';
import {addAlert} from 'shared/actions/alerts';
import {Alert} from 'shared/types';
import {compose, withAdminPermission} from 'shared/hoc';
import {connect} from 'react-redux';
import {Routes, toRoute} from 'shared/util/router';
import {sub} from 'shared/util/lang';
import {UNAUTHORIZED_ACCESS} from 'shared/util/request';

const ConfigureCSV = ({
	addAlert,
	className,
	dataSource,
	fileVersionId,
	groupId,
	history,
	id,
	name: initialName
}) => {
	const [name, setName] = useState(initialName);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		setName(dataSource?.name || initialName);
	}, [name, dataSource?.name]);

	const handleCreateCSVSource = fieldMappings => {
		setSubmitting(true);

		const identifier = fileVersionId ? {fileVersionId} : {id};

		const data = {
			fieldMappingMaps: processFieldMappings(fieldMappings),
			groupId,
			name,
			...identifier
		};

		const request = id
			? API.dataSource.updateCSV
			: API.dataSource.createCSV;

		request(data)
			.then(response => {
				if (!id) {
					analytics.track('Created CSV Datasource');
				}

				history.push(
					toRoute(Routes.SETTINGS_DATA_SOURCE, {
						groupId,
						id: response.id
					})
				);
			})
			.catch(err => {
				addAlert({
					alertType: Alert.Types.Error,
					message:
						err.message === UNAUTHORIZED_ACCESS
							? Liferay.Language.get('unauthorized-access')
							: Liferay.Language.get('error')
				});

				setSubmitting(false);
			});
	};

	const breadcrumbItems = id
		? [
				breadcrumbs.getEntityName({
					active: false,
					href: toRoute(Routes.SETTINGS_DATA_SOURCE, {
						groupId,
						id
					}),
					label: name
				})
		  ]
		: [];

	return (
		<BasePage
			breadcrumbItems={[
				breadcrumbs.getDataSources({groupId}),
				...breadcrumbItems,
				{
					active: true,
					label: Liferay.Language.get('configure-csv')
				}
			]}
			className={getCN('csv-root', className)}
			documentTitle={name || Liferay.Language.get('csv-data-source')}
			groupId={groupId}
		>
			<Sheet className='wizard'>
				<DataTransformation
					cancelHref={
						id
							? toRoute(Routes.SETTINGS_DATA_SOURCE, {
									groupId,
									id
							  })
							: ''
					}
					fileVersionId={fileVersionId}
					groupId={groupId}
					id={id}
					key='DATA_TRANSFORMATION'
					name={name}
					navigationWarning
					onSubmit={handleCreateCSVSource}
					sourceFieldPlaceholder={Liferay.Language.get(
						'select-field-from-csv-file'
					)}
					sourceTitle={Liferay.Language.get('csv-data-model')}
					submitting={submitting}
					title={sub(
						Liferay.Language.get('map-x-csv-data'),
						[
							<TextTruncate
								inline
								key='NAME'
								maxCharLength={50}
								title={name}
							/>
						],
						false
					)}
				/>
			</Sheet>
		</BasePage>
	);
};

export {ConfigureCSV as ConfigureCSVTesting};

export default compose(
	withAdminPermission,
	connect(null, {addAlert})
)(ConfigureCSV);
