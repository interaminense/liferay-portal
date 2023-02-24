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
 * This class is a wrapper for {@link FaroPreferences}.
 * </p>
 *
 * @author Matthew Kong
 * @see FaroPreferences
 * @generated
 */
public class FaroPreferencesWrapper  extends BaseModelWrapper<FaroPreferences>
	implements FaroPreferences, ModelWrapper<FaroPreferences> {

	public FaroPreferencesWrapper(FaroPreferences faroPreferences) {
super(faroPreferences);	}

	@Override
	public Class<?> getModelClass() {
		return FaroPreferences.class;
	}

	@Override
	public String getModelClassName() {
		return FaroPreferences.class.getName();
	}

	@Override
	public Map<String, Object> getModelAttributes() {
		Map<String, Object> attributes = new HashMap<String, Object>();

		attributes.put("faroPreferencesId", getFaroPreferencesId());
		attributes.put("groupId", getGroupId());
		attributes.put("userId", getUserId());
		attributes.put("userName", getUserName());
		attributes.put("createTime", getCreateTime());
		attributes.put("modifiedTime", getModifiedTime());
		attributes.put("ownerId", getOwnerId());
		attributes.put("preferences", getPreferences());

		return attributes;
	}

	@Override
	public void setModelAttributes(Map<String, Object> attributes) {
		Long faroPreferencesId = (Long)attributes.get("faroPreferencesId");

		if (faroPreferencesId != null) {
			setFaroPreferencesId(faroPreferencesId);
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

		Long ownerId = (Long)attributes.get("ownerId");

		if (ownerId != null) {
			setOwnerId(ownerId);
		}

		String preferences = (String)attributes.get("preferences");

		if (preferences != null) {
			setPreferences(preferences);
		}
	}

	@Override
	public Object clone() {
		return new FaroPreferencesWrapper(
			(FaroPreferences)model.clone());
	}

	@Override
	public FaroPreferences
	cloneWithOriginalValues() {
		return wrap(model.cloneWithOriginalValues());
	}

	@Override
	public int compareTo(FaroPreferences faroPreferences) {
		return model.compareTo(faroPreferences);
	}

	/**
	 * Returns the create time of this faro preferences.
	 *
	 * @return the create time of this faro preferences
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
	 * Returns the faro preferences ID of this faro preferences.
	 *
	 * @return the faro preferences ID of this faro preferences
	 */
	@Override
	public long getFaroPreferencesId() {
		return model.getFaroPreferencesId();
	}

	/**
	 * Returns the group ID of this faro preferences.
	 *
	 * @return the group ID of this faro preferences
	 */
	@Override
	public long getGroupId() {
		return model.getGroupId();
	}

	/**
	 * Returns the modified time of this faro preferences.
	 *
	 * @return the modified time of this faro preferences
	 */
	@Override
	public long getModifiedTime() {
		return model.getModifiedTime();
	}

	/**
	 * Returns the owner ID of this faro preferences.
	 *
	 * @return the owner ID of this faro preferences
	 */
	@Override
	public long getOwnerId() {
		return model.getOwnerId();
	}

	/**
	 * Returns the preferences of this faro preferences.
	 *
	 * @return the preferences of this faro preferences
	 */
	@Override
	public String getPreferences() {
		return model.getPreferences();
	}

	/**
	 * Returns the primary key of this faro preferences.
	 *
	 * @return the primary key of this faro preferences
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
	 * Returns the user ID of this faro preferences.
	 *
	 * @return the user ID of this faro preferences
	 */
	@Override
	public long getUserId() {
		return model.getUserId();
	}

	/**
	 * Returns the user name of this faro preferences.
	 *
	 * @return the user name of this faro preferences
	 */
	@Override
	public String getUserName() {
		return model.getUserName();
	}

	/**
	 * Returns the user uuid of this faro preferences.
	 *
	 * @return the user uuid of this faro preferences
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
	 * Sets the create time of this faro preferences.
	 *
	 * @param createTime the create time of this faro preferences
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
	 * Sets the faro preferences ID of this faro preferences.
	 *
	 * @param faroPreferencesId the faro preferences ID of this faro preferences
	 */
	@Override
	public void setFaroPreferencesId(long faroPreferencesId) {
		model.setFaroPreferencesId(faroPreferencesId);
	}

	/**
	 * Sets the group ID of this faro preferences.
	 *
	 * @param groupId the group ID of this faro preferences
	 */
	@Override
	public void setGroupId(long groupId) {
		model.setGroupId(groupId);
	}

	/**
	 * Sets the modified time of this faro preferences.
	 *
	 * @param modifiedTime the modified time of this faro preferences
	 */
	@Override
	public void setModifiedTime(long modifiedTime) {
		model.setModifiedTime(modifiedTime);
	}

	@Override
	public void setNew(boolean n) {
		model.setNew(n);
	}

	/**
	 * Sets the owner ID of this faro preferences.
	 *
	 * @param ownerId the owner ID of this faro preferences
	 */
	@Override
	public void setOwnerId(long ownerId) {
		model.setOwnerId(ownerId);
	}

	/**
	 * Sets the preferences of this faro preferences.
	 *
	 * @param preferences the preferences of this faro preferences
	 */
	@Override
	public void setPreferences(String preferences) {
		model.setPreferences(preferences);
	}

	/**
	 * Sets the primary key of this faro preferences.
	 *
	 * @param primaryKey the primary key of this faro preferences
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
	 * Sets the user ID of this faro preferences.
	 *
	 * @param userId the user ID of this faro preferences
	 */
	@Override
	public void setUserId(long userId) {
		model.setUserId(userId);
	}

	/**
	 * Sets the user name of this faro preferences.
	 *
	 * @param userName the user name of this faro preferences
	 */
	@Override
	public void setUserName(String userName) {
		model.setUserName(userName);
	}

	/**
	 * Sets the user uuid of this faro preferences.
	 *
	 * @param userUuid the user uuid of this faro preferences
	 */
	@Override
	public void setUserUuid(String userUuid) {
		model.setUserUuid(userUuid);
	}

	@Override
	public com.liferay.portal.kernel.model.CacheModel<FaroPreferences>
		toCacheModel() {

		return model.toCacheModel();
	}

	@Override
	public FaroPreferences toEscapedModel() {
		return new FaroPreferencesWrapper(model.toEscapedModel());
	}

	@Override
	public String toString() {
		return model.toString();
	}

	@Override
	public FaroPreferences toUnescapedModel() {
		return new FaroPreferencesWrapper(model.toUnescapedModel());
	}

	@Override
	protected FaroPreferencesWrapper wrap(FaroPreferences faroPreferences) {
		return new FaroPreferencesWrapper(faroPreferences);
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

		if (!(object instanceof FaroPreferencesWrapper)) {
			return false;
		}

		FaroPreferencesWrapper faroPreferencesWrapper =
			(FaroPreferencesWrapper)object;

		if (Objects.equals(
				model, faroPreferencesWrapper.model)) {

			return true;
		}

		return false;
	}

	@Override
	public FaroPreferences getWrappedModel() {
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