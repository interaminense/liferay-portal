import BaseEditPage from 'shared/components/base-edit-page';
import ClayButton from '@clayui/button';
import React from 'react';
import {useSegmentURLs} from 'segment/hooks/useSegmentURLs';

interface IToolbarProps {
	id: string;
	onDeleteSegment?: () => void;
	valid: boolean;
}

export const Toolbar: React.FC<IToolbarProps> = ({
	id,
	onDeleteSegment,
	valid,
}) => {
	const {getSegmentURL, segmentsURL} = useSegmentURLs();

	const cancelURL = id ? getSegmentURL(id) : segmentsURL;

	return (
		<BaseEditPage.Toolbar
			backURL={cancelURL}
			title={
				id
					? Liferay.Language.get('edit-segment')
					: Liferay.Language.get('new-segment')
			}
		>
			{id && onDeleteSegment && (
				<>
					<BaseEditPage.Toolbar.Item>
						<ClayButton
							borderless
							className="rounded-lg"
							displayType="secondary"
							onClick={onDeleteSegment}
							size="sm"
							type="button"
						>
							{Liferay.Language.get('delete-segment')}
						</ClayButton>
					</BaseEditPage.Toolbar.Item>

					<BaseEditPage.Toolbar.Divider />
				</>
			)}

			<BaseEditPage.Toolbar.Cancel href={cancelURL} />

			<BaseEditPage.Toolbar.Save
				disabled={!valid}
				label={Liferay.Language.get('save-segment')}
				type="submit"
			/>
		</BaseEditPage.Toolbar>
	);
};

export default Toolbar;
