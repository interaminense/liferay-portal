/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import getCN from 'classnames';
import React from 'react';

interface ErrorIProps {
	apolloError?: Error | null;
	children: React.ReactNode;
}

const ErrorState: React.FC<ErrorIProps> = ({children}) => <>{children}</>;

interface LoadingIProps {
	center?: boolean;
}

const LoadingState: React.FC<LoadingIProps> = ({center = true}) => (
	<div
		className={getCN({
			'd-flex justify-content-center py-3': center,
		})}
	>
		<span
			aria-label="Loading"
			className="loading-animation loading-animation-sm"
		/>
	</div>
);

interface SuccessIProps {
	children: React.ReactNode;
}

const SuccessState: React.FC<SuccessIProps> = ({children}) => <>{children}</>;

interface StatesRendererIProps {
	children: React.ReactNode;
	error: boolean;
	loading: boolean;
}

const StatesRenderer: React.FC<StatesRendererIProps> & {
	Error: typeof ErrorState;
	Loading: typeof LoadingState;
	Success: typeof SuccessState;
} = ({children, error, loading}) => {
	let picked: React.ReactNode = null;

	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child)) {
			return;
		}

		if (loading && child.type === LoadingState) {
			picked = child;
		}
		else if (!loading && error && child.type === ErrorState) {
			picked = child;
		}
		else if (!loading && !error && child.type === SuccessState) {
			picked = child;
		}
	});

	return <>{picked}</>;
};

StatesRenderer.Error = ErrorState;
StatesRenderer.Loading = LoadingState;
StatesRenderer.Success = SuccessState;

export default StatesRenderer;
