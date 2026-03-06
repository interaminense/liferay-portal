import React from 'react';
import {Outlet, Route, Routes, useParams} from 'react-router';
import {useModalNotifications} from 'shared/hooks/useModalNotifications';
import HelpWidget from './HelpWidget';
import {connect} from 'react-redux';
import {Routes as Path} from 'shared/util/router';
import BundleRouter from 'route-middleware/BundleRouter';
import Settings from 'settings/pages/Settings';
import AppSidebarRoutes from 'shared/pages/AppSidebarRoutes';

const connector = connect(null, {open, close});

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
