/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.portal.security.sso.openid.connect.internal;

import com.liferay.petra.string.StringBundler;
import com.liferay.portal.configuration.metatype.bnd.util.ConfigurableUtil;
import com.liferay.portal.kernel.model.CompanyConstants;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.security.sso.openid.connect.OpenIdConnectProvider;
import com.liferay.portal.security.sso.openid.connect.OpenIdConnectProviderRegistry;
import com.liferay.portal.security.sso.openid.connect.OpenIdConnectServiceException;
import com.liferay.portal.security.sso.openid.connect.internal.configuration.OpenIdConnectProviderConfiguration;

import com.nimbusds.openid.connect.sdk.op.OIDCProviderMetadata;
import com.nimbusds.openid.connect.sdk.rp.OIDCClientMetadata;

import java.net.URL;

import java.util.Collection;
import java.util.Collections;
import java.util.Dictionary;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.osgi.framework.Constants;
import org.osgi.service.cm.ConfigurationException;
import org.osgi.service.cm.ManagedServiceFactory;
import org.osgi.service.component.annotations.Component;

/**
 * @author Thuong Dinh
 * @author Edward C. Han
 */
@Component(
	immediate = true,
	property = Constants.SERVICE_PID + "=com.liferay.portal.security.sso.openid.connect.internal.configuration.OpenIdConnectProviderConfiguration",
	service = {ManagedServiceFactory.class, OpenIdConnectProviderRegistry.class}
)
public class OpenIdConnectProviderRegistryImpl
	implements ManagedServiceFactory,
			   OpenIdConnectProviderRegistry
				   <OIDCClientMetadata, OIDCProviderMetadata> {

	@Override
	public void deleted(String pid) {
		removeOpenConnectIdProvider(pid);
	}

	@Override
	public OpenIdConnectProvider<OIDCClientMetadata, OIDCProviderMetadata>
			findOpenIdConnectProvider(long companyId, String name)
		throws OpenIdConnectServiceException.ProviderException {

		OpenIdConnectProvider<OIDCClientMetadata, OIDCProviderMetadata>
			openIdConnectProvider = getOpenIdConnectProvider(companyId, name);

		if (openIdConnectProvider == null) {
			throw new OpenIdConnectServiceException.ProviderException(
				"Unable to find an OpenId Connect provider with name " + name);
		}

		return openIdConnectProvider;
	}

	@Override
	public String getName() {
		return "OpenId Connect Provider Factory";
	}

	@Override
	public OpenIdConnectProvider<OIDCClientMetadata, OIDCProviderMetadata>
		getOpenIdConnectProvider(long companyId, String name) {

		return _getOpenIdConnectProvidersStream(
			companyId
		).filter(
			openIdConnectProvider -> name.equals(
				openIdConnectProvider.getName())
		).findFirst(
		).orElse(
			null
		);
	}

	@Override
	public Collection<String> getOpenIdConnectProviderNames(long companyId) {
		/*This access is not synchronized and can produce
		 ConcurrentModificationException*/

		return _openIdConnectProviderNames.computeIfAbsent(
			companyId, this::_getOpenIdConnectProviderNames);
	}

	@Override
	public void updated(String pid, Dictionary<String, ?> properties)
		throws ConfigurationException {

		addOpenConnectIdConnectProvider(
			GetterUtil.getLong(properties.get("companyId")), pid,
			createOpenIdConnectProvider(
				ConfigurableUtil.createConfigurable(
					OpenIdConnectProviderConfiguration.class, properties)));
	}

	protected void addOpenConnectIdConnectProvider(
		long companyId, String pid,
		OpenIdConnectProvider<OIDCClientMetadata, OIDCProviderMetadata>
			openIdConnectProvider) {

		_openIdConnectProviders.compute(
			pid,
			(oldPid, oldOpenIdConnectProvider) -> {
				if (oldOpenIdConnectProvider != null) {
					for (Set<String> pids : _companyIdPidMapping.values()) {
						if (pids.remove(pid)) {
							break;
						}
					}
				}

				Set<String> pids = _companyIdPidMapping.computeIfAbsent(
					companyId, cid -> new CopyOnWriteArraySet<>());

				pids.add(pid);

				_openIdConnectProviderNames.clear();

				return openIdConnectProvider;
			});
	}

	protected OpenIdConnectProvider<OIDCClientMetadata, OIDCProviderMetadata>
			createOpenIdConnectProvider(
				OpenIdConnectProviderConfiguration
					openIdConnectProviderConfiguration)
		throws ConfigurationException {

		OpenIdConnectMetadataFactory openIdConnectMetadataFactory = null;

		try {
			if (Validator.isNotNull(
					openIdConnectProviderConfiguration.discoveryEndPoint())) {

				openIdConnectMetadataFactory =
					new OpenIdConnectMetadataFactoryImpl(
						openIdConnectProviderConfiguration.providerName(),
						new URL(
							openIdConnectProviderConfiguration.
								discoveryEndPoint()),
						openIdConnectProviderConfiguration.
							discoveryEndPointCacheInMillis());
			}
			else {
				openIdConnectMetadataFactory =
					new OpenIdConnectMetadataFactoryImpl(
						openIdConnectProviderConfiguration.providerName(),
						openIdConnectProviderConfiguration.
							idTokenSigningAlgValues(),
						openIdConnectProviderConfiguration.issuerURL(),
						openIdConnectProviderConfiguration.subjectTypes(),
						openIdConnectProviderConfiguration.jwksURI(),
						openIdConnectProviderConfiguration.
							authorizationEndPoint(),
						openIdConnectProviderConfiguration.tokenEndPoint(),
						openIdConnectProviderConfiguration.userInfoEndPoint());
			}
		}
		catch (Exception exception) {
			throw new ConfigurationException(
				null,
				StringBundler.concat(
					"Unable to instantiate provider metadata factory for ",
					openIdConnectProviderConfiguration.providerName(), ": ",
					exception.getMessage()),
				exception);
		}

		return new OpenIdConnectProviderImpl(
			openIdConnectProviderConfiguration.providerName(),
			openIdConnectProviderConfiguration.openIdConnectClientId(),
			openIdConnectProviderConfiguration.openIdConnectClientSecret(),
			openIdConnectProviderConfiguration.scopes(),
			openIdConnectMetadataFactory);
	}

	protected void removeOpenConnectIdProvider(String pid) {
		_openIdConnectProviders.compute(
			pid,
			(oldPid, oldOpenIdConnectProvider) -> {
				if (oldOpenIdConnectProvider != null) {
					for (Set<String> pids : _companyIdPidMapping.values()) {
						if (pids.remove(pid)) {
							break;
						}
					}

					_openIdConnectProviderNames.clear();
				}

				return null;
			});
	}

	private List<String> _getOpenIdConnectProviderNames(long companyId) {
		return Collections.unmodifiableList(
			_getOpenIdConnectProvidersStream(
				companyId
			).map(
				OpenIdConnectProvider::getName
			).distinct(
			).sorted(
			).collect(
				Collectors.toList()
			));
	}

	private Stream
		<OpenIdConnectProvider<OIDCClientMetadata, OIDCProviderMetadata>>
			_getOpenIdConnectProvidersStream(long companyId) {

		return _getStream(
			_companyIdPidMapping.get(companyId),
			_companyIdPidMapping.get(CompanyConstants.SYSTEM)
		).map(
			_openIdConnectProviders::get
		);
	}

	private <T> Stream<T> _getStream(Set<T> set1, Set<T> set2) {
		if ((set1 != null) && (set2 != null)) {
			return Stream.concat(set1.stream(), set2.stream());
		}
		else if (set1 != null) {
			return set1.stream();
		}
		else if (set2 != null) {
			return set2.stream();
		}
		else {
			return Stream.empty();
		}
	}

	private final Map<Long, CopyOnWriteArraySet<String>> _companyIdPidMapping =
		new ConcurrentHashMap<>();
	private final Map<Long, List<String>> _openIdConnectProviderNames =
		new ConcurrentHashMap<>();
	private final Map
		<String,
		 OpenIdConnectProvider<OIDCClientMetadata, OIDCProviderMetadata>>
			_openIdConnectProviders = new ConcurrentHashMap<>();

}