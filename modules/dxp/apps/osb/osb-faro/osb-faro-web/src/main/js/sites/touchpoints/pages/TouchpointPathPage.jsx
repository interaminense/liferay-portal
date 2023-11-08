import Card from 'shared/components/Card';
import React from 'react';
import {NewSankey} from 'sites/touchpoints/components/sankey/NewSankey';
import {PropTypes} from 'prop-types';

export default function TouchpointPathPage() {
	return (
		<div className='row'>
			<div className='analytics-sankey-column col-sm-12'>
				<Card>
					<Card.Header>
						<Card.Title>
							{Liferay.Language.get('path-analysis')}
						</Card.Title>
					</Card.Header>
					<Card.Body className='d-flex align-items-center justify-content-center'>
						<NewSankey />
					</Card.Body>
				</Card>
			</div>
		</div>
	);
}
TouchpointPathPage.propTypes = {
	pathRangeKey: PropTypes.string
};
