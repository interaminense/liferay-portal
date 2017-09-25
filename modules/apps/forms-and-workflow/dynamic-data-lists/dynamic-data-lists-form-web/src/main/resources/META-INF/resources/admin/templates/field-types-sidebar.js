Liferay.Loader.require(
	'frontend-js-metal-web/metal-soy-bundle/build/bundle',
	'dynamic-data-lists-form-web/admin/templates/field-types-sidebar.es',
	function(MetalSoyBundle, DDLFieldTypesSidebar) {
		if (!window.DDLFieldTypesSidebar) {
			window.DDLFieldTypesSidebar = {};
		}

		DDLFieldTypesSidebar.default.forEach(function(item) {
			window.DDLFieldTypesSidebar[item.key] = item.component;
		});

		AUI.add('liferay-ddl-form-builder-field-types-sidebar-template');
	}
);