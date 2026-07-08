import ClayForm from '@clayui/form';
import React from 'react';
import SalesforceSyncItems from 'settings/components/salesforce/SalesforceSyncItems';
import {Text} from '@clayui/core';
import {useWizardPage} from '../../base-page/WizardPageContext';
import {WizardPageButtonGroup} from 'settings/components/base-page/WizardPageButtonGroup';

interface ISyncSalesforceDataStepProps {
	onNext: () => void;
	onPrev: () => void;
}

const SyncSalesforceDataStep = ({
	onNext,
	onPrev,
}: ISyncSalesforceDataStepProps) => {
	const {dataSource} = useWizardPage();

	return (
		<ClayForm
			onSubmit={(event) => {
				event.preventDefault();

				if (!dataSource) {
					return;
				}

				onNext();
			}}
		>
			<div className="mb-2">
				<Text size={2} weight="semi-bold">
					{Liferay.Language.get('select-items-to-sync').toUpperCase()}
				</Text>
			</div>

			{dataSource && <SalesforceSyncItems />}

			<WizardPageButtonGroup
				nextButtonLabel={Liferay.Language.get('continue')}
				onCancel={onPrev}
				prevButtonLabel={Liferay.Language.get('previous')}
			/>
		</ClayForm>
	);
};

export {SyncSalesforceDataStep};
