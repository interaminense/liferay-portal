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

package com.liferay.analytics.settings.web.internal.util;

import com.liferay.analytics.settings.web.internal.constants.AnalyticsSettingsWebKeys;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.PortalUtil;

import javax.portlet.PortletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @author Riccardo Ferrari
 */
public class WizardModeUtil {

	public static boolean isNextStep(HttpSession httpSession) {
		return GetterUtil.getBoolean(
			httpSession.getAttribute(_ANALYTICS_CONFIGURATION_NEXT_STEP));
	}

	public static boolean isWizardMode(HttpSession httpSession) {
		return GetterUtil.getBoolean(
			httpSession.getAttribute(
				AnalyticsSettingsWebKeys.ANALYTICS_CONFIGURATION_WIZARD_MODE));
	}

	public static void setNextStep(HttpSession httpSession, boolean nextStep) {
		httpSession.setAttribute(_ANALYTICS_CONFIGURATION_NEXT_STEP, nextStep);
	}

	public static void setNextStep(
		PortletRequest portletRequest, boolean nextStep) {

		HttpServletRequest httpServletRequest =
			PortalUtil.getHttpServletRequest(portletRequest);

		setNextStep(httpServletRequest.getSession(), nextStep);
	}

	public static void setWizardMode(
		HttpSession httpSession, boolean wizardMode) {

		httpSession.setAttribute(
			AnalyticsSettingsWebKeys.ANALYTICS_CONFIGURATION_WIZARD_MODE,
			wizardMode);
	}

	private static final String _ANALYTICS_CONFIGURATION_NEXT_STEP =
		"ANALYTICS_CONFIGURATION_NEXT_STEP";

}