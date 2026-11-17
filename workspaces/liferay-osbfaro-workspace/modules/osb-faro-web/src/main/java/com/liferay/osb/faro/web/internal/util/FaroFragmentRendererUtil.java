/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.util;

import com.liferay.osb.faro.constants.FaroChannelConstants;
import com.liferay.osb.faro.engine.client.constants.LCPProjectConstants;
import com.liferay.osb.faro.provisioning.client.constants.FaroSubscriptionConstants;
import com.liferay.osb.faro.util.FaroPropsValues;
import com.liferay.osb.faro.web.internal.constants.FaroPaginationConstants;
import com.liferay.petra.reflect.ReflectionUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.servlet.taglib.util.OutputData;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.HtmlUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.taglib.aui.ScriptTag;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.jsp.JspException;

import java.io.IOException;
import java.io.Writer;

/**
 * @author Eudaldo Alonso
 */
public class FaroFragmentRendererUtil {

	public static String getStaticResourceURL(
		HttpServletRequest httpServletRequest, String uri) {

		return HtmlUtil.escapeAttribute(
			PortalUtil.getStaticResourceURL(httpServletRequest, uri));
	}

	public static void renderResources(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse)
		throws Exception {

		OutputData outputData = (OutputData)httpServletRequest.getAttribute(
			WebKeys.OUTPUT_DATA);

		if (outputData == null) {
			outputData = new OutputData();

			httpServletRequest.setAttribute(WebKeys.OUTPUT_DATA, outputData);
		}

		outputData.setDataSB(
			FaroFragmentRendererUtil.class.getName() + "#main.css",
			WebKeys.PAGE_TOP,
			new StringBundler(
				StringBundler.concat(
					"<link href=\"",
					getStaticResourceURL(
						httpServletRequest, "/o/osb-faro-web/dist/main.css"),
					"\" rel=\"stylesheet\" type=\"text/css\">")));

		renderScriptTag(
			httpServletRequest, httpServletResponse, "inline",
			"window.faroConstants = " + _getFaroConstants() + ";", null, null);
	}

	public static void renderScriptTag(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, String position,
			String script, String src, String type)
		throws JspException {

		ScriptTag scriptTag = new ScriptTag();

		scriptTag.setPosition(position);
		scriptTag.setSrc(src);
		scriptTag.setType(type);

		scriptTag.doBodyTag(
			httpServletRequest, httpServletResponse,
			pageContext -> {
				if (script == null) {
					return;
				}

				try {
					Writer writer = pageContext.getOut();

					writer.write(script);
				}
				catch (IOException ioException) {
					ReflectionUtil.throwException(ioException);
				}
			});
	}

	private static String _getFaroConstants() throws Exception {
		return JSONUtil.writeValueAsString(
			HashMapBuilder.<String, Object>put(
				"channelPermissionTypes",
				FaroChannelConstants.getPermissionTypes()
			).put(
				"faroURL", FaroPropsValues.FARO_URL
			).put(
				"pagination", FaroPaginationConstants.getConstants()
			).put(
				"projectLocations", LCPProjectConstants.getLocations()
			).put(
				"subscriptionPlans",
				FaroSubscriptionConstants.getFaroSubscriptionPlans()
			).build());
	}

}