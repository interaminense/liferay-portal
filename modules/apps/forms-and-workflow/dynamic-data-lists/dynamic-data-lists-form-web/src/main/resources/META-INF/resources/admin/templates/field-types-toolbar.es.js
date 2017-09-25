import Component from 'metal-component';
import Soy from 'metal-soy';

import templates from './field-types-toolbar.soy';

let FieldTypesToolbarTemplates = [];

for (let template in templates) {
	if (template !== 'templates') {
		class C extends Component {};
		Soy.register(C, templates, template);
		FieldTypesToolbarTemplates.push({
			key: template,
			component: C
		});
	}
}

export default FieldTypesToolbarTemplates;