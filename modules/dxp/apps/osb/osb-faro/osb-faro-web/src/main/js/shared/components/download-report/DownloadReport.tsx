import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import Loading, {Align} from '../Loading';
import React, {useEffect, useState} from 'react';
import {useLoadingStatus} from 'shared/hooks/useLoadingStatus';

function convertPixelIntoPDFSize(
	container: HTMLElement,
	positionHeight: number
) {
	return Math.round(
		(container.clientWidth * positionHeight) / container.clientHeight
	);
}

function generateReport({
	container,
	subtitle,
	title
}: IDownloadReport): Promise<any> {
	return html2canvas(container, {backgroundColor: '#F1F2F5'}).then(function (
		canvas
	) {
		const doc = new JsPDF();
		const imageData = canvas.toDataURL('image/jpeg', 1.0);

		const headerSize = 25;
		const paddingX = 15;
		const paddingY = 10;
		const screenY = headerSize + 2;
		const docWidth = doc.internal.pageSize.getWidth();
		const docHeight = doc.internal.pageSize.getHeight();

		let screenHeight = docHeight - headerSize - 2;
		let screenWidth = 0;
		let screenX = 0;

		if (convertPixelIntoPDFSize(container, screenHeight) > docWidth) {
			screenHeight = Math.round(
				(container.clientHeight * docWidth) / container.clientWidth
			);
			screenWidth = docWidth;
		} else {
			screenWidth = convertPixelIntoPDFSize(container, screenHeight);
			screenX =
				(docWidth -
					Math.round(
						(container.clientWidth * screenHeight) /
							container.clientHeight
					)) /
				2;
		}

		doc.setFillColor(241, 242, 245);
		doc.rect(0, 0, docWidth, docHeight, 'F');

		doc.setFillColor(255, 255, 255);
		doc.rect(0, 0, docWidth, headerSize, 'F');

		doc.setFont('Helvetica', 'bold');
		doc.setFontSize(12);
		doc.text(title, paddingX, paddingY);

		doc.setFont('Helvetica', 'normal');
		doc.setFontSize(8);

		if (subtitle) {
			doc.setTextColor('#6B6C7E');
			doc.text(subtitle, paddingX, paddingY + 5);
		}

		doc.setTextColor('#0B5FFF');
		doc.textWithLink(
			Liferay.Language.get('access-workspace'),
			docWidth - paddingX - 25,
			paddingY,
			{url: window.location.href}
		);

		doc.addImage(
			imageData,
			'JPEG',
			screenX,
			screenY,
			screenWidth,
			screenHeight
		);

		doc.save();

		return Promise.resolve();
	});
}

interface IDownloadReport {
	container?: HTMLElement;
	subtitle?: string;
	title: string | any[];
}

export const DownloadReport: React.FC<IDownloadReport> = ({
	container: initialContainer,
	subtitle,
	title
}) => {
	const [loading, setLoading] = useState(false);
	const [container, setContainer] = useState(null);

	const globalLoading = useLoadingStatus();

	useEffect(() => {
		setContainer(
			initialContainer || document.querySelector('.page-container')
		);
	}, []);

	return (
		<ClayButton
			className='text-secondary'
			disabled={globalLoading || loading}
			displayType='unstyled'
			onClick={() => {
				setLoading(true);

				generateReport({
					container,
					subtitle,
					title
				}).then(() => {
					setLoading(false);
				});
			}}
			size='sm'
		>
			<ClayIcon className='mr-2' symbol='download' />

			{Liferay.Language.get('download')}

			{loading && <Loading align={Align.Right} />}
		</ClayButton>
	);
};
