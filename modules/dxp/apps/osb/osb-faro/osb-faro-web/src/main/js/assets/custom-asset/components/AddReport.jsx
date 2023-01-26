import autobind from 'autobind-decorator';
import Button from 'shared/components/Button';
import Card from 'shared/components/Card';
import getCN from 'classnames';
import React from 'react';
import Thumbs from './Thumbs';
import {ASSET_METRICS} from 'shared/util/constants';
import {isEmpty} from 'lodash';
import {PropTypes} from 'prop-types';

const CLASSNAME = 'analytics-add-report';

class AddReport extends React.Component {
	static defaultProps = {
		isEmptyDashboard: false
	};

	static propTypes = {
		/**
		 * Renders the card with the higher height
		 * @type {?boolean}
		 * @default false
		 */
		isEmptyDashboard: PropTypes.bool,
		onGetReport: PropTypes.func.isRequired
	};

	state = {
		isEnableToSave: false,
		report: {},
		showFormAddReport: false
	};

	constructor() {
		super();

		this.state = {
			...this.state,
			report: this.reportValueFn()
		};
	}

	enableButtonSave() {
		const {report} = this.state;

		this.setState({
			isEnableToSave: true
		});

		Object.keys(report).forEach(key => {
			if (isEmpty(report[key])) {
				this.setState({
					isEnableToSave: false
				});

				return;
			}
		});
	}

	reportValueFn() {
		return {
			chartType: '',
			metric: '',
			title: ''
		};
	}

	openReport() {
		this.setState({
			showFormAddReport: true
		});
	}

	closeReport() {
		this.setState({
			showFormAddReport: false
		});
	}

	@autobind
	handleClickAddReport() {
		this.openReport();

		this.setState({
			report: this.reportValueFn()
		});
	}

	@autobind
	handleClickCancelReport() {
		this.closeReport();
	}

	@autobind
	handleClickSaveReport() {
		const {
			props: {onGetReport},
			state: {report}
		} = this;

		onGetReport(report);

		this.closeReport();
	}

	@autobind
	handleChangeReportTitle({target}) {
		this.setState(
			({report}) => ({
				report: {
					...report,
					title: target.value.trim().slice(0, 90)
				}
			}),
			() => {
				// Validate to allow to save
				this.enableButtonSave();
			}
		);
	}

	@autobind
	handleChangeSelectMetric({target}) {
		this.setState(
			({report}) => ({
				report: {
					...report,
					metric: target.value
				}
			}),
			() => {
				// Validate to allow to save
				this.enableButtonSave();
			}
		);
	}

	@autobind
	handleGetSelectedChartType({value}) {
		this.setState(
			({report}) => ({
				report: {
					...report,
					chartType: value
				}
			}),
			() => {
				// Validate to allow to save
				this.enableButtonSave();
			}
		);
	}

	renderThumbCharts() {
		const items = [
			{
				selected: true,
				svg: 'cerebro-thumb-line-chart',
				text: Liferay.Language.get(
					'not-possible-to-change-the-visualization-type'
				),
				value: 'line'
			}
		];

		return (
			<div className='form-group'>
				<label>{Liferay.Language.get('visualization')}</label>

				<Thumbs
					items={items}
					onSelectThumb={this.handleGetSelectedChartType}
				/>
			</div>
		);
	}

	renderInputSelectMetric() {
		return (
			<div className='form-group'>
				<label htmlFor='metricSelector'>
					{Liferay.Language.get('metric')}
				</label>

				<select
					className='form-control'
					id='metricSelector'
					onBlur={this.handleBlurSelectMetric}
					onChange={this.handleChangeSelectMetric}
				>
					<option defaultValue value=''>
						{Liferay.Language.get('select-a-metric')}
					</option>

					{ASSET_METRICS.sort((p, c) =>
						p.selectTitle.localeCompare(c.selectTitle)
					).map(({key, selectTitle}) => (
						<option key={key} value={key}>
							{selectTitle}
						</option>
					))}
				</select>
			</div>
		);
	}

	renderInputReportName() {
		return (
			<div className='form-group'>
				<label htmlFor='reportNameInput'>
					{Liferay.Language.get('report-name')}
				</label>

				<input
					className='form-control'
					id='reportNameInput'
					maxLength={90}
					onInput={this.handleChangeReportTitle}
					placeholder={Liferay.Language.get(
						'enter-a-name-for-this-report'
					)}
					type='text'
				/>
			</div>
		);
	}

	renderFormAddReport() {
		return (
			<div className='w-100'>
				<div className='row'>
					<div className='col-sm-4'>
						{this.renderInputReportName()}
					</div>
				</div>

				<div className='row'>
					<div className='col-sm-4'>
						{this.renderInputSelectMetric()}
					</div>
				</div>

				<div className='row'>
					<div className='col-sm-12'>{this.renderThumbCharts()}</div>
				</div>
			</div>
		);
	}

	renderCardAddReport() {
		const {isEnableToSave} = this.state;

		return (
			<>
				<Card.Header>
					<Card.Title>
						{Liferay.Language.get('add-report')}
					</Card.Title>
				</Card.Header>
				<Card.Body>{this.renderFormAddReport()}</Card.Body>
				<Card.Footer>
					<Button
						className='mr-4'
						disabled={!isEnableToSave}
						display='primary'
						onClick={
							isEnableToSave
								? this.handleClickSaveReport
								: undefined
						}
					>
						{Liferay.Language.get('save')}
					</Button>

					<Button onClick={this.handleClickCancelReport}>
						{Liferay.Language.get('cancel')}
					</Button>
				</Card.Footer>
			</>
		);
	}

	renderAddButton() {
		return (
			<div className={`${CLASSNAME}-button`}>
				<Button onClick={this.handleClickAddReport}>
					{Liferay.Language.get('add-report')}
				</Button>
			</div>
		);
	}

	render() {
		const {
			props: {className, isEmptyDashboard},
			state: {showFormAddReport}
		} = this;

		const classnames = getCN(CLASSNAME, className, {
			'analytics-add-report-empty-dashboard': isEmptyDashboard
		});

		return (
			<Card className={classnames}>
				{!showFormAddReport
					? this.renderAddButton()
					: this.renderCardAddReport()}
			</Card>
		);
	}
}

export default AddReport;
