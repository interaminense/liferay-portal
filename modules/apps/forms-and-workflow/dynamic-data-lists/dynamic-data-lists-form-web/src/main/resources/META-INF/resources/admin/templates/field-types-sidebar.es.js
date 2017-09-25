import Component from 'metal-component';
import Soy from 'metal-soy';

import templates from './field-types-sidebar.soy';

let FieldTypesSidebarTemplates = [];

for (let template in templates) {
	if (template !== 'templates') {
		class C extends Component {};
		Soy.register(C, templates, template);
		FieldTypesSidebarTemplates.push({
			key: template,
			component: C
		});
	}
}

export default FieldTypesSidebarTemplates;