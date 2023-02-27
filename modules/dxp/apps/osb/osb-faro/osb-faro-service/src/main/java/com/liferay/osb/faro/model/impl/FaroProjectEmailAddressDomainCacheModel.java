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

package com.liferay.osb.faro.model.impl;

import com.liferay.osb.faro.model.FaroProjectEmailAddressDomain;
import com.liferay.petra.lang.HashUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.model.CacheModel;
import com.liferay.portal.kernel.model.MVCCModel;

import java.io.Externalizable;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;

/**
 * The cache model class for representing FaroProjectEmailAddressDomain in entity cache.
 *
 * @author Matthew Kong
 * @generated
 */
public class FaroProjectEmailAddressDomainCacheModel
	implements CacheModel<FaroProjectEmailAddressDomain>, Externalizable,
			   MVCCModel {

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof FaroProjectEmailAddressDomainCacheModel)) {
			return false;
		}

		FaroProjectEmailAddressDomainCacheModel
			faroProjectEmailAddressDomainCacheModel =
				(FaroProjectEmailAddressDomainCacheModel)object;

		if ((faroProjectEmailAddressDomainId ==
				faroProjectEmailAddressDomainCacheModel.
					faroProjectEmailAddressDomainId) &&
			(mvccVersion ==
				faroProjectEmailAddressDomainCacheModel.mvccVersion)) {

			return true;
		}

		return false;
	}

	@Override
	public int hashCode() {
		int hashCode = HashUtil.hash(0, faroProjectEmailAddressDomainId);

		return HashUtil.hash(hashCode, mvccVersion);
	}

	@Override
	public long getMvccVersion() {
		return mvccVersion;
	}

	@Override
	public void setMvccVersion(long mvccVersion) {
		this.mvccVersion = mvccVersion;
	}

	@Override
	public String toString() {
		StringBundler sb = new StringBundler(13);

		sb.append("{mvccVersion=");
		sb.append(mvccVersion);
		sb.append(", faroProjectEmailAddressDomainId=");
		sb.append(faroProjectEmailAddressDomainId);
		sb.append(", groupId=");
		sb.append(groupId);
		sb.append(", companyId=");
		sb.append(companyId);
		sb.append(", faroProjectId=");
		sb.append(faroProjectId);
		sb.append(", emailAddressDomain=");
		sb.append(emailAddressDomain);
		sb.append("}");

		return sb.toString();
	}

	@Override
	public FaroProjectEmailAddressDomain toEntityModel() {
		FaroProjectEmailAddressDomainImpl faroProjectEmailAddressDomainImpl =
			new FaroProjectEmailAddressDomainImpl();

		faroProjectEmailAddressDomainImpl.setMvccVersion(mvccVersion);
		faroProjectEmailAddressDomainImpl.setFaroProjectEmailAddressDomainId(
			faroProjectEmailAddressDomainId);
		faroProjectEmailAddressDomainImpl.setGroupId(groupId);
		faroProjectEmailAddressDomainImpl.setCompanyId(companyId);
		faroProjectEmailAddressDomainImpl.setFaroProjectId(faroProjectId);

		if (emailAddressDomain == null) {
			faroProjectEmailAddressDomainImpl.setEmailAddressDomain("");
		}
		else {
			faroProjectEmailAddressDomainImpl.setEmailAddressDomain(
				emailAddressDomain);
		}

		faroProjectEmailAddressDomainImpl.resetOriginalValues();

		return faroProjectEmailAddressDomainImpl;
	}

	@Override
	public void readExternal(ObjectInput objectInput) throws IOException {
		mvccVersion = objectInput.readLong();

		faroProjectEmailAddressDomainId = objectInput.readLong();

		groupId = objectInput.readLong();

		companyId = objectInput.readLong();

		faroProjectId = objectInput.readLong();
		emailAddressDomain = objectInput.readUTF();
	}

	@Override
	public void writeExternal(ObjectOutput objectOutput) throws IOException {
		objectOutput.writeLong(mvccVersion);

		objectOutput.writeLong(faroProjectEmailAddressDomainId);

		objectOutput.writeLong(groupId);

		objectOutput.writeLong(companyId);

		objectOutput.writeLong(faroProjectId);

		if (emailAddressDomain == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(emailAddressDomain);
		}
	}

	public long mvccVersion;
	public long faroProjectEmailAddressDomainId;
	public long groupId;
	public long companyId;
	public long faroProjectId;
	public String emailAddressDomain;

}