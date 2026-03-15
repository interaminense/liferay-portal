import BasePage from 'settings/components/base-page/BasePage';
import React from 'react';
import RecommendationList from '../hocs/RecommendationList';
import {Router} from 'shared/types';

interface IRecommendationsProps {
	navigate: (string) => void;
	router: Router;
}

const Recommendations: React.FC<IRecommendationsProps> = ({
	navigate,
	router
}) => {
	const {groupId} = router.params;

	return (
		<BasePage
			pageDescription={Liferay.Language.get(
				'create-and-train-machine-learning-models-to-use-in-your-recommendations'
			)}
			pageTitle={Liferay.Language.get('recommendations')}
		>
			<RecommendationList
				groupId={groupId}
				navigate={navigate}
				router={router}
			/>
		</BasePage>
	);
};

export default Recommendations;
