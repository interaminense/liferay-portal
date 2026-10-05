import {Conjunctions} from './constants';
import {
	addCriterionAtIndex,
	createNewGroup,
	getNestedOrLimitState,
	getSequentialLimitState,
	isCriterionGroup,
} from './utils';
import {Criteria, Criterion, CriterionGroup} from './types';

export type MovePosition = 'bottom' | 'middle' | 'top';

export interface MoveTarget {
	groupId: string;
	index: number;
	nodeId: string;
	position: MovePosition;
}

const getNodeId = (node: Criteria): string =>
	isCriterionGroup(node)
		? node.criteriaGroupId
		: (node as Criterion).rowId ?? '';

const isGroupAtLimit = (
	group: CriterionGroup,
	root: boolean,
	sequential: boolean
): boolean =>
	sequential &&
	!!(root ? getSequentialLimitState(group) : getNestedOrLimitState(group));

/**
 * Lists, in reading order, every place a condition from the library can be
 * dropped on the canvas: above and below the nodes of each group, and on top
 * of a row to group them. It follows the same rules as the drop targets.
 */
export const getMoveTargets = (
	criteria: CriterionGroup | null | undefined,
	sequential: boolean
): MoveTarget[] => {
	const targets: MoveTarget[] = [];

	const collect = (group: CriterionGroup, root: boolean) => {
		const atLimit = isGroupAtLimit(group, root, sequential);

		group.items.forEach((node, index) => {
			const nodeId = getNodeId(node);

			if (!atLimit) {
				targets.push({
					groupId: group.criteriaGroupId,
					index,
					nodeId,
					position: 'top',
				});
			}

			if (isCriterionGroup(node)) {
				collect(node, false);
			}
			else if (root || !sequential) {
				targets.push({
					groupId: group.criteriaGroupId,
					index,
					nodeId,
					position: 'middle',
				});
			}

			if (!atLimit && index === group.items.length - 1) {
				targets.push({
					groupId: group.criteriaGroupId,
					index: index + 1,
					nodeId,
					position: 'bottom',
				});
			}
		});
	};

	if (criteria?.items.length) {
		collect(criteria, true);
	}

	return targets;
};

const updateGroup = (
	group: CriterionGroup,
	groupId: string,
	update: (group: CriterionGroup) => CriterionGroup
): CriterionGroup => {
	if (group.criteriaGroupId === groupId) {
		return update(group);
	}

	return {
		...group,
		items: group.items.map((node) =>
			isCriterionGroup(node) ? updateGroup(node, groupId, update) : node
		),
	};
};

/**
 * Applies a keyboard drop the same way the drop targets do: inserting the
 * criterion between nodes, or grouping it with the targeted row.
 */
export const applyMoveTarget = (
	criteria: CriterionGroup,
	target: MoveTarget,
	criterion: Criterion,
	sequential: boolean
): CriterionGroup =>
	updateGroup(criteria, target.groupId, (group) => {
		if (target.position !== 'middle') {
			return addCriterionAtIndex(group, target.index, criterion);
		}

		const [newCriterion] = addCriterionAtIndex(null, 0, criterion).items;

		return {
			...group,
			items: group.items.map((node, index) =>
				index === target.index
					? createNewGroup(
							[node, newCriterion],
							sequential ? Conjunctions.Or : Conjunctions.And
						)
					: node
			),
		};
	});
