/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import React from 'react';
interface IStateRendererProps extends React.HTMLAttributes<HTMLElement> {
	empty: boolean;
	error: boolean;
	loading: boolean;
}
declare const StateRenderer: React.FC<IStateRendererProps> & {
	Empty: typeof EmptyState;
	Error: typeof ErrorState;
	Success: typeof SuccessState;
};
declare const EmptyState: React.FC<React.HTMLAttributes<HTMLElement>>;
interface IErrorStateProps extends React.HTMLAttributes<HTMLElement> {
	disabled?: boolean;
	onClickRefetch?: () => void;
}
declare const ErrorState: React.FC<IErrorStateProps>;
declare const SuccessState: React.FC<React.HTMLAttributes<HTMLElement>>;
export default StateRenderer;
