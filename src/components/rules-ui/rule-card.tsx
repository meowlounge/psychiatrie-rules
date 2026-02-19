import type { RuleViewModel } from '@/types/rules';

import { PencilLineIcon, Trash2Icon } from 'lucide-react';
import { useMemo } from 'react';

interface RuleCardProps {
	rule: RuleViewModel;
	index: number;
	canManageRule: boolean;
	handleEditRule: (rule: RuleViewModel) => void;
	handleDeleteRule: (rule: RuleViewModel) => void;
}

interface RuleStatus {
	label: string;
	className: string;
}

function formatLimitedTimeWindow(rule: RuleViewModel) {
	if (!rule.isLimitedTime) {
		return null;
	}

	if (!rule.limitedStartAt && !rule.limitedEndAt) {
		return 'zeitlich begrenzt';
	}

	const formatter = new Intl.DateTimeFormat('de-DE', {
		dateStyle: 'medium',
		timeStyle: 'short',
	});

	const startText = rule.limitedStartAt
		? formatter.format(new Date(rule.limitedStartAt))
		: 'sofort';
	const endText = rule.limitedEndAt
		? formatter.format(new Date(rule.limitedEndAt))
		: 'offen';

	return `${startText} bis ${endText}`;
}

function getStatusList(rule: RuleViewModel): RuleStatus[] {
	const statuses: RuleStatus[] = [];

	if (rule.isNew) {
		statuses.push({
			label: 'new',
			className: 'bg-stone-200 text-stone-950',
		});
	}

	if (rule.isLimitedTime) {
		statuses.push({
			label: 'limited',
			className: 'bg-stone-600 text-stone-100',
		});
	}

	return statuses;
}

export function RuleCard({
	rule,
	index,
	canManageRule,
	handleEditRule,
	handleDeleteRule,
}: RuleCardProps) {
	const limitedTimeText = useMemo(
		() => formatLimitedTimeWindow(rule),
		[rule]
	);
	const statuses = useMemo(() => getStatusList(rule), [rule]);

	return (
		<article className='group space-y-2 border-t border-stone-800 pt-5 first:border-t-0 first:pt-0'>
			<div className='flex flex-wrap items-center justify-between gap-2'>
				<div className='flex flex-wrap items-center gap-2'>
					<p className='text-xs text-muted-foreground sm:text-sm'>
						regel {index + 1}
					</p>

					{statuses.map((status) => (
						<span
							key={status.label}
							className={`${status.className} px-1.5 py-0.5 text-[11px] uppercase tracking-[0.08em] sm:text-xs`}>
							{status.label}
						</span>
					))}
				</div>

				{canManageRule && (
					<div className='flex items-center gap-1 opacity-100 transition-opacity duration-150 sm:pointer-events-none sm:opacity-0 sm:group-hover:pointer-events-auto sm:group-hover:opacity-100'>
						<button
							type='button'
							onClick={() => handleEditRule(rule)}
							className='flex h-7 w-7 items-center justify-center border border-stone-700 bg-stone-900 text-stone-300 transition-colors hover:bg-stone-800 hover:text-stone-100'
							aria-label='regel bearbeiten'>
							<PencilLineIcon className='h-3.5 w-3.5' />
						</button>
						<button
							type='button'
							onClick={() => handleDeleteRule(rule)}
							className='flex h-7 w-7 items-center justify-center border border-stone-700 bg-stone-900 text-stone-400 transition-colors hover:bg-stone-800 hover:text-stone-200'
							aria-label='regel löschen'>
							<Trash2Icon className='h-3.5 w-3.5' />
						</button>
					</div>
				)}
			</div>

			<p className='text-sm leading-relaxed sm:text-base'>
				{rule.content}
			</p>

			{rule.note && (
				<p className='text-xs text-muted-foreground sm:text-sm'>
					notiz: {rule.note}
				</p>
			)}

			{limitedTimeText && (
				<p className='text-xs text-muted-foreground sm:text-sm'>
					zeitfenster: {limitedTimeText}
				</p>
			)}
		</article>
	);
}
