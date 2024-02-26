import CustomAssetsListCard from '../hocs/CustomAssetsListCard';
import React from 'react';
import {useTimeZone} from 'shared/hooks/useTimeZone';

const CustomAssetsListPage = () => {
	const {timeZoneId} = useTimeZone();

	return (
		<div className='row'>
			<div className='col-sm-12'>
				<CustomAssetsListCard timeZoneId={timeZoneId} />
			</div>
		</div>
	);
};

export default CustomAssetsListPage;
