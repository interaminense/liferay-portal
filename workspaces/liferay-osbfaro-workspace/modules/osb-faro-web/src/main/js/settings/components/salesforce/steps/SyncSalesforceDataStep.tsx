import ClayForm from '@clayui/form';
import React, {useRef, useState} from 'react';
import SalesforceSyncItems from 'settings/components/salesforce/SalesforceSyncItems';
import {Alert} from 'shared/types';
import {Text} from '@clayui/core';
import {updateSalesforceFieldSelection} from 'shared/api/data-source';
import {useParams} from 'react-router-dom';
import {useWizardPage} from '../../base-page/WizardPageContext';
import {WizardPageButtonGroup} from 'settings/components/base-page/WizardPageButtonGroup';

interface ISyncSalesforceDataStepProps {
	addAlert?: (alert: {alertType: string; message: string}) => void;
	onNext: () => void;
	onPrev: () => void;
}

const SyncSalesforceDataStep = ({
	addAlert,
	onNext,
	onPrev,
}: ISyncSalesforceDataStepProps) => {
	const {dataSource} = useWizardPage();
	const {groupId = ''} = useParams<{groupId: string}>();

	const [saving, setSaving] = useState(false);
	const fieldSelectionRef = useRef<Record<string, string[]>>({});

	return (
		<ClayForm
			onSubmit={async (event) => {
				event.preventDefault();

				if (!dataSource) {
					return;
				}

				try {
					setSaving(true);

					await updateSalesforceFieldSelection({
						fieldSelection: fieldSelectionRef.current,
						groupId,
						id: dataSource.id!,
					});
				}
				catch (error) {
					addAlert?.({
						alertType: Alert.Types.Error,
						message: Liferay.Language.get(
							'there-was-an-error-processing-your-request.-try-again.-if-the-problem-persists,-please-contact-support'
						),
					});

					setSaving(false);

					return;
				}

				setSaving(false);

				onNext();
			}}
		>
			<div className="mb-2">
				<Text size={2} weight="semi-bold">
					{Liferay.Language.get('select-items-to-sync').toUpperCase()}
				</Text>
			</div>

			{dataSource && (
				<SalesforceSyncItems
					dataSourceId={dataSource.id!}
					groupId={groupId}
					onFieldSelectionChange={(fieldSelection) => {
						fieldSelectionRef.current = fieldSelection;
					}}
				/>
			)}

			<WizardPageButtonGroup
				nextButtonLabel={Liferay.Language.get('continue')}
				nextButtonLoading={saving}
				onCancel={onPrev}
				prevButtonLabel={Liferay.Language.get('previous')}
			/>
		</ClayForm>
	);
};

export {SyncSalesforceDataStep};
