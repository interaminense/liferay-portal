import moment from 'moment';
import {cleanup} from '@testing-library/react';
import {formatDate} from '../utils';

describe('formatDate', () => {
	afterEach(cleanup);

	it('returns formatted date for PDF document', () => {
		expect(formatDate(moment(0))).toBe('1970-01-01');
	});
});
