import HelpWidget from './HelpWidget';
import {connect} from 'react-redux';
import {Outlet, useParams} from 'react-router';
import {useModalNotifications} from 'shared/hooks/useModalNotifications';

const connector = connect(null, {close, open});

const WorkspaceLayer = ({close, open}) => {
	const {groupId} = useParams();

	useModalNotifications(close, groupId, open);

	return (
		<>
			<Outlet />

			<HelpWidget />
		</>
	);
};

export default connector(WorkspaceLayer);
