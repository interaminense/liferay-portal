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

import com.liferay.portal.kernel.model.ModelWrapper;
import com.liferay.portal.kernel.model.wrapper.BaseModelWrapper;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * This class is a wrapper for {@link FaroProjectEmailAddressDomain}.
 * </p>
 *
 * @author Matthew Kong
 * @see FaroProjectEmailAddressDomain
 * @generated
 */
public class FaroProjectEmailAddressDomainWrapper
	extends BaseModelWrapper<FaroProjectEmailAddressDomain>
	implements FaroProjectEmailAddressDomain,
			   ModelWrapper<FaroProjectEmailAddressDomain> {

	public FaroProjectEmailAddressDomainWrapper(
		FaroProjectEmailAddressDomain faroProjectEmailAddressDomain) {

		super(faroProjectEmailAddressDomain);
	}

	@Override
	public Map<String, Object> getModelAttributes() {
		Map<String, Object> attributes = new HashMap<String, Object>();

		attributes.put("mvccVersion", getMvccVersion());
		attributes.put(
			"faroProjectEmailAddressDomainId",
			getFaroProjectEmailAddressDomainId());
		attributes.put("groupId", getGroupId());
		attributes.put("companyId", getCompanyId());
		attributes.put("faroProjectId", getFaroProjectId());
		attributes.put("emailAddressDomain", getEmailAddressDomain());

		return attributes;
	}

	@Override
	public void setModelAttributes(Map<String, Object> attributes) {
		Long mvccVersion = (Long)attributes.get("mvccVersion");

		if (mvccVersion != null) {
			setMvccVersion(mvccVersion);
		}

		Long faroProjectEmailAddressDomainId = (Long)attributes.get(
			"faroProjectEmailAddressDomainId");

		if (faroProjectEmailAddressDomainId != null) {
			setFaroProjectEmailAddressDomainId(faroProjectEmailAddressDomainId);
		}

		Long groupId = (Long)attributes.get("groupId");

		if (groupId != null) {
			setGroupId(groupId);
		}

		Long companyId = (Long)attributes.get("companyId");

		if (companyId != null) {
			setCompanyId(companyId);
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
	public FaroProjectEmailAddressDomain cloneWithOriginalValues() {
		return wrap(model.cloneWithOriginalValues());
	}

	/**
	 * Returns the company ID of this faro project email address domain.
	 *
	 * @return the company ID of this faro project email address domain
	 */
	@Override
	public long getCompanyId() {
		return model.getCompanyId();
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

	/**
	 * Returns the faro project email address domain ID of this faro project email address domain.
	 *
	 * @return the faro project email address domain ID of this faro project email address domain
	 */
	@Override
	public long getFaroProjectEmailAddressDomainId() {
		return model.getFaroProjectEmailAddressDomainId();
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
	 * Returns the mvcc version of this faro project email address domain.
	 *
	 * @return the mvcc version of this faro project email address domain
	 */
	@Override
	public long getMvccVersion() {
		return model.getMvccVersion();
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
	public void persist() {
		model.persist();
	}

	/**
	 * Sets the company ID of this faro project email address domain.
	 *
	 * @param companyId the company ID of this faro project email address domain
	 */
	@Override
	public void setCompanyId(long companyId) {
		model.setCompanyId(companyId);
	}

	/**
	 * Sets the email address domain of this faro project email address domain.
	 *
	 * @param emailAddressDomain the email address domain of this faro project email address domain
	 */
	@Override
	public void setEmailAddressDomain(String emailAddressDomain) {
		model.setEmailAddressDomain(emailAddressDomain);
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

	/**
	 * Sets the mvcc version of this faro project email address domain.
	 *
	 * @param mvccVersion the mvcc version of this faro project email address domain
	 */
	@Override
	public void setMvccVersion(long mvccVersion) {
		model.setMvccVersion(mvccVersion);
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
	public String toXmlString() {
		return model.toXmlString();
	}

	@Override
	protected FaroProjectEmailAddressDomainWrapper wrap(
		FaroProjectEmailAddressDomain faroProjectEmailAddressDomain) {

		return new FaroProjectEmailAddressDomainWrapper(
			faroProjectEmailAddressDomain);
	}

}