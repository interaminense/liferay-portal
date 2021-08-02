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

package com.liferay.object.admin.rest.internal.dto.v1_0.util;

import com.liferay.object.admin.rest.dto.v1_0.ObjectField;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.service.ObjectDefinitionService;
import com.liferay.object.service.ObjectFieldLocalService;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.security.permission.ActionKeys;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;

import java.util.Map;

/**
 * @author Gabriel Albuquerque
 */
public class ObjectFieldUtil {

	public static ObjectField toObjectField(
			ObjectDefinitionService objectDefinitionService,
			com.liferay.object.model.ObjectField serviceBuilderObjectField)
		throws PortalException {

		HashMapBuilder.HashMapWrapper<String, Map<String, String>> mapBuilder =
			HashMapBuilder.<String, Map<String, String>>put(
				"delete", _addAction(ActionKeys.UPDATE)
			).put(
				"get", _addAction(ActionKeys.VIEW)
			).put(
				"update", _addAction(ActionKeys.UPDATE)
			);

		ObjectDefinition objectDefinition =
			objectDefinitionService.getObjectDefinition(
				serviceBuilderObjectField.getObjectDefinitionId());

		if (!objectDefinition.isSystem()) {
			mapBuilder.put("delete", _addAction(ActionKeys.DELETE));
		}

		return new ObjectField() {
			{
				id = serviceBuilderObjectField.getObjectFieldId();
				indexed = serviceBuilderObjectField.getIndexed();
				indexedAsKeyword =
					serviceBuilderObjectField.getIndexedAsKeyword();
				indexedLanguageId =
					serviceBuilderObjectField.getIndexedLanguageId();
				name = serviceBuilderObjectField.getName();
				required = serviceBuilderObjectField.isRequired();
				type = serviceBuilderObjectField.getType();
			}
		};
	}

	public static com.liferay.object.model.ObjectField toObjectField(
		ObjectField objectField,
		ObjectFieldLocalService objectFieldLocalService) {

		com.liferay.object.model.ObjectField serviceBuilderObjectField =
			objectFieldLocalService.createObjectField(0L);

		serviceBuilderObjectField.setIndexed(
			GetterUtil.getBoolean(objectField.getIndexed()));
		serviceBuilderObjectField.setIndexedAsKeyword(
			GetterUtil.getBoolean(objectField.getIndexedAsKeyword()));
		serviceBuilderObjectField.setIndexedLanguageId(
			objectField.getIndexedLanguageId());
		serviceBuilderObjectField.setName(objectField.getName());
		serviceBuilderObjectField.setRequired(
			GetterUtil.getBoolean(objectField.getRequired()));
		serviceBuilderObjectField.setType(objectField.getType());

		return serviceBuilderObjectField;
	}

	private static Map<String, String> _addAction(String actionKey) {

		//TODO Replace this with proper logic using permission

		return HashMapBuilder.put(
			actionKey, ""
		).build();
	}

}