AUI.add(
	'liferay-ddl-form-builder-field-types-toolbar',
	function(A) {
		var FormBuilderFieldTypesToolbar = A.Component.create(
			{
				ATTRS: {
					context: {
						getter: 'getTemplateContext'
					}
				},

				NAME: 'liferay-ddl-form-builder-field-types-toolbar',

				prototype: {
					initializer: function() {
						var instance = this;

						instance._eventHandlers = [
							instance.after('elementChange', A.bind('_bindUI', instance))
						];

						if (instance.get('element')) {
							instance._bindUI();
						}
					},

					destructor: function() {
						var instance = this;

						(new A.EventHandle(instance._eventHandlers)).detach();
					},

					getTemplate: function() {
						var instance = this;

						var renderer = instance.getTemplateRenderer();

						var container = document.createDocumentFragment();

						new renderer(instance.getTemplateContext(), container);

						return container.firstChild.outerHTML;
					},

					getTemplateContext: function() {
						var instance = this;

						return {

						};
					},

					getTemplateRenderer: function() {
						return AObject.getValue(window, ['DDLFieldTypesToolbar', 'render']);
					},

					_bindUI: function() {
						var instance = this;

						var element = instance.get('element');

						if (instance.get('element')) {
							instance._eventHandlers.push(element.delegate('click', A.bind('_onToolbaItemClick', instance), '.dropdown-menu a'));
						}
					},

					_onToolbaItemClick: function(event) {
						event.preventDefault();

						var instance = this;

						var target = event.currentTarget;
					}
				}
			}
		);

		Liferay.namespace('DDL').FormBuilderFieldTypesToolbar = FormBuilderFieldTypesToolbar;
	},
	'',
	{
		requires: ['liferay-ddl-form-builder-field-types-toolbar-template']
	}
);