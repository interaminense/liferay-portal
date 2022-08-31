<%@ page
	import="com.liferay.analytics.settings.web.internal.display.context.PropertyDisplayContext" %><%--
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
--%>

<%@ include file="/LRAC-10757/init.jsp" %>

<%
PropertyDisplayContext propertyDisplayContext = (PropertyDisplayContext) request.getAttribute(AnalyticsSettingsWebKeys.ANALYTICS_DISPLAY_CONTEXT);

ChannelSearch channelSearch = propertyDisplayContext.getChannelSearch();

String keywords = ParamUtil.getString(request, "keywords");
%>

<div class="wizard-mode">
	<portlet:actionURL name="/analytics_settings/edit_workspace_connection" var="editWorkspaceConnectionURL" />

	<ol class="multi-step-indicator-label-top multi-step-nav multi-step-nav-collapse-sm sheet-lg">
		<li class="complete multi-step-item multi-step-item-expand">
			<div class="multi-step-divider"></div>

			<div class="multi-step-indicator">
				<div class="multi-step-indicator-label">
					<liferay-ui:message key="connect" />
				</div>

				<a class="multi-step-icon" data-multi-step-icon="1" href="#1"></a>
			</div>
		</li>
		<li class="active multi-step-item multi-step-item-expand">
			<div class="multi-step-divider"></div>

			<div class="multi-step-indicator">
				<div class="multi-step-indicator-label">
					<liferay-ui:message key="property" />
				</div>

				<a class="multi-step-icon" data-multi-step-icon="2" href="#1"></a>
			</div>
		</li>
		<li class="multi-step-item multi-step-item-expand">
			<div class="multi-step-divider"></div>

			<div class="multi-step-indicator">
				<div class="multi-step-indicator-label">
					<liferay-ui:message key="people" />
				</div>

				<a class="multi-step-icon" data-multi-step-icon="3" href="#1"></a>
			</div>
		</li>
		<li class="multi-step-item">
			<div class="multi-step-divider"></div>

			<div class="multi-step-indicator">
				<div class="multi-step-indicator-label">
					<liferay-ui:message key="people-data" />
				</div>

				<a class="multi-step-icon" data-multi-step-icon="4" href="#1"></a>
			</div>
		</li>
	</ol>

	<clay:sheet>
		<h2 class="m-0">
			<liferay-ui:message key="property-assignment" />
		</h2>

		<c:choose>
			<c:when test="<%= !propertyDisplayContext.isConnected() %>">
				<liferay-ui:message key="your-dxp-instance-is-not-connected-to-analytics-cloud" />
			</c:when>
			<c:when test="<%= channelSearch == null %>">
				<div class="mt-4">
					<liferay-ui:message key="unable-to-retrieve-the-properties-from-analytics-cloud" />

					<div class="mt-4">
						<liferay-portlet:renderURL varImpl="selectSitesURL">
							<portlet:param name="mvcRenderCommandName" value="/configuration_admin/view_configuration_screen" />
							<portlet:param name="configurationScreenKey" value="1-synced-sites" />
						</liferay-portlet:renderURL>

						<a class="btn btn-primary" href="<%= selectSitesURL.toString() %>">
							<span class="lfr-btn-label"><liferay-ui:message key="retry" /></span>
						</a>
					</div>
				</div>
			</c:when>
			<c:when test="<%= (channelSearch != null) && (channelSearch.getTotal() == 0) && Validator.isBlank(keywords) %>">
				<div class="mb-5 mt-5">
					<div class="empty-state-icon mb-4 mt-4"></div>

					<div class="text-center">
						<h2>
							<liferay-ui:message key="no-properties-found" />
						</h2>

						<p class="text-secondary">
							<liferay-ui:message key="create-a-new-property-to-get-started" />
						</p>

						<aui:button-row>
							<portlet:renderURL var="addNewChannelURL">
								<portlet:param name="mvcRenderCommandName" value="/analytics_settings/add_channel" />
								<portlet:param name="redirect" value="<%= currentURL %>" />
							</portlet:renderURL>

							<aui:button href="" useDialog="<%= true %>" onClick='<%= liferayPortletResponse.getNamespace() + "addProperty(this);" %>' primary="<%= true %>" value="new-property" />
						</aui:button-row>
					</div>
				</div>
			</c:when>
			<c:otherwise>
				<clay:management-toolbar
					cssClass="custom-management-toolbar"
					managementToolbarDisplayContext="<%= new ChannelManagementToolbarDisplayContext(propertyDisplayContext.getChannelSearch(), request, liferayPortletRequest, liferayPortletResponse) %>"
					propsTransformer="LRAC-10757/js/AddPropertyManagementToolbarPropsTransformer"
				/>

				<liferay-ui:search-container
					id="selectChannels"
					searchContainer="<%= channelSearch %>"
					var="groupSearchContainer"
				>
					<liferay-ui:search-container-row
						className="com.liferay.analytics.settings.web.internal.model.Channel"
						escapedModel="<%= true %>"
						keyProperty="id"
						modelVar="channel"
					>
						<portlet:renderURL var="editChannelURL">
							<portlet:param name="mvcRenderCommandName" value="/analytics_settings/edit_channel" />
							<portlet:param name="redirect" value="<%= currentURL %>" />
							<portlet:param name="channelId" value="<%= String.valueOf (channel.getId()) %>" />
							<portlet:param name="channelName" value="<%= channel.getName() %>" />
						</portlet:renderURL>

						<liferay-ui:search-container-column-text
							cssClass="table-cell-expand"
							href="<%= editChannelURL %>"
							name="available-properties"
							truncate="<%= true %>"
						>
						<span class="lfr-portal-tooltip text-truncate-inline" title="<%= HtmlUtil.escape(channel.getName()) %>">
							<span class="text-truncate">
								<%= HtmlUtil.escape(channel.getName()) %>
							</span>
						</span>
						</liferay-ui:search-container-column-text>
					</liferay-ui:search-container-row>

					<liferay-ui:search-iterator
						markupView="lexicon"
						searchResultCssClass="show-quick-actions-on-hover table table-autofit"
					/>
				</liferay-ui:search-container>
			</c:otherwise>
		</c:choose>
	</clay:sheet>
</div>