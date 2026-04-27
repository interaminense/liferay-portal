import React from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';

type AnyComponent = React.ComponentType<any>;

const navigateAsHistory = (navigate: ReturnType<typeof useNavigate>) => ({
	go: (n: number) => navigate(n),
	goBack: () => navigate(-1),
	push: (path: any, state?: any) =>
		navigate(path, state ? {state} : undefined),
	replace: (path: any, state?: any) => navigate(path, {replace: true, state})
});

const withRouter = (WrappedComponent: AnyComponent) => {
	const WithRouter = (props: Record<string, unknown>) => {
		const navigate = useNavigate();
		const location = useLocation();
		const params = useParams();

		return (
			<WrappedComponent
				history={navigateAsHistory(navigate)}
				location={location}
				match={{params}}
				{...props}
			/>
		);
	};

	WithRouter.displayName = `withRouter(${
		WrappedComponent.displayName || WrappedComponent.name || 'Component'
	})`;

	return WithRouter;
};

export default withRouter;
