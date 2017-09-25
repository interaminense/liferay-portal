AUI.add(
	'liferay-ddl-form-builder-field-types-sidebar',
	function(A) {
		var AObject = A.Object;

		var CSS_PREFIX = A.getClassName('form', 'builder', 'field', 'types', 'sidebar');

		var FieldTypes = Liferay.DDM.Renderer.FieldTypes;

		var FormBuilderFieldTypesSidebar = A.Component.create(
			{
				ATTRS: {
					description: {
						value: ''
					},

					title: {
						value: ''
					},

					toolbar: {
						valueFn: '_createToolbar'
					}
				},

				CSS_PREFIX: CSS_PREFIX,

				EXTENDS: Liferay.DDL.FormBuilderSidebar,

				NAME: 'liferay-ddl-form-builder-field-types-sidebar',

				prototype: {
					initializer: function() {
						var instance = this;

					},

					destructor: function() {
						var instance = this;

						var toolbar = instance.get('toolbar');

						toolbar.destroy();

						(new A.EventHandle(instance._eventHandlers)).detach();
					},

					getTemplateContext: function() {
						var instance = this;

						var instance = this;

						var renderer = AObject.getValue(window, ['DDLFieldTypesSidebar', 'render']);

						var container = document.createDocumentFragment();

						new renderer(
							{
								bodyContent: instance.get('bodyContent')
							},
						container);

						var toolbar = instance.get('toolbar');

						return {
							bodyContent: container.firstChild.outerHTML,
							closeButtonIcon: Liferay.Util.getLexiconIconTpl('angle-right', 'icon-monospaced'),
							description: instance.get('description'),
							title: instance.get('title'),
							toolbarButtonIcon: Liferay.Util.getLexiconIconTpl('ellipsis-v', 'icon-monospaced')
						};
					},

					_createToolbar: function() {
						var instance = this;

						var toolbar = new Liferay.DDL.FormBuilderFieldTypesToolbar();

						return toolbar;
					}
				}
			}
		);

		Liferay.namespace('DDL').FormBuilderFieldTypesSidebar = FormBuilderFieldTypesSidebar;
	},
	'',
	{
		requires: ['aui-tabview', 'liferay-ddl-form-builder-sidebar', 'liferay-ddm-form-renderer-types', 'liferay-ddl-form-builder-field-types-sidebar-template', 'liferay-ddl-form-builder-field-types-toolbar-template']
	}
);