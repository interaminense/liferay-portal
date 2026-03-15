import Table from 'shared/components/table';
import {
	compose,
	withNavigate,
	withPaginationBar,
	withToolbar
} from 'shared/hoc';
import {withEmpty} from 'cerebro-shared/hocs/utils';
import {withError, withLoading} from './util';

const ListComponent = compose<any>(
	withNavigate,
	withToolbar({legacyDropdownRangeKey: false}),
	withPaginationBar(),
	withLoading({spacer: true}),
	withError({page: false}),
	withEmpty()
)(Table);

export default ListComponent;
