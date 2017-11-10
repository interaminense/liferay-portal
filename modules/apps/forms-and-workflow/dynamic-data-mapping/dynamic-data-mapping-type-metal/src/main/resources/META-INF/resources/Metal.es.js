import Component from 'metal-component';
import Soy from 'metal-soy';
import { Config } from 'metal-state';

import templates from './metal.soy';

import Ajax from 'metal-ajax';

/**
 * Metal Component
 */
class Metal extends Component {
	after(event, callback) {
		return this.on(event, callback);
	}

	loadSettingsForm() {
		const payload = {
			bcp47LanguageId: themeDisplay.getBCP47LanguageId(),
			portletNamespace: Liferay.DDM.Settings.portletNamespace,
			scopeGroupId: themeDisplay.getScopeGroupId(),
			type: this.type
		};
		const body = `?bcp47LanguageId=${payload.bcp47LanguageId}&portletNamespace=${payload.portletNamespace}&scopeGroupId=${payload.scopeGroupId}&type=${payload.type}`;
		return Ajax
			.request(Liferay.DDM.Settings.getFieldTypeSettingFormContextURL + body, 'GET', body)
			.then((request) => {
				this.settingsContext = JSON.parse(request.responseText);
				
				return this.createSettingsForm(this.settingsContext);
			});
	}

	generateFieldName() {
		return this.type + (new Date()).getTime();
	}

	isPersisted() {
		return false;
	}

	saveSettings() {
		Liferay.DDM.FormBuilderUtil.visitLayout(this.settingsContext.pages, (field) => {
			const name = field.fieldName;
			this[name] = field.value;
		});
		this.emit('field:saveSettings', {
			field: this
		});
	}

	createSettingsForm(context) {
		const builder = this.builder;

		return new Liferay.DDM.FormBuilderSettingsForm(
			{
				context: context,
				editMode: builder.isEditMode() || this.isPersisted(),
				evaluatorURL: Liferay.DDM.Settings.evaluatorURL,
				field: this,
				templateNamespace: 'ddm.settings_form'
			}
		);
	}

	set(attr, val) {
		this[attr] = val;
	}

	get(attr) {
		if (attr === 'content') {
			return this.element;
		}
		return this[attr];
	}
}

Metal.isMetal = true;

Metal.STATE = {
	name: Config.string().value('metal-name'),
	placeholder: Config.string().value('Metal.js'),
	type: Config.string().value('metal')
};

// Register component
Soy.register(Metal, templates, 'render');

Liferay.namespace('DDM.Field').Metal = Metal;

export default Metal;