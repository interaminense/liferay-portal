package com.liferay.data.engine.internal.expando.model;

import com.liferay.data.engine.nativeobject.DataEngineNativeObject;

import org.osgi.service.component.annotations.Component;

@Component(immediate = true, service = DataEngineNativeObject.class)
public class Teste implements DataEngineNativeObject {

	@Override
	public String getClassName() {
		return Teste.class.getName();
	}

	@Override
	public String getName() {
		return Teste.class.getSimpleName();
	}

}