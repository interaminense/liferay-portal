import React, {useState} from 'react';
import TouchpointPathQuery from 'shared/queries/TouchpointPathQuery';
import {Layer, Rectangle, Sankey, Tooltip} from 'recharts';
import {sub} from 'shared/util/lang';
import {toLocale, toThousands} from 'shared/util/numbers';
import {useQuery} from '@apollo/react-hooks';
import {v4 as uuidv4} from 'uuid';

function truncateText(text, limit) {
	if (text.length > limit) {
		return `${text.substring(0, limit)}...`;
	}

	return text;
}

const CHART_COLORS = [
	'#4B9BFF',
	'#FFB46E',
	'#FF5F5F',
	'#B077FF',
	'#FF73C3',
	'#FFD76E',
	'#9CE269',
	'#5FC8FF'
];

function formatData({pagePath}) {
	const mainNodeHeight = 280;
	const totalViewsPreviousPage = pagePath.previousPagePathNodes.reduce(
		(acc, {views}) => acc + views,
		0
	);

	const totalViewsNextPage = pagePath.nextPagePathNodes.reduce(
		(acc, {views}) => acc + views,
		0
	);

	const formattedData = {
		links: [
			...pagePath.previousPagePathNodes.map(({views}, index) => ({
				source: index + 1,
				target: 0,
				value: views
			})),
			...pagePath.nextPagePathNodes.map(({views}, index) => ({
				source: 0,
				target: index + 6,
				value: views
			}))
		],
		nodes: [
			{
				height: mainNodeHeight,
				id: uuidv4(),
				main: true,
				name: pagePath.title,
				url: pagePath.canonicalUrl
			},
			...pagePath.previousPagePathNodes.map(
				({canonicalUrl, title, views}) => ({
					color: title === 'Other Referrals' ? '#A7A9BC' : null,
					height: (views / totalViewsPreviousPage) * mainNodeHeight,
					id: uuidv4(),
					name: title,
					type: 'previous',
					url: canonicalUrl
				})
			),
			...pagePath.nextPagePathNodes.map(
				({canonicalUrl, title, views}) => ({
					color:
						title === 'Other Pages' || title === 'Drop Offs'
							? '#A7A9BC'
							: null,
					height: (views / totalViewsNextPage) * mainNodeHeight,
					id: uuidv4(),
					name: title,
					type: 'next',
					url: canonicalUrl
				})
			)
		]
	};

	return formattedData;
}

const CustomTooltip: React.FC<any> = ({payload}) => {
	if (!payload.length) return null;

	let description = Liferay.Language.get('page-views');

	if (!payload[0].payload?.payload?.main) {
		if (
			payload[0].payload?.payload?.type === 'previous' ||
			payload[0].payload?.payload?.target?.main
		) {
			description = sub(Liferay.Language.get('page-views-x'), [
				Liferay.Language.get('referral')
			]);
		} else {
			description = sub(Liferay.Language.get('page-views-x'), [
				Liferay.Language.get('exit-pages')
			]);
		}
	}

	return (
		<div className='clay-popover-top fade popover position-relative show'>
			<div className='popover-header'>{description}</div>
			<div className='popover-body d-flex justify-content-between'>
				<div className='mr-2'>{payload[0].name}</div>
				<div>{toLocale(payload[0].value)}</div>
			</div>
		</div>
	);
};

const Node = ({
	height,
	index,
	mouseEnter,
	onNodeChange,
	payload,
	selectedNode,
	width,
	x,
	y
}: any) => {
	let fill = null;

	if (mouseEnter) {
		if (payload.main) {
			fill = '#50D2A0';
		} else if (payload.id === selectedNode) {
			fill = payload.color || CHART_COLORS[index - 1];
		} else {
			fill = '#CDCED9';
		}
	} else {
		if (payload.main) {
			fill = '#50D2A0';
		} else {
			fill = payload.color || CHART_COLORS[index - 1];
		}
	}

	let radius = null;

	if (!payload.main) {
		radius = payload.type === 'previous' ? [5, 0, 0, 5] : [0, 5, 5, 0];
	}

	return (
		<Layer
			crossOrigin={undefined}
			fr={undefined}
			key={`CustomNode${index}`}
			onMouseEnter={() => onNodeChange(payload.id)}
			onMouseLeave={() => onNodeChange(null)}
			path={undefined}
		>
			<Rectangle
				fill={fill}
				fillOpacity='1'
				height={height}
				radius={radius}
				width={width}
				x={x}
				y={y}
			/>

			<text x={x + width / 2 - 10} y={y + height / 2 + 5}>
				{toThousands(payload.value)}
			</text>

			<text
				fontSize='16'
				fontWeight={600}
				lengthAdjust='spacingAndGlyphs'
				textAnchor='start'
				x={x}
				y={payload.url ? y - 28 : y - 16}
			>
				{truncateText(payload.name, 15)}
			</text>

			{payload.url && (
				<text
					fill='#6B6C7E'
					fontSize='12'
					fontWeight={400}
					textAnchor='start'
					x={x}
					y={y - 10}
				>
					{truncateText(payload.url, 25)}
				</text>
			)}
		</Layer>
	);
};

const getFill = ({color, id, index, mouseEnter, selectedNode}) => {
	let fill = null;

	if (mouseEnter) {
		if (id === selectedNode) {
			fill = color || CHART_COLORS[index];
		} else {
			fill = '#CDCED9';
		}
	} else {
		fill = color || CHART_COLORS[index];
	}

	return fill;
};

const Link: React.FC<any> = ({
	index,
	linkWidth,
	mouseEnter,
	onNodeChange,
	payload,
	selectedNode,
	sourceControlX,
	sourceX,
	sourceY,
	targetControlX,
	targetX,
	targetY
}) => {
	let fill = null;
	let id = null;

	if (payload.source.main) {
		id = payload.target.id;
		fill = getFill({
			...payload.target,
			index,
			mouseEnter,
			selectedNode
		});
	} else {
		id = payload.source.id;
		fill = getFill({
			...payload.source,
			index,
			mouseEnter,
			selectedNode
		});
	}

	return (
		<Layer
			crossOrigin={undefined}
			fr={undefined}
			key={`CustomLink${index}`}
			opacity={0.2}
			path={undefined}
		>
			<path
				d={`
				 M${sourceX},${sourceY + linkWidth / 2}
				 C${sourceControlX},${sourceY + linkWidth / 2}
				   ${targetControlX},${targetY + linkWidth / 2}
				   ${targetX},${targetY + linkWidth / 2}
				 L${targetX},${targetY - linkWidth / 2}
				 C${targetControlX},${targetY - linkWidth / 2}
				   ${sourceControlX},${sourceY - linkWidth / 2}
				   ${sourceX},${sourceY - linkWidth / 2}
				 Z
			   `}
				fill={fill}
				onBlur={() => {}}
				onMouseEnter={() => onNodeChange(id)}
				onMouseLeave={() => onNodeChange(null)}
				strokeWidth='0'
			/>
		</Layer>
	);
};

export const NewSankey = () => {
	const {data} = useQuery(TouchpointPathQuery, {
		variables: {}
	});

	if (!data) return null;

	return <SankeyWraper data={formatData(data)} />;
};

const SankeyWraper = ({data}) => {
	const [mouseEnter, setMouseEnter] = useState(false);
	const [selectedNode, setSelectedNode] = useState(null);

	return (
		/**
		 * TODO: Needs to update Recharts to latest version
		 * to be able to sort main path on center of the card
		 *
		 * Remove interations props
		 * Add sort={false}
		 */

		<Sankey
			data={data}
			height={600}
			iterations={0}
			link={
				<Link
					mouseEnter={mouseEnter}
					onNodeChange={setSelectedNode}
					selectedNode={selectedNode}
				/>
			}
			linkCurvature={0.3}
			margin={{bottom: 30, top: 50}}
			node={
				<Node
					mouseEnter={mouseEnter}
					onNodeChange={setSelectedNode}
					selectedNode={selectedNode}
				/>
			}
			nodePadding={80}
			nodeWidth={120}
			onMouseEnter={() => {
				setMouseEnter(true);
			}}
			onMouseLeave={() => {
				setMouseEnter(false);
			}}
			width={1200}
		>
			<Tooltip content={<CustomTooltip />} />
		</Sankey>
	);
};
