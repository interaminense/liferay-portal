/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import Input from 'shared/components/Input';
import React, {useState} from 'react';
import Select from 'shared/components/Select';
import {AI_MODELS, loadAiConfig, saveAiConfig} from 'ai-chat/config';
import {decodeBasic, encodeBasic} from './basicAuth';
import {Status, toStatus} from './validateResult';
import {VALIDATE_ENDPOINT} from './constants';

export const AiAssistantForm = () => {
	const initial = loadAiConfig();
	const initialAuth = decodeBasic(initial.mcpAuth);
	const [apiKey, setApiKey] = useState(initial.apiKey);
	const [model, setModel] = useState(initial.model);
	const [mcpUsername, setMcpUsername] = useState(initialAuth.username);
	const [mcpPassword, setMcpPassword] = useState(initialAuth.password);
	const [reveal, setReveal] = useState(false);
	const [revealAuth, setRevealAuth] = useState(false);
	const [testing, setTesting] = useState(false);
	const [status, setStatus] = useState<Status | null>(null);

	const handleSave = () => {
		saveAiConfig({
			apiKey,
			mcpAuth: encodeBasic({
				password: mcpPassword,
				username: mcpUsername
			}),
			model
		});

		setStatus({
			displayType: 'success',
			message: Liferay.Language.get('your-changes-were-saved')
		});
	};

	const handleTest = async () => {
		setTesting(true);
		setStatus(null);

		try {
			const response = await fetch(VALIDATE_ENDPOINT, {
				body: JSON.stringify({apiKey, model}),
				headers: {'Content-Type': 'application/json'},
				method: 'POST'
			});

			const result = await response.json();

			setStatus(toStatus(result));
		} catch (error) {
			setStatus({
				displayType: 'danger',
				message:
					error instanceof Error
						? error.message
						: Liferay.Language.get('connection-failed')
			});
		} finally {
			setTesting(false);
		}
	};

	return (
		<div className='p-4' style={{maxWidth: 560}}>
			{status && (
				<ClayAlert displayType={status.displayType}>
					{status.message}
				</ClayAlert>
			)}

			<div className='form-group'>
				<label htmlFor='aiApiKey'>
					{Liferay.Language.get('anthropic-api-key')}
				</label>

				<Input.Group>
					<Input.GroupItem>
						<Input
							aria-label='anthropic-api-key'
							id='aiApiKey'
							onChange={(
								event: React.ChangeEvent<HTMLInputElement>
							) => setApiKey(event.target.value)}
							placeholder='sk-ant-...'
							type={reveal ? 'text' : 'password'}
							value={apiKey}
						/>
					</Input.GroupItem>

					<Input.GroupItem shrink>
						<ClayButton
							aria-label='toggle-key-visibility'
							displayType='secondary'
							onClick={() => setReveal(!reveal)}
							type='button'
						>
							<ClayIcon symbol={reveal ? 'eye-slash' : 'eye'} />
						</ClayButton>
					</Input.GroupItem>
				</Input.Group>
			</div>

			<div className='form-group'>
				<label htmlFor='aiModel'>{Liferay.Language.get('model')}</label>

				<Select
					id='aiModel'
					onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
						setModel(event.target.value)
					}
					value={model}
				>
					{AI_MODELS.map(option => (
						<Select.Item key={option.id} value={option.id}>
							{option.label}
						</Select.Item>
					))}
				</Select>
			</div>

			<h5 className='mt-4'>
				{Liferay.Language.get('analytics-cloud-credentials')}
			</h5>

			<div className='form-group'>
				<label htmlFor='aiMcpUsername'>
					{Liferay.Language.get('username')}
				</label>

				<Input
					aria-label='username'
					id='aiMcpUsername'
					onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
						setMcpUsername(event.target.value)
					}
					placeholder='name@liferay.com'
					value={mcpUsername}
				/>
			</div>

			<div className='form-group'>
				<label htmlFor='aiMcpPassword'>
					{Liferay.Language.get('password')}
				</label>

				<Input.Group>
					<Input.GroupItem>
						<Input
							aria-label='password'
							id='aiMcpPassword'
							onChange={(
								event: React.ChangeEvent<HTMLInputElement>
							) => setMcpPassword(event.target.value)}
							type={revealAuth ? 'text' : 'password'}
							value={mcpPassword}
						/>
					</Input.GroupItem>

					<Input.GroupItem shrink>
						<ClayButton
							aria-label='toggle-password-visibility'
							displayType='secondary'
							onClick={() => setRevealAuth(!revealAuth)}
							type='button'
						>
							<ClayIcon
								symbol={revealAuth ? 'eye-slash' : 'eye'}
							/>
						</ClayButton>
					</Input.GroupItem>
				</Input.Group>
			</div>

			<div className='d-flex' style={{gap: 8}}>
				<ClayButton displayType='primary' onClick={handleSave}>
					{Liferay.Language.get('save')}
				</ClayButton>

				<ClayButton
					disabled={testing}
					displayType='secondary'
					onClick={handleTest}
				>
					{testing
						? Liferay.Language.get('testing')
						: Liferay.Language.get('test-connection')}
				</ClayButton>
			</div>
		</div>
	);
};

export default AiAssistantForm;
