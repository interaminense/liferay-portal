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

package com.liferay.osb.faro.contacts.model;

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
 * This class is a wrapper for {@link ContactsCardTemplate}.
 * </p>
 *
 * @author Shinn Lok
 * @see ContactsCardTemplate
 * @generated
 */
public class ContactsCardTemplateWrapper extends BaseModelWrapper<ContactsCardTemplate>
	implements ContactsCardTemplate, ModelWrapper<ContactsCardTemplate> {

	public ContactsCardTemplateWrapper(
		ContactsCardTemplate contactsCardTemplate) {

		super(contactsCardTemplate);
	}

	@Override
	public Class<?> getModelClass() {
		return ContactsCardTemplate.class;
	}

	@Override
	public String getModelClassName() {
		return ContactsCardTemplate.class.getName();
	}

	@Override
	public Map<String, Object> getModelAttributes() {
		Map<String, Object> attributes = new HashMap<String, Object>();

		attributes.put("contactsCardTemplateId", getContactsCardTemplateId());
		attributes.put("groupId", getGroupId());
		attributes.put("userId", getUserId());
		attributes.put("userName", getUserName());
		attributes.put("createTime", getCreateTime());
		attributes.put("modifiedTime", getModifiedTime());
		attributes.put("name", getName());
		attributes.put("settings", getSettings());
		attributes.put("type", getType());

		return attributes;
	}

	@Override
	public void setModelAttributes(Map<String, Object> attributes) {
		Long contactsCardTemplateId = (Long)attributes.get(
			"contactsCardTemplateId");

		if (contactsCardTemplateId != null) {
			setContactsCardTemplateId(contactsCardTemplateId);
		}

		Long groupId = (Long)attributes.get("groupId");

		if (groupId != null) {
			setGroupId(groupId);
		}

		Long userId = (Long)attributes.get("userId");

		if (userId != null) {
			setUserId(userId);
		}

		String userName = (String)attributes.get("userName");

		if (userName != null) {
			setUserName(userName);
		}

		Long createTime = (Long)attributes.get("createTime");

		if (createTime != null) {
			setCreateTime(createTime);
		}

		Long modifiedTime = (Long)attributes.get("modifiedTime");

		if (modifiedTime != null) {
			setModifiedTime(modifiedTime);
		}

		String name = (String)attributes.get("name");

		if (name != null) {
			setName(name);
		}

		String settings = (String)attributes.get("settings");

		if (settings != null) {
			setSettings(settings);
		}

		Integer type = (Integer)attributes.get("type");

		if (type != null) {
			setType(type);
		}
	}

	@Override
	public Object clone() {
		return new ContactsCardTemplateWrapper(
			(ContactsCardTemplate)model.clone());
	}

	@Override
	public ContactsCardTemplate cloneWithOriginalValues() {
		return wrap(model.cloneWithOriginalValues());
	}

	@Override
	public int compareTo(ContactsCardTemplate contactsCardTemplate) {
		return model.compareTo(contactsCardTemplate);
	}

	/**
	 * Returns the contacts card template ID of this contacts card template.
	 *
	 * @return the contacts card template ID of this contacts card template
	 */
	@Override
	public long getContactsCardTemplateId() {
		return model.getContactsCardTemplateId();
	}

	/**
	 * Returns the create time of this contacts card template.
	 *
	 * @return the create time of this contacts card template
	 */
	@Override
	public long getCreateTime() {
		return model.getCreateTime();
	}

	@Override
	public ExpandoBridge getExpandoBridge() {
		return model.getExpandoBridge();
	}

	/**
	 * Returns the group ID of this contacts card template.
	 *
	 * @return the group ID of this contacts card template
	 */
	@Override
	public long getGroupId() {
		return model.getGroupId();
	}

	/**
	 * Returns the modified time of this contacts card template.
	 *
	 * @return the modified time of this contacts card template
	 */
	@Override
	public long getModifiedTime() {
		return model.getModifiedTime();
	}

	/**
	 * Returns the name of this contacts card template.
	 *
	 * @return the name of this contacts card template
	 */
	@Override
	public String getName() {
		return model.getName();
	}

	/**
	 * Returns the primary key of this contacts card template.
	 *
	 * @return the primary key of this contacts card template
	 */
	@Override
	public long getPrimaryKey() {
		return model.getPrimaryKey();
	}

	@Override
	public Serializable getPrimaryKeyObj() {
		return model.getPrimaryKeyObj();
	}

	/**
	 * Returns the settings of this contacts card template.
	 *
	 * @return the settings of this contacts card template
	 */
	@Override
	public String getSettings() {
		return model.getSettings();
	}

	/**
	 * Returns the type of this contacts card template.
	 *
	 * @return the type of this contacts card template
	 */
	@Override
	public int getType() {
		return model.getType();
	}

	/**
	 * Returns the user ID of this contacts card template.
	 *
	 * @return the user ID of this contacts card template
	 */
	@Override
	public long getUserId() {
		return model.getUserId();
	}

	/**
	 * Returns the user name of this contacts card template.
	 *
	 * @return the user name of this contacts card template
	 */
	@Override
	public String getUserName() {
		return model.getUserName();
	}

	/**
	 * Returns the user uuid of this contacts card template.
	 *
	 * @return the user uuid of this contacts card template
	 */
	@Override
	public String getUserUuid() {
		return model.getUserUuid();
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
	 * Sets the contacts card template ID of this contacts card template.
	 *
	 * @param contactsCardTemplateId the contacts card template ID of this contacts card template
	 */
	@Override
	public void setContactsCardTemplateId(long contactsCardTemplateId) {
		model.setContactsCardTemplateId(contactsCardTemplateId);
	}

	/**
	 * Sets the create time of this contacts card template.
	 *
	 * @param createTime the create time of this contacts card template
	 */
	@Override
	public void setCreateTime(long createTime) {
		model.setCreateTime(createTime);
	}

	@Override
	public void setExpandoBridgeAttributes(
		com.liferay.portal.kernel.model.BaseModel<?> baseModel) {

		model.setExpandoBridgeAttributes(baseModel);
	}

	@Override
	public void setExpandoBridgeAttributes(ExpandoBridge expandoBridge) {
		model.setExpandoBridgeAttributes(expandoBridge);
	}

	@Override
	public void setExpandoBridgeAttributes(ServiceContext serviceContext) {
		model.setExpandoBridgeAttributes(serviceContext);
	}

	/**
	 * Sets the group ID of this contacts card template.
	 *
	 * @param groupId the group ID of this contacts card template
	 */
	@Override
	public void setGroupId(long groupId) {
		model.setGroupId(groupId);
	}

	/**
	 * Sets the modified time of this contacts card template.
	 *
	 * @param modifiedTime the modified time of this contacts card template
	 */
	@Override
	public void setModifiedTime(long modifiedTime) {
		model.setModifiedTime(modifiedTime);
	}

	/**
	 * Sets the name of this contacts card template.
	 *
	 * @param name the name of this contacts card template
	 */
	@Override
	public void setName(String name) {
		model.setName(name);
	}

	@Override
	public void setNew(boolean n) {
		model.setNew(n);
	}

	/**
	 * Sets the primary key of this contacts card template.
	 *
	 * @param primaryKey the primary key of this contacts card template
	 */
	@Override
	public void setPrimaryKey(long primaryKey) {
		model.setPrimaryKey(primaryKey);
	}

	@Override
	public void setPrimaryKeyObj(Serializable primaryKeyObj) {
		model.setPrimaryKeyObj(primaryKeyObj);
	}

	/**
	 * Sets the settings of this contacts card template.
	 *
	 * @param settings the settings of this contacts card template
	 */
	@Override
	public void setSettings(String settings) {
		model.setSettings(settings);
	}

	/**
	 * Sets the type of this contacts card template.
	 *
	 * @param type the type of this contacts card template
	 */
	@Override
	public void setType(int type) {
		model.setType(type);
	}

	/**
	 * Sets the user ID of this contacts card template.
	 *
	 * @param userId the user ID of this contacts card template
	 */
	@Override
	public void setUserId(long userId) {
		model.setUserId(userId);
	}

	/**
	 * Sets the user name of this contacts card template.
	 *
	 * @param userName the user name of this contacts card template
	 */
	@Override
	public void setUserName(String userName) {
		model.setUserName(userName);
	}

	/**
	 * Sets the user uuid of this contacts card template.
	 *
	 * @param userUuid the user uuid of this contacts card template
	 */
	@Override
	public void setUserUuid(String userUuid) {
		model.setUserUuid(userUuid);
	}

	@Override
	public com.liferay.portal.kernel.model.CacheModel<ContactsCardTemplate>
		toCacheModel() {

		return model.toCacheModel();
	}

	@Override
	public ContactsCardTemplate toEscapedModel() {
		return new ContactsCardTemplateWrapper(
			model.toEscapedModel());
	}

	@Override
	public String toString() {
		return model.toString();
	}

	@Override
	public ContactsCardTemplate toUnescapedModel() {
		return new ContactsCardTemplateWrapper(
			model.toUnescapedModel());
	}

	@Override
	protected ContactsCardTemplate wrap(ContactsCardTemplate contactsCardTemplate) {
		return new ContactsCardTemplateWrapper(contactsCardTemplate);
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

		if (!(object instanceof ContactsCardTemplateWrapper)) {
			return false;
		}

		ContactsCardTemplateWrapper contactsCardTemplateWrapper =
			(ContactsCardTemplateWrapper)object;

		if (Objects.equals(
				model,
				contactsCardTemplateWrapper.model)) {

			return true;
		}

		return false;
	}

	@Override
	public ContactsCardTemplate getWrappedModel() {
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