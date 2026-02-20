'use client';

import {
	Dialog,
	DialogClose,
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

import { RuleFormFields } from './rule-form-fields';
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

	useEffect(() => {
		if (!rule || !isOpen) {
			return;
		}

		setFormState(createFormStateFromRule(rule));
		setError(null);
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

	const handleIsNewChange = useCallback((isChecked: boolean) => {
		setFormState((previousState) => ({
			...previousState,
			isNew: isChecked,
		}));
	}, []);

	const handleIsLimitedTimeChange = useCallback((isChecked: boolean) => {
		setFormState((previousState) => ({
			...previousState,
			isLimitedTime: isChecked,
			limitedStartAt: isChecked ? previousState.limitedStartAt : '',
			limitedEndAt: isChecked ? previousState.limitedEndAt : '',
		}));
	}, []);

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

	const ruleReference = rule ? `#${rule.id.slice(0, 8)}` : null;

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='border-neutral-700 bg-neutral-900 text-neutral-100 sm:max-w-2xl'>
				<DialogHeader>
					<DialogTitle className='text-base uppercase tracking-[0.08em]'>
						regel bearbeiten
					</DialogTitle>
					<DialogDescription className='text-sm text-neutral-400'>
						{ruleReference
							? `änderungen an regel ${ruleReference}`
							: 'änderungen werden sofort live veröffentlicht'}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<RuleFormFields
						idPrefix='edit-rule'
						formState={formState}
						inputClassName={inputClassName}
						handleContentChange={handleContentChange}
						handleNoteChange={handleNoteChange}
						handlePriorityChange={handlePriorityChange}
						handleIsNewChange={handleIsNewChange}
						handleIsLimitedTimeChange={handleIsLimitedTimeChange}
						handleLimitedStartAtChange={handleLimitedStartAtChange}
						handleLimitedEndAtChange={handleLimitedEndAtChange}
					/>

					<div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
						<DialogClose asChild>
							<button
								type='button'
								className={`${actionButtonClassName} border border-neutral-700 bg-neutral-900`}>
								abbrechen
							</button>
						</DialogClose>
						<button
							type='submit'
							disabled={isSubmitting}
							className={actionButtonClassName}>
							{isSubmitting
								? 'wird gespeichert ...'
								: 'änderungen speichern'}
						</button>
					</div>
				</form>

				{error && <p className='text-sm text-neutral-400'>{error}</p>}
			</DialogContent>
		</Dialog>
	);
}
