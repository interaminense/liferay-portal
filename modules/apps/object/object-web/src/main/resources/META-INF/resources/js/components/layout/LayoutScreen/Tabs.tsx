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

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import {useModal} from '@clayui/modal';
import React, {useContext, useState} from 'react';

import Panel from '../../Panel/Panel';
import LayoutContext, {TYPES} from '../context';
import LayoutBox from './Box';
import DropdownWithDeleteButton from './DropdownWithDeleteButton';
import ModalAddNewBlock from './ModalAddNewBlock';

const LayoutTabs: React.FC<React.HTMLAttributes<HTMLElement>> = () => {
	const [{layoutData}, dispatch] = useContext(LayoutContext);
	const [visibleModal, setVisibleModal] = useState(false);
	const [selectedTabIndex, setSelectedTabIndex] = useState(0);
	const {observer, onClose} = useModal({
		onClose: () => setVisibleModal(false),
	});

	return (
		<>
			{layoutData?.tabs?.map(({boxs, label, type}, tabIndex) => {
				return (
					<Panel
						className="layout-tab__tab"
						key={`layout_${tabIndex}`}
					>
						<Panel.Header
							contentLeft={
								<ClayLabel displayType="info">{type}</ClayLabel>
							}
							contentRight={
								<>
									<ClayButton
										displayType="secondary"
										onClick={() => {
											setVisibleModal(true);
											setSelectedTabIndex(tabIndex);
										}}
										small
									>
										<ClayIcon symbol="plus" />

										<span className="ml-2">
											{Liferay.Language.get('add-block')}
										</span>
									</ClayButton>

									<DropdownWithDeleteButton
										onClick={() => {
											dispatch({
												payload: {
													tabIndex,
												},
												type: TYPES.DELETE_TAB,
											});
										}}
									/>
								</>
							}
							title={label}
						/>

						{!!boxs?.length && (
							<Panel.Body>
								{boxs.map(
									({collapsible, label, rows}, boxIndex) => (
										<LayoutBox
											boxIndex={boxIndex}
											collapsible={collapsible}
											key={`box_${boxIndex}`}
											label={label}
											rows={rows}
											tabIndex={tabIndex}
										/>
									)
								)}
							</Panel.Body>
						)}
					</Panel>
				);
			})}

			{visibleModal && (
				<ModalAddNewBlock
					observer={observer}
					onClose={onClose}
					tabIndex={selectedTabIndex}
				/>
			)}
		</>
	);
};

export default LayoutTabs;
