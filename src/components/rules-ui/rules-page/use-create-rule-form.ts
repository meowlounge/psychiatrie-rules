'use client';

import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';

import { createInitialFormState, toCreateRulePayload } from './types';
import type { UseCreateRuleFormResult } from './types';

interface UseCreateRuleFormOptions {
	accessToken: string | null;
	isAdmin: boolean;
	refreshRules: () => Promise<void>;
}

export function useCreateRuleForm({
	accessToken,
	isAdmin,
	refreshRules,
}: UseCreateRuleFormOptions): UseCreateRuleFormResult {
	const [formState, setFormState] = useState(createInitialFormState);
	const [isSubmittingRule, setIsSubmittingRule] = useState(false);
	const [createRuleError, setCreateRuleError] = useState<string | null>(null);
	const [createRuleSuccess, setCreateRuleSuccess] = useState<string | null>(
		null
	);

	const handleContentChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setFormState((previousState) => ({
				...previousState,
				content: event.target.value,
			}));
		},
		[]
	);

	const handleNoteChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFormState((previousState) => ({
				...previousState,
				note: event.target.value,
			}));
		},
		[]
	);

	const handlePriorityChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFormState((previousState) => ({
				...previousState,
				priority: event.target.value,
			}));
		},
		[]
	);

	const handleIsNewChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFormState((previousState) => ({
				...previousState,
				isNew: event.target.checked,
			}));
		},
		[]
	);

	const handleIsLimitedTimeChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const isLimitedTime = event.target.checked;

			setFormState((previousState) => ({
				...previousState,
				isLimitedTime,
				limitedStartAt: isLimitedTime
					? previousState.limitedStartAt
					: '',
				limitedEndAt: isLimitedTime ? previousState.limitedEndAt : '',
			}));
		},
		[]
	);

	const handleLimitedStartAtChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFormState((previousState) => ({
				...previousState,
				limitedStartAt: event.target.value,
			}));
		},
		[]
	);

	const handleLimitedEndAtChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFormState((previousState) => ({
				...previousState,
				limitedEndAt: event.target.value,
			}));
		},
		[]
	);

	const handleCreateRule = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			if (!accessToken || !isAdmin) {
				setCreateRuleError('du bist nicht als admin eingeloggt.');
				return;
			}

			setCreateRuleError(null);
			setCreateRuleSuccess(null);
			setIsSubmittingRule(true);

			try {
				const payload = toCreateRulePayload(formState);
				const response = await fetch('/api/rules', {
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(payload),
				});
				const responseBody = await response.json().catch(() => null);

				if (!response.ok) {
					const message =
						typeof responseBody?.error === 'string'
							? responseBody.error
							: 'regel konnte nicht erstellt werden.';

					setCreateRuleError(message);
					return;
				}

				setCreateRuleSuccess('regel erstellt.');
				setFormState(createInitialFormState());
				void refreshRules();
			} catch {
				setCreateRuleError('regel konnte nicht erstellt werden.');
			} finally {
				setIsSubmittingRule(false);
			}
		},
		[accessToken, formState, isAdmin, refreshRules]
	);

	return {
		formState,
		isSubmittingRule,
		createRuleError,
		createRuleSuccess,
		handleContentChange,
		handleNoteChange,
		handlePriorityChange,
		handleIsNewChange,
		handleIsLimitedTimeChange,
		handleLimitedStartAtChange,
		handleLimitedEndAtChange,
		handleCreateRule,
	};
}
