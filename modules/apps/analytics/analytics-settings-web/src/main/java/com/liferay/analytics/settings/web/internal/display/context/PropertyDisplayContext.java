package com.liferay.analytics.settings.web.internal.display.context;

import com.liferay.analytics.settings.configuration.AnalyticsConfiguration;
import com.liferay.analytics.settings.web.internal.model.Channel;
import com.liferay.analytics.settings.web.internal.search.ChannelSearch;
import com.liferay.analytics.settings.web.internal.util.AnalyticsSettingsUtil;
import com.liferay.frontend.data.set.model.FDSActionDropdownItem;
import com.liferay.frontend.taglib.clay.servlet.taglib.util.CreationMenu;
import com.liferay.petra.portlet.url.builder.PortletURLBuilder;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.theme.PortletDisplay;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.HtmlUtil;
import com.liferay.portal.kernel.util.JavaConstants;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.WebKeys;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.util.EntityUtils;

import javax.portlet.PortletRequest;
import javax.portlet.PortletResponse;
import javax.portlet.PortletURL;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class PropertyDisplayContext extends BaseDisplayContext {

	public PropertyDisplayContext(
		AnalyticsConfiguration analyticsConfiguration,
		HttpServletRequest httpServletRequest,
		HttpServletResponse httpServletResponse) {
		super(analyticsConfiguration, httpServletRequest, httpServletResponse);
	}

	public String getAPIURL() {
		return "/o/object-admin/v1.0/object-definitions";
	}

	public CreationMenu getCreationMenu() throws Exception {
		CreationMenu creationMenu = new CreationMenu();

		return creationMenu;
	}

	public List<FDSActionDropdownItem> getFDSActionDropdownItems()
		throws Exception {

		return Arrays.asList(
			new FDSActionDropdownItem(
				PortletURLBuilder.create(
					getPortletURL()
				).setMVCRenderCommandName(
					"/edit_property"
				).setParameter(
					"objectDefinitionId", "1"
				).buildString(),
				"view", "view",
				LanguageUtil.get(httpServletRequest, "view"),
				"get", null, null)
		);
	}

	public Map<String, String> getContextParams()
		throws PortalException {
		return Collections.EMPTY_MAP;
	}

	public ChannelSearch getChannelSearch() {
		ThemeDisplay themeDisplay =
			(ThemeDisplay)httpServletRequest.getAttribute(
				WebKeys.THEME_DISPLAY);

		if (!AnalyticsSettingsUtil.isAnalyticsEnabled(
			themeDisplay.getCompanyId())) {

			return null;
		}

		try {
			ChannelSearch channelSearch = new ChannelSearch(
				_getPortletRequest(), getPortletURL());

			HttpResponse httpResponse = AnalyticsSettingsUtil.doGet(
				themeDisplay.getCompanyId(),
				String.format(
					"api/1.0/channels?filter=%s&page=%d&size=%d",
					_getKeywords(), channelSearch.getCur() - 1,
					channelSearch.getDelta()));

			StatusLine statusLine = httpResponse.getStatusLine();

			if (statusLine.getStatusCode() != HttpStatus.SC_OK) {
				HttpEntity httpEntity = httpResponse.getEntity();

				throw new PortalException(
					"Request to Analytics Cloud failed: " +
					StringUtil.read(httpEntity.getContent()));
			}

			JSONObject responseJSONObject = JSONFactoryUtil.createJSONObject(
				EntityUtils.toString(httpResponse.getEntity()));

			JSONObject embeddedJSONObject = responseJSONObject.getJSONObject(
				"_embedded");

			JSONArray channelsJSONArray = embeddedJSONObject.getJSONArray(
				"channels");

			List<Channel> channels = new ArrayList<>();

			for (int i = 0; i < channelsJSONArray.length(); i++) {
				JSONObject channelJSONObject = channelsJSONArray.getJSONObject(
					i);

				channels.add(
					new Channel(
						channelJSONObject.getLong("id"),
						channelJSONObject.getString("name")));
			}

			JSONObject pageJSONObject = responseJSONObject.getJSONObject(
				"page");

			channelSearch.setResultsAndTotal(
				() -> channels, pageJSONObject.getInt("totalElements"));

			return channelSearch;
		}
		catch (Exception exception) {
			_log.error("Unable to get channel search", exception);

			return null;
		}
	}

	public PortletURL getPortletURL() {
		return PortletURLBuilder.createRenderURL(
			PortalUtil.getLiferayPortletResponse(_getPortletResponse())
		).setMVCRenderCommandName(
			"/configuration_admin/view_configuration_screen"
		).setParameter(
			"configurationScreenKey", "1-synced-sites"
		).buildPortletURL();
	}

	private String _getKeywords() {
		String keywords = ParamUtil.getString(_getPortletRequest(), "keywords");

		return HtmlUtil.escapeURL(keywords);
	}

	private PortletRequest _getPortletRequest() {
		return (PortletRequest)httpServletRequest.getAttribute(
			JavaConstants.JAVAX_PORTLET_REQUEST);
	}

	private PortletResponse _getPortletResponse() {
		return (PortletResponse)httpServletRequest.getAttribute(
			JavaConstants.JAVAX_PORTLET_RESPONSE);
	}

	private static final Log _log = LogFactoryUtil.getLog(
		PropertyDisplayContext.class);
}
