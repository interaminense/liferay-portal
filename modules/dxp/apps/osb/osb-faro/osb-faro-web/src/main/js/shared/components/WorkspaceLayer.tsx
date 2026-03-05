import React from 'react';
import {Outlet, useParams} from 'react-router';
import {useModalNotifications} from 'shared/hooks/useModalNotifications';
import HelpWidget from './HelpWidget';
import {connect} from 'react-redux';

const connector = connect(null, {open, close});

const WorkspaceLayer = ({close, open}) => {
	const {groupId} = useParams();

	useModalNotifications(close, groupId, open);

	return (
		<>
			<HelpWidget />

			<Outlet />
		</>
	);
};

export default connector(WorkspaceLayer);
