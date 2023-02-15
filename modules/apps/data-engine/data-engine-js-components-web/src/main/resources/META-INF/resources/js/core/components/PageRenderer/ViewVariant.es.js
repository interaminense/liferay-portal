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


 import classNames from 'classnames';
 import React, {
	 useContext,
	 useEffect,
	 useMemo,
	 useRef,
	 useState,
 } from 'react';
 import {useDrag} from 'react-dnd';
 import {getEmptyImage} from 'react-dnd-html5-backend';


 import {DRAG_FIELD_TYPE_MOVE} from '../../../utils/dragTypes';
 import {hasFieldSet} from '../../../utils/fields.es';
 import {DND_ORIGIN_TYPE, useDrop} from '../../hooks/useDrop.es';
 import {useFormState} from '../../hooks/useForm.es';
 import {Actions, ActionsControls, useActions} from '../Actions.es';
 import {ParentFieldContext} from '../Field/ParentFieldContext.es';
 import FieldDragPreview from '../FieldDragPreview.es';
 import {useIsOverTarget as useIsOverKeyboardTarget} from '../KeyboardDNDContext';
 import {Placeholder} from '../Placeholder.es';
 import * as DefaultVariant from './DefaultVariant.es';


 export function Column({
	 allowNestedFields,
	 children,
	 column,
	 editable,
	 index: columnIndex,
	 itemPath,
	 pageIndex,
	 rowIndex,
 }) {
	 const parentField = useContext(ParentFieldContext);

	 const [sameName, setSameName] = useState('');

	 console.log(children);

	 const actionsRef = useRef(null);
	 const columnRef = useRef(null);
	 const resizeRef = useRef(null);

	 const firstField = column.fields[0];


	 const {
		 state: {activeId, hoveredId},
	 } = useActions();


	 const {canDrop, drop, overTarget} = useDrop({
		 columnIndex,
		 field: firstField,
		 fieldName: firstField?.fieldName,
		 origin: DND_ORIGIN_TYPE.FIELD,
		 pageIndex,
		 parentField,
		 rowIndex,
	 });


	 const overFieldKeyboardTarget = useIsOverKeyboardTarget(
		 column.fields.length ? [...itemPath, 0] : itemPath,
		 'middle'
	 );


	 const isFieldRepetable = firstField.repeatable;


	 const [{isDragging}, drag, preview] = useDrag({
		 item: {
			 data: firstField ?? undefined,
			 preview: () => <FieldDragPreview containerRef={resizeRef} />,
			 sourceIndexes: {
				 columnIndex,
				 pageIndex,
				 rowIndex,
			 },
			 sourceParentField: parentField,
			 type: DRAG_FIELD_TYPE_MOVE,
		 },
		 canDrag: isFieldRepetable,
	 });


	 useEffect(() => {
		 preview(getEmptyImage(), {captureDraggingState: true});
	 }, [preview]);


	 if (!column.fields.length) {
		 return (
			 <Placeholder
				 columnIndex={columnIndex}
				 keyboardDNDPosition={{itemPath, position: 'middle'}}
				 pageIndex={pageIndex}
				 rowIndex={rowIndex}
				 size={column.size}
			 />
		 );
	 }


	 const rootParentField = parentField.root ?? firstField;
	 const isFieldSetOrGroup = firstField.type === 'fieldset';
	 const isFieldSet = hasFieldSet(firstField);


	 const isFieldSelected =
		 firstField.fieldName === activeId || firstField.fieldName === hoveredId;


	 const fieldRootOrCurrent =
		 !editable && hasFieldSet(parentField.root)
			 ? parentField.root
			 : firstField;


	 return (
		//  <ActionsControls
		// 	 actionsRef={actionsRef}
		// 	 activePage={pageIndex}
		// 	 columnRef={columnRef}
		// 	 field={fieldRootOrCurrent}
		//  >
			 <DefaultVariant.Column
				 className={classNames({
					 'droppable': isFieldRepetable,
					 'dragging': isDragging,
					 'hovered': isFieldRepetable && firstField.fieldName === hoveredId,
					 'selected': isFieldRepetable && firstField.fieldName === activeId,
					 'target-droppable': canDrop || overFieldKeyboardTarget,
					 'target-over targetOver':
					 	(!rootParentField.ddmStructureId &&
					 		overTarget &&
					 		canDrop) ||
					 	overFieldKeyboardTarget,
				 })}
				 column={column}
				 index={columnIndex}
				 pageIndex={pageIndex}
				 ref={columnRef}
				 rowIndex={rowIndex}
			 >
				 
				 {/* {isFieldRepetable && (
				 		<Actions
							activePage={pageIndex}
							disableDropdown={true}
							field={fieldRootOrCurrent}
							fieldId={firstField.fieldName}
							fieldType={firstField.type}
							isFieldSelected={isFieldSelected}
							isFieldSet={isFieldSet}
							itemPath={itemPath}
							parentFieldName={parentField?.fieldName}
							ref={actionsRef}
					 />)} */}

					 {/* {children} se descomentar isso e comentar a div de baixo, funciona
					 mas fica sem as classes e o comportamento do drag and drop*/}

					 <div
						 className={classNames({
							 'ddm-drag': isFieldRepetable,
							 'py-0': isFieldSetOrGroup,
						 })}
						 ref={(node) => {
							 if (
								 allowNestedFields && isFieldRepetable &&
								 !rootParentField.ddmStructureId
							 ) {
								 drag(drop(node));
							 }
							 else if (!hasFieldSet(parentField) && isFieldRepetable) {
								 drag(node);
							 }
							 resizeRef.current = node;
						 }}
					 >
						{column.fields.map((field, index) =>
							children({
								field,
								index,
								loc: {
									columnIndex,
									pageIndex,
									rowIndex,
								},
							})
						)}
						 
					 </div>
			 </DefaultVariant.Column>
		// </ActionsControls>
	 );
 }


 Column.displayName = 'ViewVariant.Column';


 export function Page({
	 activePage,
	 children,
	 editable,
	 empty,
	 forceAriaUpdate,
	 header,
	 invalidFormMessage,
	 pageIndex,
 }) {
	 const dropTargetRef = useRef();


	 const {canDrop, drop, overTarget} = useDrop({
		 columnIndex: 0,
		 origin: DND_ORIGIN_TYPE.EMPTY,
		 pageIndex,
		 rowIndex: 0,
	 });


	 const overKeyboardPageTarget = useIsOverKeyboardTarget(
		 [pageIndex],
		 'middle'
	 );


	 const formState = useFormState();


	 const hasSingleEmptyColumn = useMemo(() => {
		 const {rows} = formState.pages[pageIndex];


		 if (rows?.length === 1) {
			 const [firstRow] = rows;


			 if (firstRow.columns?.length === 1) {
				 const [firstColumn] = firstRow.columns;


				 if (firstColumn.fields?.length === 0) {
					 return true;
				 }
			 }
		 }


		 return false;
	 }, [formState, pageIndex]);


	 const overKeyboardColumnTarget = useIsOverKeyboardTarget(
		 hasSingleEmptyColumn ? [pageIndex, 0, 0] : [pageIndex],
		 'middle'
	 );


	 const overKeyboardTarget =
		 overKeyboardPageTarget || overKeyboardColumnTarget;


	 useEffect(() => {
		 if (overKeyboardTarget && dropTargetRef.current) {
			 dropTargetRef.current.scrollIntoView({
				 behavior: 'auto',
				 block: 'center',
				 inline: 'center',
			 });
		 }
	 }, [overKeyboardTarget]);


	 return (
		 <DefaultVariant.Page
			 activePage={activePage}
			 forceAriaUpdate={forceAriaUpdate}
			 header={header}
			 invalidFormMessage={invalidFormMessage}
			 pageIndex={pageIndex}
		 >
			 {children}
		 </DefaultVariant.Page>
	 );
 }


 Page.displayName = 'ViewVariant.Page';


 export function Rows({children, editable, itemPath, pageIndex, rows}) {
	 if (!rows) {
		 return null;
	 }


	 return rows.map((row, index) => (
		 <div key={index}>
			 {editable && index === 0 && (
				 <Placeholder
					 isRow
					 keyboardDNDPosition={{
						 itemPath: [...itemPath, 0],
						 position: 'top',
					 }}
					 pageIndex={pageIndex}
					 rowIndex={0}
					 size={12}
				 />
			 )}


			 {children({index, row})}


			 {editable && (
				 <Placeholder
					 isRow
					 keyboardDNDPosition={{
						 itemPath: [...itemPath, index],
						 position: 'bottom',
					 }}
					 pageIndex={pageIndex}
					 rowIndex={index + 1}
					 size={12}
				 />
			 )}
		 </div>
	 ));
 }


 Rows.displayName = 'ViewVariant.Rows';


 export function Row({children, row}) {
	 const rowRef = useRef(null);
	 const resizeInfoRef = useRef(null);
// tambem deve ter algum erro aqui

	 return (
		 <div className="position-relative row" ref={rowRef}> 
			 {row.columns.map((column, index) =>
				 children({column, index, resizeInfoRef, rowRef})
			 )}
		 </div>
	 );
 }


 Row.displayName = 'ViewVariant.Row';

