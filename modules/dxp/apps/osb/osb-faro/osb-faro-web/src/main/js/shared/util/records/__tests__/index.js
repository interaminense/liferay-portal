import {Account, EntityLayout, Individual, Project, Segment} from '../index';
import {cleanup} from '@testing-library/react';

describe('Records', () => {
	afterEach(cleanup);

	it('should return an Account Record', () => {
		expect(new Account()).toMatchSnapshot();
	});

	it('should return an Individual Record', () => {
		expect(new Individual()).toMatchSnapshot();
	});

	it('should return a Segment Record', () => {
		expect(new Segment()).toMatchSnapshot();
	});

	it('should return an EntityLayout Record', () => {
		expect(new EntityLayout()).toMatchSnapshot();
	});

	it('should return a Project Record', () => {
		expect(new Project()).toMatchSnapshot();
	});
});
