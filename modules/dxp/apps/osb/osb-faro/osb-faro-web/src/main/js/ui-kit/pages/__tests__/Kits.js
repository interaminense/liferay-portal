import * as fs from 'fs';
import * as path from 'path';
import {cleanup} from '@testing-library/react';
import {renderWithStore} from 'test/mock-store';

describe('Kits', () => {
	afterEach(cleanup);

	let component;

	const files = fs
		.readdirSync(path.resolve(__dirname, '..'))
		.filter(file => file.match(/Kit.jsx$/));

	afterEach(() => {
		if (component) {
			component.unmount();
		}
	});

	files.forEach(file => {
		const kitName = file.replace('.js', '');

		describe(kitName, () => {
			afterEach(cleanup);

			const Kit = require(`../${file}`).default;

			it('should render', () => {
				component = renderWithStore(Kit, {groupId: '23'});

				expect(component).toBeTruthy();
			});
		});
	});
});
