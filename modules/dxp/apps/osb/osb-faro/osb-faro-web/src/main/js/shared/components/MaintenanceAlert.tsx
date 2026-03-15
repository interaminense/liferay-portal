import Alert, {AlertTypes} from 'shared/components/Alert';
import getCN from 'classnames';
import moment from 'moment';
import React, {useCallback} from 'react';
import {Project} from 'shared/util/records';

import {ProjectStates} from 'shared/util/constants';
import {setMaintenanceSeen as setMaintenanceSeenAction} from 'shared/actions/maintenance-seen';
import {sub} from 'shared/util/lang';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router';

interface IMaintenanceAlertProps {
	className?: string;
	stripe?: boolean;
}

const MaintenanceAlert: React.FC<IMaintenanceAlertProps> = ({
	className,
	stripe = false
}) => {
	const {groupId} = useParams<{groupId: string}>();
	const currentUser = useCurrentUser();
	const dispatch = useDispatch();

	const project = useSelector((state: any) =>
		state.getIn(['projects', groupId, 'data'], new Project())
	);

	const alertDismissed = useSelector((state: any) => {
		const prevStateStartDate = state.getIn([
			'maintenanceSeen',
			`${groupId}-${currentUser.id}`
		]);
		return prevStateStartDate === project.stateStartDate;
	});

	const handleDismissClick = useCallback(() => {
		dispatch(
			setMaintenanceSeenAction({
				currentUserId: currentUser.id,
				groupId,
				stateStartDate: project.stateStartDate
			})
		);
	}, [dispatch, currentUser.id, groupId, project.stateStartDate]);

	const {state, stateStartDate} = project;
	const showAlert = state === ProjectStates.Scheduled && !alertDismissed;

	if (!showAlert) {
		return <div className={getCN('maintenance-alert-root', className)} />;
	}

	return (
		<div className={getCN('maintenance-alert-root', className)}>
			<Alert
				iconSymbol='warning-full'
				onClose={handleDismissClick}
				stripe={stripe}
				title={Liferay.Language.get('scheduled-maintenance')}
				type={AlertTypes.Warning}
			>
				{sub(
					Liferay.Language.get(
						'a-system-wide-maintenance-has-been-scheduled-to-take-place-on-x-at-x'
					),
					[
						moment(stateStartDate).format('ll'),
						moment(stateStartDate).format('LT')
					]
				)}
			</Alert>
		</div>
	);
};

export default MaintenanceAlert;
