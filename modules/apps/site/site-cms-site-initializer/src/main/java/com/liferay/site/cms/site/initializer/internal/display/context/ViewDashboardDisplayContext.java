/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.site.cms.site.initializer.internal.display.context;

import com.liferay.depot.service.DepotEntryLocalService;
import com.liferay.object.constants.ObjectFolderConstants;
import com.liferay.object.model.ObjectEntryFolder;
import com.liferay.object.service.ObjectDefinitionService;
import com.liferay.object.service.ObjectDefinitionSettingLocalService;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.language.Language;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.security.permission.resource.ModelResourcePermission;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.LayoutLocalServiceUtil;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.PortalUtil;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

/**
 * @author Adriano Interaminense
 */
public class ViewDashboardDisplayContext extends BaseSectionDisplayContext {

	public ViewDashboardDisplayContext(
		DepotEntryLocalService depotEntryLocalService,
		GroupLocalService groupLocalService,
		HttpServletRequest httpServletRequest, Language language,
		ObjectDefinitionService objectDefinitionService,
		ObjectDefinitionSettingLocalService objectDefinitionSettingLocalService,
		ModelResourcePermission<ObjectEntryFolder>
			objectEntryFolderModelResourcePermission,
		Portal portal, ThemeDisplay themeDisplay) {

		super(
			depotEntryLocalService, null, groupLocalService, httpServletRequest,
			language, objectDefinitionService,
			objectDefinitionSettingLocalService,
			objectEntryFolderModelResourcePermission, portal);

		_themeDisplay = themeDisplay;
	}

	public Map<String, Object> getConstants() {
		return HashMapBuilder.<String, Object>put(
			"ercContentStructures",
			ObjectFolderConstants.EXTERNAL_REFERENCE_CODE_CONTENT_STRUCTURES
		).put(
			"ercFileTypes",
			ObjectFolderConstants.EXTERNAL_REFERENCE_CODE_FILE_TYPES
		).build();
	}

	@Override
	public Map<String, Object> getEmptyState() {
		return HashMapBuilder.<String, Object>put(
			"description",
			LanguageUtil.get(
				httpServletRequest,
				"click-new-or-drag-and-drop-your-files-here")
		).put(
			"image", "/states/cms_empty_state.svg"
		).put(
			"title", LanguageUtil.get(httpServletRequest, "no-assets-yet")
		).build();
	}

	public Map<String, Object> getReactData() throws PortalException {
		return HashMapBuilder.<String, Object>put(
			"constants", getConstants()
		).put(
			"dashboard",
			PortalUtil.getLayoutFullURL(
				LayoutLocalServiceUtil.getLayoutByFriendlyURL(
					_themeDisplay.getScopeGroupId(), false, "/dashboard"),
				_themeDisplay)
		).build();
	}

	@Override
	protected String getCMSSectionFilterString() {
		return null;
	}

	private final ThemeDisplay _themeDisplay;

}