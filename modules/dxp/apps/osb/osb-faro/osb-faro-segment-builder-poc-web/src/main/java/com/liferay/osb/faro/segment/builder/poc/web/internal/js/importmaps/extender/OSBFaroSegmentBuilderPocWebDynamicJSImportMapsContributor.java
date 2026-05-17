/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.segment.builder.poc.web.internal.js.importmaps.extender;

import com.liferay.frontend.js.importmaps.extender.DynamicJSImportMapsContributor;
import com.liferay.petra.string.CharPool;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.url.builder.AbsolutePortalURLBuilder;
import com.liferay.portal.url.builder.AbsolutePortalURLBuilderFactory;
import com.liferay.portal.url.builder.ESModuleAbsolutePortalURLBuilder;

import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.io.Writer;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * Injects an ImportMap entry that maps the bare module name
 * <code>@liferay/osb-faro-segment-builder-poc-web</code> to the exported
 * bundle shipped by this module, so any portal page (including the JSP views
 * in this module) can import the PoC pages by package name and have the
 * portal resolve them at runtime.
 *
 * @author Adriano Interaminense
 */
@Component(service = DynamicJSImportMapsContributor.class)
public class OSBFaroSegmentBuilderPocWebDynamicJSImportMapsContributor
	implements DynamicJSImportMapsContributor {

	@Override
	public void writeGlobalImports(
			HttpServletRequest httpServletRequest, Writer writer)
		throws IOException {

		boolean first = true;

		AbsolutePortalURLBuilder absolutePortalURLBuilder =
			_absolutePortalURLBuilderFactory.getAbsolutePortalURLBuilder(
				httpServletRequest);

		for (String moduleName : _MODULE_NAMES) {
			if (!first) {
				writer.write(", ");
			}
			else {
				first = false;
			}

			writer.write(StringPool.QUOTE);
			writer.write(moduleName);
			writer.write("\": \"");

			String escapedModuleName = StringUtil.replace(
				moduleName, CharPool.FORWARD_SLASH, CharPool.DOLLAR);

			ESModuleAbsolutePortalURLBuilder esModuleAbsolutePortalURLBuilder =
				absolutePortalURLBuilder.forESModule(
					"osb-faro-segment-builder-poc-web",
					"exports/" + escapedModuleName + ".js");

			writer.write(esModuleAbsolutePortalURLBuilder.build());

			writer.write(StringPool.QUOTE);
		}
	}

	@Override
	public void writeScopedImports(
		HttpServletRequest httpServletRequest, Writer writer) {
	}

	private static final String[] _MODULE_NAMES = {
		"@liferay/osb-faro-segment-builder-poc-web"
	};

	@Reference
	private AbsolutePortalURLBuilderFactory _absolutePortalURLBuilderFactory;

}
