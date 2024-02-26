import React, {useContext, useEffect} from 'react';
import SitesDashboardQuery from 'shared/queries/SitesDashboardQuery';
import {compose} from 'redux';
import {graphql} from '@apollo/react-hoc';
import {isArray} from 'lodash';
import {Modal} from 'shared/types/Modal';
import {OnboardingContext} from 'shared/context/onboarding';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {useModal} from 'shared/hooks/useModal';
import {User} from 'shared/util/records';

const withOnboarding = (
	WrappedComponent: React.ComponentType<{
		currentUser: User;
		groupId: string;
	}>
) =>
	compose<any>(
		graphql(SitesDashboardQuery, {options: {variables: {type: null}}})
	)(({data, groupId, ...otherProps}) => {
		const {close, open} = useModal();
		const {onboardingTriggered, setOnboardingTriggered} = useContext(
			OnboardingContext
		);
		const currentUser = useCurrentUser();

		useEffect(() => {
			const {dataSources, loading} = data;

			if (!onboardingTriggered && currentUser.isAdmin()) {
				const triggerCondition =
					!loading && isArray(dataSources) && !dataSources.length;

				if (triggerCondition) {
					open(Modal.modalTypes.ONBOARDING_MODAL, {
						groupId,
						onClose: close
					});
					setOnboardingTriggered();
				}
			}
		}, [data]);

		return (
			<WrappedComponent
				currentUser={currentUser}
				groupId={groupId}
				{...otherProps}
			/>
		);
	});

export default withOnboarding;
