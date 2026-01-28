import React from 'react';
import {useLocation, useNavigate, useParams} from 'react-router';

function withRouter(Component) {
	return function ComponentWithRouterProp(props) {
		const navigate = useNavigate();
		const location = useLocation();
		const params = useParams();

		return (
			<Component
				{...props}
				location={location}
				navigate={navigate}
				params={params}
			/>
		);
	};
}

export default withRouter;
