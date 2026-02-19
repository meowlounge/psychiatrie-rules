'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import type { RuleViewModel } from '@/types/rules';

import {
	useCallback,
	useEffect,
	useState,
	type ChangeEvent,
	type FormEvent,
} from 'react';

import {
	createFormStateFromRule,
	createInitialFormState,
	toCreateRulePayload,
	type RuleCreateFormState,
} from './types';

interface EditRuleDialogProps {
	rule: RuleViewModel | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	accessToken: string | null;
	isAdmin: boolean;
	inputClassName: string;
	actionButtonClassName: string;
	refreshRules: () => Promise<void>;
}

export function EditRuleDialog({
	rule,
	isOpen,
	onOpenChange,
	accessToken,
	isAdmin,
	inputClassName,
	actionButtonClassName,
	refreshRules,
}: EditRuleDialogProps) {
	const [formState, setFormState] = useState<RuleCreateFormState>(
		createInitialFormState
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	useEffect(() => {
		if (!rule || !isOpen) {
			return;
		}

		setFormState(createFormStateFromRule(rule));
		setError(null);
		setSuccess(null);
	}, [isOpen, rule]);

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

	const handleSubmitUpdate = useCallback(async () => {
		if (!rule || !accessToken || !isAdmin) {
			setError('du bist nicht als admin eingeloggt.');
			return;
		}

		setError(null);
		setSuccess(null);
		setIsSubmitting(true);

		try {
			const response = await fetch(`/api/rules/${rule.id}`, {
				method: 'PATCH',
				headers: {
					'content-type': 'application/json',
					authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(toCreateRulePayload(formState)),
			});
			const responseBody = await response.json().catch(() => null);

			if (!response.ok) {
				const message =
					typeof responseBody?.error === 'string'
						? responseBody.error
						: 'regel konnte nicht aktualisiert werden.';

				setError(message);
				return;
			}

			setSuccess('regel aktualisiert.');
			await refreshRules();
			onOpenChange(false);
		} catch {
			setError('regel konnte nicht aktualisiert werden.');
		} finally {
			setIsSubmitting(false);
		}
	}, [accessToken, formState, isAdmin, onOpenChange, refreshRules, rule]);

	const handleSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			void handleSubmitUpdate();
		},
		[handleSubmitUpdate]
	);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='border-stone-700 bg-stone-900 text-stone-100 sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle className='text-sm uppercase tracking-[0.08em]'>
						regel bearbeiten
					</DialogTitle>
					<DialogDescription className='text-xs text-stone-400'>
						änderungen werden sofort live veröffentlicht
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-3'>
					<textarea
						value={formState.content}
						onChange={handleContentChange}
						placeholder='regeltext'
						required
						rows={4}
						className={inputClassName}
					/>
					<input
						type='text'
						value={formState.note}
						onChange={handleNoteChange}
						placeholder='notiz (optional)'
						className={inputClassName}
					/>
					<div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
						<label className='flex items-center gap-2 text-xs text-stone-300'>
							<input
								type='checkbox'
								checked={formState.isNew}
								onChange={handleIsNewChange}
								className='h-3 w-3 accent-stone-300'
							/>
							new
						</label>
						<label className='flex items-center gap-2 text-xs text-stone-300'>
							<input
								type='checkbox'
								checked={formState.isLimitedTime}
								onChange={handleIsLimitedTimeChange}
								className='h-3 w-3 accent-stone-300'
							/>
							limited
						</label>
						<input
							type='number'
							value={formState.priority}
							onChange={handlePriorityChange}
							placeholder='priority'
							className={inputClassName}
						/>
					</div>

					{formState.isLimitedTime && (
						<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
							<input
								type='datetime-local'
								value={formState.limitedStartAt}
								onChange={handleLimitedStartAtChange}
								className={inputClassName}
							/>
							<input
								type='datetime-local'
								value={formState.limitedEndAt}
								onChange={handleLimitedEndAtChange}
								className={inputClassName}
							/>
						</div>
					)}

					<button
						type='submit'
						disabled={isSubmitting}
						className={actionButtonClassName}>
						{isSubmitting
							? 'wird gespeichert ...'
							: 'änderungen speichern'}
					</button>
				</form>

				{error && <p className='text-xs text-stone-400'>{error}</p>}
				{success && <p className='text-xs text-stone-300'>{success}</p>}
			</DialogContent>
		</Dialog>
	);
}
