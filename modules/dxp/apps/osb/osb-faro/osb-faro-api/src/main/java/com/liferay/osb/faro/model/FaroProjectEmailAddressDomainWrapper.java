/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 *
 *
 *
 */

package com.liferay.osb.faro.model;

import com.liferay.expando.kernel.model.ExpandoBridge;
import com.liferay.portal.kernel.model.ModelWrapper;
import com.liferay.portal.kernel.model.wrapper.BaseModelWrapper;
import com.liferay.portal.kernel.service.ServiceContext;

import java.io.Serializable;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * <p>
 * This class is a wrapper for {@link FaroProjectEmailAddressDomain}.
 * </p>
 *
 * @author Matthew Kong
 * @see FaroProjectEmailAddressDomain
 * @generated
 */
public class FaroProjectEmailAddressDomainWrapper extends BaseModelWrapper<FaroProjectEmailAddressDomain>
	implements FaroProjectEmailAddressDomain,
			   ModelWrapper<FaroProjectEmailAddressDomain> {

	public FaroProjectEmailAddressDomainWrapper(
		FaroProjectEmailAddressDomain faroProjectEmailAddressDomain) {

		super(faroProjectEmailAddressDomain);
	}

	@Override
	public Class<?> getModelClass() {
		return FaroProjectEmailAddressDomain.class;
	}

	@Override
	public String getModelClassName() {
		return FaroProjectEmailAddressDomain.class.getName();
	}

	@Override
	public Map<String, Object> getModelAttributes() {
		Map<String, Object> attributes = new HashMap<String, Object>();

		attributes.put(
			"faroProjectEmailAddressDomainId",
			getFaroProjectEmailAddressDomainId());
		attributes.put("groupId", getGroupId());
		attributes.put("faroProjectId", getFaroProjectId());
		attributes.put("emailAddressDomain", getEmailAddressDomain());

		return attributes;
	}

	@Override
	public void setModelAttributes(Map<String, Object> attributes) {
		Long faroProjectEmailAddressDomainId = (Long)attributes.get(
			"faroProjectEmailAddressDomainId");

		if (faroProjectEmailAddressDomainId != null) {
			setFaroProjectEmailAddressDomainId(faroProjectEmailAddressDomainId);
		}

		Long groupId = (Long)attributes.get("groupId");

		if (groupId != null) {
			setGroupId(groupId);
		}

		Long faroProjectId = (Long)attributes.get("faroProjectId");

		if (faroProjectId != null) {
			setFaroProjectId(faroProjectId);
		}

		String emailAddressDomain = (String)attributes.get(
			"emailAddressDomain");

		if (emailAddressDomain != null) {
			setEmailAddressDomain(emailAddressDomain);
		}
	}

	@Override
	public Object clone() {
		return new FaroProjectEmailAddressDomainWrapper(
			(FaroProjectEmailAddressDomain)
				model.clone());
	}

	@Override
	public FaroProjectEmailAddressDomain cloneWithOriginalValues() {
		return wrap(model.cloneWithOriginalValues());
	}

	@Override
	public int compareTo(
		FaroProjectEmailAddressDomain faroProjectEmailAddressDomain) {

		return model.compareTo(
			faroProjectEmailAddressDomain);
	}

	/**
	 * Returns the email address domain of this faro project email address domain.
	 *
	 * @return the email address domain of this faro project email address domain
	 */
	@Override
	public String getEmailAddressDomain() {
		return model.getEmailAddressDomain();
	}

	@Override
	public ExpandoBridge getExpandoBridge() {
		return model.getExpandoBridge();
	}

	/**
	 * Returns the faro project email address domain ID of this faro project email address domain.
	 *
	 * @return the faro project email address domain ID of this faro project email address domain
	 */
	@Override
	public long getFaroProjectEmailAddressDomainId() {
		return model.
			getFaroProjectEmailAddressDomainId();
	}

	/**
	 * Returns the faro project ID of this faro project email address domain.
	 *
	 * @return the faro project ID of this faro project email address domain
	 */
	@Override
	public long getFaroProjectId() {
		return model.getFaroProjectId();
	}

	/**
	 * Returns the group ID of this faro project email address domain.
	 *
	 * @return the group ID of this faro project email address domain
	 */
	@Override
	public long getGroupId() {
		return model.getGroupId();
	}

	/**
	 * Returns the primary key of this faro project email address domain.
	 *
	 * @return the primary key of this faro project email address domain
	 */
	@Override
	public long getPrimaryKey() {
		return model.getPrimaryKey();
	}

	@Override
	public Serializable getPrimaryKeyObj() {
		return model.getPrimaryKeyObj();
	}

	@Override
	public int hashCode() {
		return model.hashCode();
	}

	@Override
	public boolean isCachedModel() {
		return model.isCachedModel();
	}

	@Override
	public boolean isEscapedModel() {
		return model.isEscapedModel();
	}

	@Override
	public boolean isNew() {
		return model.isNew();
	}

	@Override
	public void persist() {
		model.persist();
	}

	@Override
	public void setCachedModel(boolean cachedModel) {
		model.setCachedModel(cachedModel);
	}

	/**
	 * Sets the email address domain of this faro project email address domain.
	 *
	 * @param emailAddressDomain the email address domain of this faro project email address domain
	 */
	@Override
	public void setEmailAddressDomain(String emailAddressDomain) {
		model.setEmailAddressDomain(
			emailAddressDomain);
	}

	@Override
	public void setExpandoBridgeAttributes(
		com.liferay.portal.kernel.model.BaseModel<?> baseModel) {

		model.setExpandoBridgeAttributes(baseModel);
	}

	@Override
	public void setExpandoBridgeAttributes(ExpandoBridge expandoBridge) {
		model.setExpandoBridgeAttributes(
			expandoBridge);
	}

	@Override
	public void setExpandoBridgeAttributes(ServiceContext serviceContext) {
		model.setExpandoBridgeAttributes(
			serviceContext);
	}

	/**
	 * Sets the faro project email address domain ID of this faro project email address domain.
	 *
	 * @param faroProjectEmailAddressDomainId the faro project email address domain ID of this faro project email address domain
	 */
	@Override
	public void setFaroProjectEmailAddressDomainId(
		long faroProjectEmailAddressDomainId) {

		model.setFaroProjectEmailAddressDomainId(
			faroProjectEmailAddressDomainId);
	}

	/**
	 * Sets the faro project ID of this faro project email address domain.
	 *
	 * @param faroProjectId the faro project ID of this faro project email address domain
	 */
	@Override
	public void setFaroProjectId(long faroProjectId) {
		model.setFaroProjectId(faroProjectId);
	}

	/**
	 * Sets the group ID of this faro project email address domain.
	 *
	 * @param groupId the group ID of this faro project email address domain
	 */
	@Override
	public void setGroupId(long groupId) {
		model.setGroupId(groupId);
	}

	@Override
	public void setNew(boolean n) {
		model.setNew(n);
	}

	/**
	 * Sets the primary key of this faro project email address domain.
	 *
	 * @param primaryKey the primary key of this faro project email address domain
	 */
	@Override
	public void setPrimaryKey(long primaryKey) {
		model.setPrimaryKey(primaryKey);
	}

	@Override
	public void setPrimaryKeyObj(Serializable primaryKeyObj) {
		model.setPrimaryKeyObj(primaryKeyObj);
	}

	@Override
	public com.liferay.portal.kernel.model.CacheModel
		<FaroProjectEmailAddressDomain> toCacheModel() {

		return model.toCacheModel();
	}

	@Override
	public FaroProjectEmailAddressDomain toEscapedModel() {
		return new FaroProjectEmailAddressDomainWrapper(
			model.toEscapedModel());
	}

	@Override
	public String toString() {
		return model.toString();
	}

	@Override
	public FaroProjectEmailAddressDomain toUnescapedModel() {
		return new FaroProjectEmailAddressDomainWrapper(
			model.toUnescapedModel());
	}

	@Override
	protected FaroProjectEmailAddressDomainWrapper wrap(FaroProjectEmailAddressDomain faroProjectEmailAddressDomain) {
		return new FaroProjectEmailAddressDomainWrapper(faroProjectEmailAddressDomain);
	}

	@Override
	public String toXmlString() {
		return model.toXmlString();
	}

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof FaroProjectEmailAddressDomainWrapper)) {
			return false;
		}

		FaroProjectEmailAddressDomainWrapper
			faroProjectEmailAddressDomainWrapper =
				(FaroProjectEmailAddressDomainWrapper)object;

		if (Objects.equals(
				model,
				faroProjectEmailAddressDomainWrapper.
					model)) {

			return true;
		}

		return false;
	}

	@Override
	public FaroProjectEmailAddressDomain getWrappedModel() {
		return model;
	}

	@Override
	public boolean isEntityCacheEnabled() {
		return model.isEntityCacheEnabled();
	}

	@Override
	public boolean isFinderCacheEnabled() {
		return model.isFinderCacheEnabled();
	}

	@Override
	public void resetOriginalValues() {
		model.resetOriginalValues();
	}


}