import autobind from 'autobind-decorator';
import getSVG from 'shared/util/svg';
import React from 'react';
import {PropTypes} from 'prop-types';

const CLASSNAME = 'analytics-add-report';

class Thumbs extends React.Component {
	static propTypes = {
		items: PropTypes.arrayOf(
			PropTypes.shape({
				selected: PropTypes.bool,
				svg: PropTypes.string,
				text: PropTypes.string,
				value: PropTypes.string
			})
		).isRequired,
		onSelectThumb: PropTypes.func.isRequired
	};

	state = {
		items: []
	};

	componentDidMount() {
		const {items, onSelectThumb} = this.props;

		this.setState({items}, () => onSelectThumb(this.getSelectedItem()));
	}

	itemsValueFn() {
		return this.props.items;
	}

	updateSelectedItem(id) {
		const {items} = this.state;

		return items.map((item, index) => ({
			...item,
			selected: id == index
		}));
	}

	getSelectedItem() {
		return this.state.items.filter(({selected}) => selected)[0];
	}

	selectThumb({parentNode}) {
		this.setState(
			{
				items: this.updateSelectedItem(parentNode.dataset.id)
			},
			() => this.props.onSelectThumb(this.getSelectedItem())
		);
	}

	@autobind
	handleClickSelectThumb({target}) {
		this.selectThumb(target);
	}

	@autobind
	handleKeyDown() {
		return;
	}

	@autobind
	handleKeyPress({target}) {
		this.selectThumb(target);
	}

	@autobind
	handleKeyUp() {
		return;
	}

	handleNotUsedEvents() {
		return;
	}

	render() {
		const {items} = this.state;

		if (!items.length) return null;
		return (
			<ul className={`${CLASSNAME}-thumbs`}>
				{items.map(({selected, svg, text}, index) => {
					const {id, viewBox} = getSVG(svg);
					const refSelected = selected ? 'selected' : '';

					return (
						<li
							className={refSelected}
							data-id={index}
							data-tooltip
							key={index}
							title={text}
						>
							<button
								onBlur={this.handleNotUsedEvents}
								onClick={this.handleClickSelectThumb}
								onFocus={this.handleNotUsedEvents}
								onKeyPress={this.handleKeyPress}
							>
								<svg className={svg} viewBox={viewBox}>
									<use
										xlinkHref={`/o/osb-faro-web/dist/sprite.svg#${id}`}
									/>
								</svg>
							</button>
						</li>
					);
				})}
			</ul>
		);
	}
}

export default Thumbs;
