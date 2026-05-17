/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.segment.builder.poc.web.internal.portlet;

import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;

import jakarta.portlet.Portlet;

import org.osgi.service.component.annotations.Component;

/**
 * @author Adriano Interaminense
 */
@Component(
	property = {
		"com.liferay.portlet.display-category=category.sample",
		"jakarta.portlet.display-name=Segment Builder PoC (JSON)",
		"jakarta.portlet.init-param.template-path=/META-INF/resources/",
		"jakarta.portlet.init-param.view-template=/view-json.jsp",
		"jakarta.portlet.name=com_liferay_osb_faro_segment_builder_poc_web_PocBuilderJsonPortlet",
		"jakarta.portlet.security-role-ref=power-user,user",
		"jakarta.portlet.version=4.0"
	},
	service = Portlet.class
)
public class PocBuilderJsonPortlet extends MVCPortlet {
}
