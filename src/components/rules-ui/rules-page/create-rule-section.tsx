'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import { PlusIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { RuleFormFields } from './rule-form-fields';
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
				<Button type='button' className={actionButtonClassName}>
					<PlusIcon className='h-4 w-4' />
					regel erstellen
				</Button>
			</DialogTrigger>
			<DialogContent className='border-neutral-700 bg-neutral-900 text-neutral-100 sm:max-w-2xl'>
				<DialogHeader>
					<DialogTitle className='text-base uppercase tracking-[0.08em]'>
						regel erstellen
					</DialogTitle>
					<DialogDescription className='text-sm text-neutral-400'>
						neue regel wird sofort live veröffentlicht
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleCreateRule} className='space-y-4'>
					<RuleFormFields
						idPrefix='create-rule'
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
							<Button
								type='button'
								className={actionButtonClassName}>
								abbrechen
							</Button>
						</DialogClose>
						<Button
							type='submit'
							disabled={isSubmittingRule}
							className={actionButtonClassName}>
							{isSubmittingRule
								? 'wird erstellt ...'
								: 'regel speichern'}
						</Button>
					</div>
				</form>

				{createRuleError && (
					<p className='text-sm text-neutral-400'>
						{createRuleError}
					</p>
				)}

				{createRuleSuccess && (
					<p className='text-sm text-neutral-300'>
						{createRuleSuccess}
					</p>
				)}
			</DialogContent>
		</Dialog>
	);
}
