import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	addCriterionAtIndex,
	findPropertyByCriterion,
	isCriterionGroup,
} from '../utils/utils';
import {
	applyMoveTarget,
	getMoveTargets,
	MovePosition,
	MoveTarget,
} from '../utils/keyboardMovement';
import {Criterion, CriterionGroup} from '../utils/types';
import {Property} from 'shared/util/records';
import {ReferencedObjectsContext} from './referencedObjects';
import {sub} from 'shared/util/lang';

export interface MovementSource {
	criterion: Criterion;
	property: Property;
}

interface IKeyboardMovementContext {
	source: MovementSource | null;
	startMovement: ((source: MovementSource) => void) | null;
	target: MoveTarget | null;
}

export const KeyboardMovementContext = createContext<IKeyboardMovementContext>({
	source: null,
	startMovement: null,
	target: null,
});

export const useKeyboardMovement = () => useContext(KeyboardMovementContext);

const POSITION_LABELS: Record<MovePosition, string> = {
	bottom: Liferay.Language.get('bottom'),
	middle: Liferay.Language.get('group'),
	top: Liferay.Language.get('top'),
};

const isSameTarget = (a: MoveTarget, b: MoveTarget | null) =>
	!!b &&
	a.groupId === b.groupId &&
	a.index === b.index &&
	a.nodeId === b.nodeId &&
	a.position === b.position;

interface IKeyboardMovementProviderProps {
	children: React.ReactNode;
	criteria: CriterionGroup | null;
	onChange: (criteria: CriterionGroup) => void;
	sequential: boolean;
}

/**
 * Lets keyboard users drop a condition from the library anywhere on the
 * canvas, like the Audience Builder: Enter picks the condition, the arrow
 * keys move through the drop targets, Enter drops it, and Esc cancels.
 */
export function KeyboardMovementProvider({
	children,
	criteria,
	onChange,
	sequential,
}: IKeyboardMovementProviderProps) {
	const {addProperty, referencedProperties} = useContext(
		ReferencedObjectsContext
	);

	const [announcement, setAnnouncement] = useState('');
	const [source, setSource] = useState<MovementSource | null>(null);
	const [target, setTarget] = useState<MoveTarget | null>(null);

	const targets = useMemo(
		() => getMoveTargets(criteria, sequential),
		[criteria, sequential]
	);

	const getNodeLabel = useCallback(
		(nodeId: string): string => {
			const findRow = (group: CriterionGroup): Criterion | undefined => {
				for (const node of group.items) {
					if (isCriterionGroup(node)) {
						const row = findRow(node);

						if (row) {
							return row;
						}
					}
					else if ((node as Criterion).rowId === nodeId) {
						return node as Criterion;
					}
				}
			};

			const row = criteria && findRow(criteria);

			if (!row) {
				return Liferay.Language.get('group');
			}

			return (
				findPropertyByCriterion(row, referencedProperties)?.label ??
				row.propertyName ??
				''
			);
		},
		[criteria, referencedProperties]
	);

	const announceTarget = useCallback(
		({nodeId, position}: MoveTarget) =>
			setAnnouncement(
				sub(Liferay.Language.get('targeting-x-of-x'), [
					POSITION_LABELS[position],
					getNodeLabel(nodeId),
				]) as string
			),
		[getNodeLabel]
	);

	const drop = useCallback(
		(newCriteria: CriterionGroup, property: Property) => {
			addProperty?.(property);

			onChange(newCriteria);

			setAnnouncement(
				sub(
					Liferay.Language.get('x-was-added-to-the-segment-criteria'),
					[property.label]
				) as string
			);

			setSource(null);
			setTarget(null);
		},
		[addProperty, onChange]
	);

	const startMovement = useCallback(
		(movementSource: MovementSource) => {
			if (!targets.length) {
				drop(
					addCriterionAtIndex(criteria, 0, movementSource.criterion),
					movementSource.property
				);

				return;
			}

			setSource(movementSource);
			setTarget(targets[targets.length - 1]);

			setAnnouncement(
				sub(
					Liferay.Language.get(
						'use-the-arrow-keys-to-choose-where-to-add-x-and-press-enter-to-confirm-or-esc-to-cancel'
					),
					[movementSource.property.label]
				) as string
			);
		},
		[criteria, drop, targets]
	);

	useEffect(() => {
		if (!source) {
			return;
		}

		document
			.querySelector('.keyboard-movement-target')
			?.scrollIntoView?.({behavior: 'smooth', block: 'nearest'});
	}, [source, target]);

	useEffect(() => {
		if (!source) {
			return;
		}

		const currentIndex = Math.max(
			targets.findIndex((moveTarget) => isSameTarget(moveTarget, target)),
			0
		);

		const moveTo = (index: number) => {
			const moveTarget =
				targets[Math.min(Math.max(index, 0), targets.length - 1)];

			setTarget(moveTarget);

			announceTarget(moveTarget);
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			event.preventDefault();
			event.stopPropagation();

			if (event.key === 'ArrowDown') {
				moveTo(currentIndex + 1);
			}
			else if (event.key === 'ArrowUp') {
				moveTo(currentIndex - 1);
			}
			else if (event.key === 'End') {
				moveTo(targets.length - 1);
			}
			else if (event.key === 'Home') {
				moveTo(0);
			}
			else if (event.key === 'Enter' || event.key === ' ') {
				if (criteria && targets[currentIndex]) {
					drop(
						applyMoveTarget(
							criteria,
							targets[currentIndex],
							source.criterion,
							sequential
						),
						source.property
					);
				}
			}
			else if (event.key === 'Escape') {
				setAnnouncement('');
				setSource(null);
				setTarget(null);
			}
		};

		window.addEventListener('keydown', handleKeyDown, true);

		return () => window.removeEventListener('keydown', handleKeyDown, true);
	}, [announceTarget, criteria, drop, sequential, source, target, targets]);

	const value = useMemo(
		() => ({source, startMovement, target}),
		[source, startMovement, target]
	);

	return (
		<KeyboardMovementContext.Provider value={value}>
			<div aria-live="assertive" className="sr-only">
				{announcement}
			</div>

			{children}
		</KeyboardMovementContext.Provider>
	);
}
