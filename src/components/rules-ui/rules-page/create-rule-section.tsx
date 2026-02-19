'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import { PlusIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import type { RuleCreateFormState, UseCreateRuleFormResult } from './types';

interface CreateRuleSectionProps {
	canCreateRules: boolean;
	formState: RuleCreateFormState;
	isSubmittingRule: boolean;
	createRuleError: string | null;
	createRuleSuccess: string | null;
	inputClassName: string;
	actionButtonClassName: string;
	handleContentChange: UseCreateRuleFormResult['handleContentChange'];
	handleNoteChange: UseCreateRuleFormResult['handleNoteChange'];
	handlePriorityChange: UseCreateRuleFormResult['handlePriorityChange'];
	handleIsNewChange: UseCreateRuleFormResult['handleIsNewChange'];
	handleIsLimitedTimeChange: UseCreateRuleFormResult['handleIsLimitedTimeChange'];
	handleLimitedStartAtChange: UseCreateRuleFormResult['handleLimitedStartAtChange'];
	handleLimitedEndAtChange: UseCreateRuleFormResult['handleLimitedEndAtChange'];
	handleCreateRule: UseCreateRuleFormResult['handleCreateRule'];
	resetCreateRuleFeedback: UseCreateRuleFormResult['resetCreateRuleFeedback'];
}

export function CreateRuleSection({
	canCreateRules,
	formState,
	isSubmittingRule,
	createRuleError,
	createRuleSuccess,
	inputClassName,
	actionButtonClassName,
	handleContentChange,
	handleNoteChange,
	handlePriorityChange,
	handleIsNewChange,
	handleIsLimitedTimeChange,
	handleLimitedStartAtChange,
	handleLimitedEndAtChange,
	handleCreateRule,
	resetCreateRuleFeedback,
}: CreateRuleSectionProps) {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	useEffect(() => {
		if (!createRuleSuccess) {
			return;
		}

		setIsCreateDialogOpen(false);
	}, [createRuleSuccess]);

	const handleOpenChange = useCallback(
		(isOpen: boolean) => {
			setIsCreateDialogOpen(isOpen);

			if (isOpen) {
				resetCreateRuleFeedback();
			}
		},
		[resetCreateRuleFeedback]
	);

	if (!canCreateRules) {
		return null;
	}

	return (
		<Dialog open={isCreateDialogOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<button type='button' className={actionButtonClassName}>
					<PlusIcon className='h-3.5 w-3.5' />
					regel erstellen
				</button>
			</DialogTrigger>
			<DialogContent className='border-stone-700 bg-stone-900 text-stone-100 sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle className='text-sm uppercase tracking-[0.08em]'>
						regel erstellen
					</DialogTitle>
					<DialogDescription className='text-xs text-stone-400'>
						neue regel wird sofort live veröffentlicht
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleCreateRule} className='space-y-3'>
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
						disabled={isSubmittingRule}
						className={actionButtonClassName}>
						{isSubmittingRule
							? 'wird erstellt ...'
							: 'regel speichern'}
					</button>
				</form>

				{createRuleError && (
					<p className='text-xs text-stone-400'>{createRuleError}</p>
				)}

				{createRuleSuccess && (
					<p className='text-xs text-stone-300'>
						{createRuleSuccess}
					</p>
				)}
			</DialogContent>
		</Dialog>
	);
}
