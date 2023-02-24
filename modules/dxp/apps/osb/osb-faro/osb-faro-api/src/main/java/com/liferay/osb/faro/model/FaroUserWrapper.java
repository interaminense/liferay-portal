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
 * This class is a wrapper for {@link FaroUser}.
 * </p>
 *
 * @author Matthew Kong
 * @see FaroUser
 * @generated
 */
public class FaroUserWrapper extends BaseModelWrapper<FaroUser> implements FaroUser, ModelWrapper<FaroUser> {

	public FaroUserWrapper(FaroUser faroUser) {
		super(faroUser);
	}

	@Override
	public Class<?> getModelClass() {
		return FaroUser.class;
	}

	@Override
	public String getModelClassName() {
		return FaroUser.class.getName();
	}

	@Override
	public Map<String, Object> getModelAttributes() {
		Map<String, Object> attributes = new HashMap<String, Object>();

		attributes.put("faroUserId", getFaroUserId());
		attributes.put("groupId", getGroupId());
		attributes.put("userId", getUserId());
		attributes.put("userName", getUserName());
		attributes.put("createTime", getCreateTime());
		attributes.put("modifiedTime", getModifiedTime());
		attributes.put("liveUserId", getLiveUserId());
		attributes.put("roleId", getRoleId());
		attributes.put("emailAddress", getEmailAddress());
		attributes.put("key", getKey());
		attributes.put("status", getStatus());

		return attributes;
	}

	@Override
	public void setModelAttributes(Map<String, Object> attributes) {
		Long faroUserId = (Long)attributes.get("faroUserId");

		if (faroUserId != null) {
			setFaroUserId(faroUserId);
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

		Long liveUserId = (Long)attributes.get("liveUserId");

		if (liveUserId != null) {
			setLiveUserId(liveUserId);
		}

		Long roleId = (Long)attributes.get("roleId");

		if (roleId != null) {
			setRoleId(roleId);
		}

		String emailAddress = (String)attributes.get("emailAddress");

		if (emailAddress != null) {
			setEmailAddress(emailAddress);
		}

		String key = (String)attributes.get("key");

		if (key != null) {
			setKey(key);
		}

		Integer status = (Integer)attributes.get("status");

		if (status != null) {
			setStatus(status);
		}
	}

	@Override
	public Object clone() {
		return new FaroUserWrapper((FaroUser)model.clone());
	}

	@Override
	public FaroUser cloneWithOriginalValues() {
		return wrap(model.cloneWithOriginalValues());
	}

	@Override
	public int compareTo(FaroUser faroUser) {
		return model.compareTo(faroUser);
	}

	/**
	 * Returns the create time of this faro user.
	 *
	 * @return the create time of this faro user
	 */
	@Override
	public long getCreateTime() {
		return model.getCreateTime();
	}

	/**
	 * Returns the email address of this faro user.
	 *
	 * @return the email address of this faro user
	 */
	@Override
	public String getEmailAddress() {
		return model.getEmailAddress();
	}

	@Override
	public ExpandoBridge getExpandoBridge() {
		return model.getExpandoBridge();
	}

	/**
	 * Returns the faro user ID of this faro user.
	 *
	 * @return the faro user ID of this faro user
	 */
	@Override
	public long getFaroUserId() {
		return model.getFaroUserId();
	}

	/**
	 * Returns the faro user uuid of this faro user.
	 *
	 * @return the faro user uuid of this faro user
	 */
	@Override
	public String getFaroUserUuid() {
		return model.getFaroUserUuid();
	}

	/**
	 * Returns the group ID of this faro user.
	 *
	 * @return the group ID of this faro user
	 */
	@Override
	public long getGroupId() {
		return model.getGroupId();
	}

	/**
	 * Returns the key of this faro user.
	 *
	 * @return the key of this faro user
	 */
	@Override
	public String getKey() {
		return model.getKey();
	}

	/**
	 * Returns the live user ID of this faro user.
	 *
	 * @return the live user ID of this faro user
	 */
	@Override
	public long getLiveUserId() {
		return model.getLiveUserId();
	}

	/**
	 * Returns the live user uuid of this faro user.
	 *
	 * @return the live user uuid of this faro user
	 */
	@Override
	public String getLiveUserUuid() {
		return model.getLiveUserUuid();
	}

	/**
	 * Returns the modified time of this faro user.
	 *
	 * @return the modified time of this faro user
	 */
	@Override
	public long getModifiedTime() {
		return model.getModifiedTime();
	}

	/**
	 * Returns the primary key of this faro user.
	 *
	 * @return the primary key of this faro user
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
	 * Returns the role ID of this faro user.
	 *
	 * @return the role ID of this faro user
	 */
	@Override
	public long getRoleId() {
		return model.getRoleId();
	}

	/**
	 * Returns the status of this faro user.
	 *
	 * @return the status of this faro user
	 */
	@Override
	public int getStatus() {
		return model.getStatus();
	}

	/**
	 * Returns the user ID of this faro user.
	 *
	 * @return the user ID of this faro user
	 */
	@Override
	public long getUserId() {
		return model.getUserId();
	}

	/**
	 * Returns the user name of this faro user.
	 *
	 * @return the user name of this faro user
	 */
	@Override
	public String getUserName() {
		return model.getUserName();
	}

	/**
	 * Returns the user uuid of this faro user.
	 *
	 * @return the user uuid of this faro user
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
	 * Sets the create time of this faro user.
	 *
	 * @param createTime the create time of this faro user
	 */
	@Override
	public void setCreateTime(long createTime) {
		model.setCreateTime(createTime);
	}

	/**
	 * Sets the email address of this faro user.
	 *
	 * @param emailAddress the email address of this faro user
	 */
	@Override
	public void setEmailAddress(String emailAddress) {
		model.setEmailAddress(emailAddress);
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
	 * Sets the faro user ID of this faro user.
	 *
	 * @param faroUserId the faro user ID of this faro user
	 */
	@Override
	public void setFaroUserId(long faroUserId) {
		model.setFaroUserId(faroUserId);
	}

	/**
	 * Sets the faro user uuid of this faro user.
	 *
	 * @param faroUserUuid the faro user uuid of this faro user
	 */
	@Override
	public void setFaroUserUuid(String faroUserUuid) {
		model.setFaroUserUuid(faroUserUuid);
	}

	/**
	 * Sets the group ID of this faro user.
	 *
	 * @param groupId the group ID of this faro user
	 */
	@Override
	public void setGroupId(long groupId) {
		model.setGroupId(groupId);
	}

	/**
	 * Sets the key of this faro user.
	 *
	 * @param key the key of this faro user
	 */
	@Override
	public void setKey(String key) {
		model.setKey(key);
	}

	/**
	 * Sets the live user ID of this faro user.
	 *
	 * @param liveUserId the live user ID of this faro user
	 */
	@Override
	public void setLiveUserId(long liveUserId) {
		model.setLiveUserId(liveUserId);
	}

	/**
	 * Sets the live user uuid of this faro user.
	 *
	 * @param liveUserUuid the live user uuid of this faro user
	 */
	@Override
	public void setLiveUserUuid(String liveUserUuid) {
		model.setLiveUserUuid(liveUserUuid);
	}

	/**
	 * Sets the modified time of this faro user.
	 *
	 * @param modifiedTime the modified time of this faro user
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
	 * Sets the primary key of this faro user.
	 *
	 * @param primaryKey the primary key of this faro user
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
	 * Sets the role ID of this faro user.
	 *
	 * @param roleId the role ID of this faro user
	 */
	@Override
	public void setRoleId(long roleId) {
		model.setRoleId(roleId);
	}

	/**
	 * Sets the status of this faro user.
	 *
	 * @param status the status of this faro user
	 */
	@Override
	public void setStatus(int status) {
		model.setStatus(status);
	}

	/**
	 * Sets the user ID of this faro user.
	 *
	 * @param userId the user ID of this faro user
	 */
	@Override
	public void setUserId(long userId) {
		model.setUserId(userId);
	}

	/**
	 * Sets the user name of this faro user.
	 *
	 * @param userName the user name of this faro user
	 */
	@Override
	public void setUserName(String userName) {
		model.setUserName(userName);
	}

	/**
	 * Sets the user uuid of this faro user.
	 *
	 * @param userUuid the user uuid of this faro user
	 */
	@Override
	public void setUserUuid(String userUuid) {
		model.setUserUuid(userUuid);
	}

	@Override
	public com.liferay.portal.kernel.model.CacheModel<FaroUser> toCacheModel() {
		return model.toCacheModel();
	}

	@Override
	public FaroUser toEscapedModel() {
		return new FaroUserWrapper(model.toEscapedModel());
	}

	@Override
	public String toString() {
		return model.toString();
	}

	@Override
	public FaroUser toUnescapedModel() {
		return new FaroUserWrapper(model.toUnescapedModel());
	}

	@Override
	protected FaroUserWrapper wrap(FaroUser faroUser) {
		return new FaroUserWrapper(faroUser);

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

		if (!(object instanceof FaroUserWrapper)) {
			return false;
		}

		FaroUserWrapper faroUserWrapper = (FaroUserWrapper)object;

		if (Objects.equals(model, faroUserWrapper.model)) {
			return true;
		}

		return false;
	}

	@Override
	public FaroUser getWrappedModel() {
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