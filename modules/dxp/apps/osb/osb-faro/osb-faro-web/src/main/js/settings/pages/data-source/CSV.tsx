// @ts-nocheck

import * as API from 'shared/api';
import * as breadcrumbs from 'shared/util/breadcrumbs';
import BasePage from 'settings/components/BasePage';
import ClayButton from '@clayui/button';
import ClayLink from '@clayui/link';
import DataTransformationList from 'settings/components/data-transformation-list';
import DefinitionItem from 'shared/components/DefinitionItem';
import getCN from 'classnames';
import Loading from 'shared/components/Loading';
import React, {useEffect, useRef, useState} from 'react';
import Sheet from 'shared/components/Sheet';
import {FieldContexts} from 'shared/util/constants';
import {List, Map} from 'immutable';
import {Modal} from 'shared/types/Modal';
import {Routes, toRoute} from 'shared/util/router';
import {sequence} from 'shared/util/promise';
import {
	toPromise,
	validateMaxLength,
	validateRequired
} from 'shared/components/form';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {useModal} from 'shared/hooks/useModal';
import {useParams} from 'react-router-dom';
import {validateUniqueName} from 'shared/util/data-sources';

const CSV = ({className, dataSource, id}) => {
	const {close, open} = useModal();
	const currentUser = useCurrentUser();
	const {groupId} = useParams();
	const [fieldsIList, setFieldsIList] = useState(new List());
	const [fileName, setFileName] = useState('');
	const [loading, setLoading] = useState(true);
	const [mappingSuggestions, setMappingSuggestions] = useState({});
	const [name, setName] = useState('');
	const [sourceFields, setSourceFields] = useState({});

	const _cachedNameValues = useRef(new Map());

	useEffect(() => {
		setFileName(dataSource?.fileName);
	}, [dataSource?.fileName]);

	useEffect(() => {
		setName(dataSource?.name);
	}, [dataSource?.name]);

	useEffect(() => {
		const fetchMappings = async () => {
			setLoading(true);

			const mappings = await API.dataSource.fetchMappingsLite({
				context: FieldContexts.Demographics,
				groupId,
				id
			} as any);

			const mappingSuggestions = {};
			const sourceFields = {};

			for (const {name, suggestions, values} of mappings) {
				mappingSuggestions[name] = suggestions;
				sourceFields[name] = values[0];
			}

			setFieldsIList(processMappings(mappings));
			setLoading(false);
			setMappingSuggestions(mappingSuggestions);
			setSourceFields(sourceFields);
		};

		fetchMappings();
	}, []);

	const processMappings = mappings => {
		if (id && mappings.find(({mapping}) => mapping)) {
			mappings = mappings.filter(({mapping}) => mapping);
		}

		return new List(
			mappings.map(({mapping, name, suggestions, values}) => {
				const suggestion = id ? mapping : suggestions[0];

				return new Map({
					source: new Map({
						name,
						value: values[0]
					}),
					suggestion: new Map({
						name: suggestion && suggestion.name,
						value: suggestion && suggestion.values[0]
					})
				});
			})
		);
	};

	const handleValidate = value => {
		let error: string | Promise<string> = '';

		if (_cachedNameValues.current.has(value)) {
			error = _cachedNameValues.current.get(value);
		} else {
			error = validateUniqueName({groupId, value});

			_cachedNameValues.current.set(value, error);
		}

		return toPromise(error);
	};

	const handleCSVPreviewModal = () => {
		open(Modal.modalTypes.CSV_PREVIEW_MODAL, {
			groupId,
			id,
			name,
			onClose: close
		});
	};

	const handleUpdateName = async name => {
		await API.dataSource.updateCSV({
			groupId,
			id,
			name
		});

		setName(name);
	};

	const authorized = currentUser.isAdmin();

	return (
		<BasePage
			breadcrumbItems={[
				breadcrumbs.getDataSources({groupId}),
				breadcrumbs.getEntityName({
					label: name
				})
			]}
			className={getCN('csv-data-source-root', className)}
			documentTitle={name || Liferay.Language.get('csv-file')}
			groupId={groupId}
		>
			<Sheet>
				<Sheet.Header className='header-content'>
					<div className='page-title-group'>
						<h3 className='w-50'>
							<DefinitionItem
								editable={authorized}
								onSubmit={handleUpdateName}
								validate={sequence([
									validateRequired,
									validateMaxLength(255),
									handleValidate
								])}
								value={name}
							/>
						</h3>

						{authorized && (
							<div className='button-row'>
								<ClayLink
									button
									className='button-root'
									displayType='primary'
									href={toRoute(
										Routes.SETTINGS_DATA_SOURCE_EDIT,
										{
											groupId,
											id
										}
									)}
								>
									{Liferay.Language.get('edit-csv')}
								</ClayLink>

								<ClayLink
									button
									className='button-root'
									displayType='primary'
									href={toRoute(
										Routes.SETTINGS_DATA_SOURCE_DELETE,
										{
											groupId,
											id
										}
									)}
								>
									{Liferay.Language.get('delete-data-source')}
								</ClayLink>
							</div>
						)}
					</div>

					<div className='file-info'>
						<DefinitionItem value={fileName} />

						<ClayButton
							className='button-root toggle-preview'
							displayType='secondary'
							onClick={handleCSVPreviewModal}
							size='sm'
						>
							{Liferay.Language.get('view-file-preview')}
						</ClayButton>
					</div>
				</Sheet.Header>

				<Sheet.Body>
					<h3 className='mappings-header'>
						{Liferay.Language.get('current-mappings')}
					</h3>
				</Sheet.Body>

				{loading ? (
					<Loading />
				) : (
					<DataTransformationList
						fieldsIList={fieldsIList}
						groupId={groupId}
						id={id}
						mappingSuggestions={mappingSuggestions}
						name={name}
						readOnly
						sourceFields={sourceFields}
						sourceTitle={Liferay.Language.get('csv-field')}
						suggestionsTitle={Liferay.Language.get(
							'analytics-cloud-field'
						)}
					/>
				)}
			</Sheet>
		</BasePage>
	);
};

export default CSV;
