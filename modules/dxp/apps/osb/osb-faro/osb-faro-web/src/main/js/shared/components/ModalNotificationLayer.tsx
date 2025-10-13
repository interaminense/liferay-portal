import {close, open} from 'shared/actions/modals';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {matchPath} from 'react-router';
import {RootState} from 'shared/store';
import {Routes} from 'shared/util/router';
import {useModalNotifications} from 'shared/hooks/useModalNotifications';
import {withHelpWidget} from 'shared/hoc';

const connector = connect(
	(store: RootState, {location: {pathname}}: {location: Location}) => {
		const path = matchPath<any>(pathname, {
			path: Routes.WORKSPACE_WITH_ID
		});

		const groupId = path?.params?.groupId ?? '0';

		return {
			groupId
		};
	},
	{close, open}
);

const ModalNotificationLayer = ({close, groupId, open}) => {
	useModalNotifications(close, groupId, open);

	return null;
};

export default compose<any>(connector, withHelpWidget)(ModalNotificationLayer);
