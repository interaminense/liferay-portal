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

import {TranslationManager} from 'data-engine-taglib';
import React, {useState} from 'react';
import {createPortal} from 'react-dom';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';

import {AppContextProvider} from '../../AppContext.es';
import useLazy from '../../hooks/useLazy.es';
import {PermissionsContextProvider} from './PermissionsContext.es';

export default function ({appTab, ...props}) {
	const defaultLanguageId = 'en_US';
	const PageComponent = useLazy();
	const [userLanguageId, setUserLanguageId] = useState(defaultLanguageId);
	props.userLanguageId = userLanguageId;

	const ListPage = (props) => (
		<PageComponent module={appTab.listEntryPoint} props={props} />
	);

	const ViewPage = (props) => (
		<PageComponent module={appTab.viewEntryPoint} props={props} />
	);

	return (
		<div className="app-builder-root">
			{createPortal(
				<TranslationManager
					buttonProps={{className: 'translation-manager-button'}}
					defaultLanguageId={defaultLanguageId}
					editingLanguageId={userLanguageId}
					onEditingLanguageIdChange={setUserLanguageId}
					showUserView
					translatedLanguageIds={{
						[defaultLanguageId]: defaultLanguageId,
					}}
				/>,
				document.querySelector('.entry-translation-manager')
			)}
			<AppContextProvider {...props}>
				<PermissionsContextProvider
					dataDefinitionId={props.dataDefinitionId}
				>
					<Router>
						<Switch>
							<Route component={ListPage} exact path="/" />
							<Route
								component={ViewPage}
								path="/entries/:entryIndex(\d+)"
							/>
						</Switch>
					</Router>
				</PermissionsContextProvider>
			</AppContextProvider>
		</div>
	);
}
