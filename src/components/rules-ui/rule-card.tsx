import { Button } from '@/components/ui/button';

import type { RuleViewModel } from '@/types';
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
			className: 'bg-foreground text-background',
		});
	}

	if (rule.isLimitedTime) {
		statuses.push({
			label: 'limited',
			className: 'border border-border bg-muted text-foreground',
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
		<article className='group space-y-2 border-t border-border pt-5 first:border-t-0 first:pt-0'>
			<div className='flex flex-wrap items-center justify-between gap-2'>
				<div className='flex flex-wrap items-center gap-2'>
					<p className='text-sm text-muted-foreground'>
						regel {index + 1}
					</p>

					{statuses.map((status) => (
						<span
							key={status.label}
							className={`${status.className} px-1.5 py-0.5 text-xs uppercase tracking-[0.08em]`}>
							{status.label}
						</span>
					))}
				</div>

				{canManageRule && (
					<div className='flex items-center gap-1 opacity-100 transition-opacity duration-150 sm:pointer-events-none sm:opacity-0 sm:group-hover:pointer-events-auto sm:group-hover:opacity-100'>
						<Button
							type='button'
							onClick={() => handleEditRule(rule)}
							className='flex h-8 w-8 items-center justify-center text-muted-foreground'
							aria-label='regel bearbeiten'>
							<PencilLineIcon className='h-4 w-4' />
						</Button>
						<Button
							type='button'
							onClick={() => handleDeleteRule(rule)}
							className='flex h-8 w-8 items-center justify-center text-muted-foreground'
							aria-label='regel löschen'>
							<Trash2Icon className='h-4 w-4' />
						</Button>
					</div>
				)}
			</div>

			<p className='text-base leading-relaxed sm:text-lg'>
				{rule.content}
			</p>

			{rule.note && (
				<p className='text-sm text-muted-foreground'>
					notiz: {rule.note}
				</p>
			)}

			{limitedTimeText && (
				<p className='text-sm text-muted-foreground'>
					zeitfenster: {limitedTimeText}
				</p>
			)}
		</article>
	);
}
