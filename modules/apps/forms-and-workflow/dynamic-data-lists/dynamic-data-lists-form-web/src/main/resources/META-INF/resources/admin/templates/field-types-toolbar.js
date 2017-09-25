Liferay.Loader.require(
	'frontend-js-metal-web/metal-soy-bundle/build/bundle',
	'dynamic-data-lists-form-web/admin/templates/field-types-toolbar.es',
	function(MetalSoyBundle, DDLFieldTypesToolbar) {
		if (!window.DDLFieldTypesToolbar) {
			window.DDLFieldTypesToolbar = {};
		}

		DDLFieldTypesToolbar.default.forEach(function(item) {
			window.DDLFieldTypesToolbar[item.key] = item.component;
		});

		AUI.add('liferay-ddl-form-builder-field-types-toolbar-template');
	}
);