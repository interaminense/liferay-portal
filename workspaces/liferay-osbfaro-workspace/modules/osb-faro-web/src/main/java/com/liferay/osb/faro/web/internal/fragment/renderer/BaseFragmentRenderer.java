/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.web.internal.fragment.renderer;

import com.liferay.fragment.renderer.FragmentRenderer;
import com.liferay.fragment.renderer.FragmentRendererContext;
import com.liferay.frontend.taglib.react.servlet.taglib.ComponentTag;
import com.liferay.osb.faro.model.FaroChannel;
import com.liferay.osb.faro.web.internal.display.context.ChannelSelectorDisplayContext;
import com.liferay.osb.faro.web.internal.util.FaroFragmentRendererUtil;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.taglib.servlet.PageContextFactoryUtil;

import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

import org.osgi.service.component.annotations.Reference;

/**
 * @author Eudaldo Alonso
 */
public abstract class BaseFragmentRenderer implements FragmentRenderer {

	@Override
	public void render(
		FragmentRendererContext fragmentRendererContext,
		HttpServletRequest httpServletRequest,
		HttpServletResponse httpServletResponse) {

		try {
			FaroFragmentRendererUtil.renderResources(
				httpServletRequest, httpServletResponse);

			ComponentTag componentTag = new ComponentTag();

			componentTag.setModule(getModule());
			componentTag.setPageContext(
				PageContextFactoryUtil.create(
					httpServletRequest, httpServletResponse));
			componentTag.setProps(getProps(httpServletRequest));
			componentTag.setServletContext(servletContext);

			componentTag.doStartTag();

			componentTag.doEndTag();
		}
		catch (Exception exception) {
			_log.error(exception);

			throw new RuntimeException(exception);
		}
	}

	protected abstract String getModule();

	protected Map<String, Object> getProps(
		HttpServletRequest httpServletRequest) {

		return HashMapBuilder.<String, Object>put(
			"channelId",
			() -> {
				ChannelSelectorDisplayContext
					channelSelectorDisplayContext =
						new ChannelSelectorDisplayContext(
							httpServletRequest);

				FaroChannel faroChannel =
					channelSelectorDisplayContext.getFaroChannel();

				if (faroChannel == null) {
					return StringPool.BLANK;
				}

				return faroChannel.getChannelId();
			}
		).put(
			"groupId",
			() -> {
				ThemeDisplay themeDisplay =
					(ThemeDisplay)httpServletRequest.getAttribute(
						WebKeys.THEME_DISPLAY);

				return String.valueOf(themeDisplay.getScopeGroupId());
			}
		).build();
	}

	@Reference(target = "(osgi.web.symbolicname=com.liferay.osb.faro.web)")
	protected ServletContext servletContext;

	private static final Log _log = LogFactoryUtil.getLog(
		BaseFragmentRenderer.class);

}