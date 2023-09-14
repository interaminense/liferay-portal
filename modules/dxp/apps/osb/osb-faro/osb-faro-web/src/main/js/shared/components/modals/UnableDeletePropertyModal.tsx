import ClayButton from '@clayui/button';
import ClayModal, {useModal} from '@clayui/modal';
import React from 'react';
import {spritemap} from 'shared/util/constants';

const UnableDeletePropertyModal = () => {
	const {observer, onOpenChange, open} = useModal();

	return (
		//if property >== 1 &&
		<>
			{open && (
				<ClayModal
					observer={observer}
					size='lg'
					spritemap={spritemap}
					status='info'
				>
					<ClayModal.Header>
						{'Unable to Delete Property'}
					</ClayModal.Header>
					<ClayModal.Body>
						<p>
							{
								'In order to delete a property ensure no sites and channels are assigned to it. To disconnect them from a property, navigate to Liferay DXP > Instance Settings > Analytics Cloud > Properties and select the properties whose synchronizations you wish to undo. Access our documentation to learn more. '
							}
						</p>
					</ClayModal.Body>
					<ClayModal.Footer
						last={
							<ClayButton.Group spaced>
								<ClayButton onClick={() => onOpenChange(false)}>
									{'Done'}
								</ClayButton>
							</ClayButton.Group>
						}
					/>
				</ClayModal>
			)}
		</>
	);
};

export default UnableDeletePropertyModal;
