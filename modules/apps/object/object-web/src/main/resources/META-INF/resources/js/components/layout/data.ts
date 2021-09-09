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

export type TLayoutData = {
	label: string;
	tabs: {
		label: string;
		type: string;
		boxs: {
			collapsible: boolean;
			label: string;
			rows: {
				columns: {
					fields: {
						label: string;
						readOnly: boolean;
						type: string;
					}[];
				}[];
			}[];
		}[];
	}[];
};

const layoutData: TLayoutData = {
	label: 'layoutA',
	tabs: [
		{
			label: 'tabA',
			boxs: [
				{
					collapsible: false,
					label: 'boxA',
					rows: [
						{
							columns: [
								{
									fields: [
										{
											label: 'fieldA',
											readOnly: true,
											type: 'Text',
										},
									],
								},
							],
						},
						{
							columns: [
								{
									fields: [
										{
											label: 'fieldA',
											readOnly: true,
											type: 'Text',
										},
									],
								},
							],
						},
					],
				},
			],
			type: 'fields',
		},
	],
};

export default layoutData;
