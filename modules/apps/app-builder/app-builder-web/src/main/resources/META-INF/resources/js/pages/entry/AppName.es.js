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

import React, {useState} from 'react';
import {createPortal} from 'react-dom';

import {getLocalizedUserPreferenceValue} from '../../utils/lang.es';

export default ({showAppName, }) => {
    const [{app}] = useState({app: {name: {}}});
    const appStandaloneName = document.querySelector('#appStandaloneName');

    return (
        <div>
            {showAppName && appStandaloneName && (
                createPortal(
                    getLocalizedUserPreferenceValue(
                        app.name,
						userLanguageId,
						defaultLanguageId
                    ),
                    appStandaloneName
                )
            )}
        </div>
    );
}