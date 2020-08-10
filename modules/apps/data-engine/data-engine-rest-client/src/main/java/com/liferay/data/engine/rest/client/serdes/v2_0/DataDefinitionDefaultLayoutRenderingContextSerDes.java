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

package com.liferay.data.engine.rest.client.serdes.v2_0;

import com.liferay.data.engine.rest.client.dto.v2_0.DataDefinitionDefaultLayoutRenderingContext;
import com.liferay.data.engine.rest.client.json.BaseJSONParser;

import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeMap;

import javax.annotation.Generated;

/**
 * @author Jeyvison Nascimento
 * @generated
 */
@Generated("")
public class DataDefinitionDefaultLayoutRenderingContextSerDes {

	public static DataDefinitionDefaultLayoutRenderingContext toDTO(
		String json) {

		DataDefinitionDefaultLayoutRenderingContextJSONParser
			dataDefinitionDefaultLayoutRenderingContextJSONParser =
				new DataDefinitionDefaultLayoutRenderingContextJSONParser();

		return dataDefinitionDefaultLayoutRenderingContextJSONParser.parseToDTO(
			json);
	}

	public static DataDefinitionDefaultLayoutRenderingContext[] toDTOs(
		String json) {

		DataDefinitionDefaultLayoutRenderingContextJSONParser
			dataDefinitionDefaultLayoutRenderingContextJSONParser =
				new DataDefinitionDefaultLayoutRenderingContextJSONParser();

		return dataDefinitionDefaultLayoutRenderingContextJSONParser.
			parseToDTOs(json);
	}

	public static String toJSON(
		DataDefinitionDefaultLayoutRenderingContext
			dataDefinitionDefaultLayoutRenderingContext) {

		if (dataDefinitionDefaultLayoutRenderingContext == null) {
			return "null";
		}

		StringBuilder sb = new StringBuilder();

		sb.append("{");

		if (dataDefinitionDefaultLayoutRenderingContext.getContainerId() !=
				null) {

			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"containerId\": ");

			sb.append("\"");

			sb.append(
				_escape(
					dataDefinitionDefaultLayoutRenderingContext.
						getContainerId()));

			sb.append("\"");
		}

		if (dataDefinitionDefaultLayoutRenderingContext.getDataRecordValues() !=
				null) {

			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"dataRecordValues\": ");

			sb.append(
				_toJSON(
					dataDefinitionDefaultLayoutRenderingContext.
						getDataRecordValues()));
		}

		if (dataDefinitionDefaultLayoutRenderingContext.getNamespace() !=
				null) {

			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"namespace\": ");

			sb.append("\"");

			sb.append(
				_escape(
					dataDefinitionDefaultLayoutRenderingContext.
						getNamespace()));

			sb.append("\"");
		}

		if (dataDefinitionDefaultLayoutRenderingContext.getPathThemeImages() !=
				null) {

			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"pathThemeImages\": ");

			sb.append("\"");

			sb.append(
				_escape(
					dataDefinitionDefaultLayoutRenderingContext.
						getPathThemeImages()));

			sb.append("\"");
		}

		if (dataDefinitionDefaultLayoutRenderingContext.getReadOnly() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"readOnly\": ");

			sb.append(
				dataDefinitionDefaultLayoutRenderingContext.getReadOnly());
		}

		sb.append("}");

		return sb.toString();
	}

	public static Map<String, Object> toMap(String json) {
		DataDefinitionDefaultLayoutRenderingContextJSONParser
			dataDefinitionDefaultLayoutRenderingContextJSONParser =
				new DataDefinitionDefaultLayoutRenderingContextJSONParser();

		return dataDefinitionDefaultLayoutRenderingContextJSONParser.parseToMap(
			json);
	}

	public static Map<String, String> toMap(
		DataDefinitionDefaultLayoutRenderingContext
			dataDefinitionDefaultLayoutRenderingContext) {

		if (dataDefinitionDefaultLayoutRenderingContext == null) {
			return null;
		}

		Map<String, String> map = new TreeMap<>();

		if (dataDefinitionDefaultLayoutRenderingContext.getContainerId() ==
				null) {

			map.put("containerId", null);
		}
		else {
			map.put(
				"containerId",
				String.valueOf(
					dataDefinitionDefaultLayoutRenderingContext.
						getContainerId()));
		}

		if (dataDefinitionDefaultLayoutRenderingContext.getDataRecordValues() ==
				null) {

			map.put("dataRecordValues", null);
		}
		else {
			map.put(
				"dataRecordValues",
				String.valueOf(
					dataDefinitionDefaultLayoutRenderingContext.
						getDataRecordValues()));
		}

		if (dataDefinitionDefaultLayoutRenderingContext.getNamespace() ==
				null) {

			map.put("namespace", null);
		}
		else {
			map.put(
				"namespace",
				String.valueOf(
					dataDefinitionDefaultLayoutRenderingContext.
						getNamespace()));
		}

		if (dataDefinitionDefaultLayoutRenderingContext.getPathThemeImages() ==
				null) {

			map.put("pathThemeImages", null);
		}
		else {
			map.put(
				"pathThemeImages",
				String.valueOf(
					dataDefinitionDefaultLayoutRenderingContext.
						getPathThemeImages()));
		}

		if (dataDefinitionDefaultLayoutRenderingContext.getReadOnly() == null) {
			map.put("readOnly", null);
		}
		else {
			map.put(
				"readOnly",
				String.valueOf(
					dataDefinitionDefaultLayoutRenderingContext.getReadOnly()));
		}

		return map;
	}

	public static class DataDefinitionDefaultLayoutRenderingContextJSONParser
		extends BaseJSONParser<DataDefinitionDefaultLayoutRenderingContext> {

		@Override
		protected DataDefinitionDefaultLayoutRenderingContext createDTO() {
			return new DataDefinitionDefaultLayoutRenderingContext();
		}

		@Override
		protected DataDefinitionDefaultLayoutRenderingContext[] createDTOArray(
			int size) {

			return new DataDefinitionDefaultLayoutRenderingContext[size];
		}

		@Override
		protected void setField(
			DataDefinitionDefaultLayoutRenderingContext
				dataDefinitionDefaultLayoutRenderingContext,
			String jsonParserFieldName, Object jsonParserFieldValue) {

			if (Objects.equals(jsonParserFieldName, "containerId")) {
				if (jsonParserFieldValue != null) {
					dataDefinitionDefaultLayoutRenderingContext.setContainerId(
						(String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "dataRecordValues")) {
				if (jsonParserFieldValue != null) {
					dataDefinitionDefaultLayoutRenderingContext.
						setDataRecordValues(
							(Map)
								DataDefinitionDefaultLayoutRenderingContextSerDes.
									toMap((String)jsonParserFieldValue));
				}
			}
			else if (Objects.equals(jsonParserFieldName, "namespace")) {
				if (jsonParserFieldValue != null) {
					dataDefinitionDefaultLayoutRenderingContext.setNamespace(
						(String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "pathThemeImages")) {
				if (jsonParserFieldValue != null) {
					dataDefinitionDefaultLayoutRenderingContext.
						setPathThemeImages((String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "readOnly")) {
				if (jsonParserFieldValue != null) {
					dataDefinitionDefaultLayoutRenderingContext.setReadOnly(
						(Boolean)jsonParserFieldValue);
				}
			}
			else {
				throw new IllegalArgumentException(
					"Unsupported field name " + jsonParserFieldName);
			}
		}

	}

	private static String _escape(Object object) {
		String string = String.valueOf(object);

		for (String[] strings : BaseJSONParser.JSON_ESCAPE_STRINGS) {
			string = string.replace(strings[0], strings[1]);
		}

		return string;
	}

	private static String _toJSON(Map<String, ?> map) {
		StringBuilder sb = new StringBuilder("{");

		@SuppressWarnings("unchecked")
		Set set = map.entrySet();

		@SuppressWarnings("unchecked")
		Iterator<Map.Entry<String, ?>> iterator = set.iterator();

		while (iterator.hasNext()) {
			Map.Entry<String, ?> entry = iterator.next();

			sb.append("\"");
			sb.append(entry.getKey());
			sb.append("\":");

			Object value = entry.getValue();

			Class<?> valueClass = value.getClass();

			if (value instanceof Map) {
				sb.append(_toJSON((Map)value));
			}
			else if (valueClass.isArray()) {
				Object[] values = (Object[])value;

				sb.append("[");

				for (int i = 0; i < values.length; i++) {
					sb.append("\"");
					sb.append(_escape(values[i]));
					sb.append("\"");

					if ((i + 1) < values.length) {
						sb.append(", ");
					}
				}

				sb.append("]");
			}
			else if (value instanceof String) {
				sb.append("\"");
				sb.append(_escape(entry.getValue()));
				sb.append("\"");
			}
			else {
				sb.append(String.valueOf(entry.getValue()));
			}

			if (iterator.hasNext()) {
				sb.append(",");
			}
		}

		sb.append("}");

		return sb.toString();
	}

}