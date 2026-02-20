'use client';

import type {
	RuleCreateFormState,
	UseCreateRuleFormResult,
} from '@/components/rules-ui/rules-page/types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface RuleFormFieldsProps {
	idPrefix: string;
	formState: RuleCreateFormState;
	inputClassName: string;
	handleContentChange: UseCreateRuleFormResult['handleContentChange'];
	handleNoteChange: UseCreateRuleFormResult['handleNoteChange'];
	handlePriorityChange: UseCreateRuleFormResult['handlePriorityChange'];
	handleIsNewChange: UseCreateRuleFormResult['handleIsNewChange'];
	handleIsLimitedTimeChange: UseCreateRuleFormResult['handleIsLimitedTimeChange'];
	handleLimitedStartAtChange: UseCreateRuleFormResult['handleLimitedStartAtChange'];
	handleLimitedEndAtChange: UseCreateRuleFormResult['handleLimitedEndAtChange'];
}

export function RuleFormFields({
	idPrefix,
	formState,
	inputClassName,
	handleContentChange,
	handleNoteChange,
	handlePriorityChange,
	handleIsNewChange,
	handleIsLimitedTimeChange,
	handleLimitedStartAtChange,
	handleLimitedEndAtChange,
}: RuleFormFieldsProps) {
	const contentFieldId = `${idPrefix}-content`;
	const noteFieldId = `${idPrefix}-note`;
	const priorityFieldId = `${idPrefix}-priority`;
	const limitedStartFieldId = `${idPrefix}-limited-start`;
	const limitedEndFieldId = `${idPrefix}-limited-end`;

	return (
		<div className='space-y-4'>
			<div className='space-y-1.5'>
				<Label
					htmlFor={contentFieldId}
					className='text-sm text-neutral-300'>
					regeltext
				</Label>
				<textarea
					id={contentFieldId}
					value={formState.content}
					onChange={handleContentChange}
					placeholder='regeltext'
					required
					rows={4}
					className={`${inputClassName} min-h-28`}
				/>
			</div>

			<div className='space-y-1.5'>
				<Label
					htmlFor={noteFieldId}
					className='text-sm text-neutral-300'>
					notiz
				</Label>
				<input
					id={noteFieldId}
					type='text'
					value={formState.note}
					onChange={handleNoteChange}
					placeholder='notiz (optional)'
					className={inputClassName}
				/>
			</div>

			<div className='space-y-1.5'>
				<Label
					htmlFor={priorityFieldId}
					className='text-sm text-neutral-300'>
					priorität
				</Label>
				<input
					id={priorityFieldId}
					type='number'
					value={formState.priority}
					onChange={handlePriorityChange}
					placeholder='priority'
					className={inputClassName}
				/>
			</div>

			<div className='grid gap-2 sm:grid-cols-2'>
				<div className='flex items-center justify-between border border-neutral-800 bg-neutral-950 p-3'>
					<div className='space-y-0.5'>
						<p className='text-sm uppercase tracking-[0.08em] text-neutral-300'>
							new
						</p>
						<p className='text-xs text-neutral-500'>
							wird in der regel-liste markiert
						</p>
					</div>
					<Switch
						checked={formState.isNew}
						onCheckedChange={handleIsNewChange}
						aria-label='new markieren'
					/>
				</div>

				<div className='flex items-center justify-between border border-neutral-800 bg-neutral-950 p-3'>
					<div className='space-y-0.5'>
						<p className='text-sm uppercase tracking-[0.08em] text-neutral-300'>
							limited
						</p>
						<p className='text-xs text-neutral-500'>
							zeitfenster für diese regel aktivieren
						</p>
					</div>
					<Switch
						checked={formState.isLimitedTime}
						onCheckedChange={handleIsLimitedTimeChange}
						aria-label='zeitfenster aktivieren'
					/>
				</div>
			</div>

			{formState.isLimitedTime && (
				<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
					<div className='space-y-1.5'>
						<Label
							htmlFor={limitedStartFieldId}
							className='text-sm text-neutral-300'>
							start
						</Label>
						<input
							id={limitedStartFieldId}
							type='datetime-local'
							value={formState.limitedStartAt}
							onChange={handleLimitedStartAtChange}
							className={inputClassName}
						/>
					</div>
					<div className='space-y-1.5'>
						<Label
							htmlFor={limitedEndFieldId}
							className='text-sm text-neutral-300'>
							ende
						</Label>
						<input
							id={limitedEndFieldId}
							type='datetime-local'
							value={formState.limitedEndAt}
							onChange={handleLimitedEndAtChange}
							className={inputClassName}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
