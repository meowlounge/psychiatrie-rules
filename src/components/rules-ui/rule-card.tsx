import type { RuleViewModel } from '@/types/rules';

import { useMemo } from 'react';

interface RuleCardProps {
	rule: RuleViewModel;
	index: number;
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

export function RuleCard({ rule, index }: RuleCardProps) {
	const limitedTimeText = useMemo(
		() => formatLimitedTimeWindow(rule),
		[rule]
	);
	const statuses = useMemo(() => getStatusList(rule), [rule]);

<<<<<<< HEAD
	const cardClassName = `group border transition-all duration-200 overflow-hidden ${
		isClickable
			? 'cursor-pointer hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5'
			: ''
	} ${
		isChecked && !signed
			? 'border-primary/30 bg-primary/5 shadow-sm'
			: signed
				? 'border-border bg-card/50 backdrop-blur-sm'
				: 'border-border bg-card hover:bg-card/80'
	}`;

	const cardContent = (
		<div className='p-4'>
			<div className='flex items-start gap-4'>
				<div
					className={`flex-shrink-0 size-8 flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
						isChecked && !signed
							? 'bg-primary text-primary-foreground scale-110'
							: signed
								? 'bg-primary/10 text-primary'
								: 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
					}`}>
					{isChecked && !signed ? (
						<CheckCircle2 className='size-4' />
					) : (
						index + 1
					)}
				</div>

				<div className='flex-1 space-y-2'>
					<div className='text-card-foreground leading-relaxed'>
						{rule.content}
					</div>
					{rule.note && (
						<div className='text-xs text-muted-foreground'>
							{rule.note}
						</div>
					)}
				</div>
=======
	return (
		<article className='space-y-2 border-t border-stone-800 pt-5 first:border-t-0 first:pt-0'>
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
>>>>>>> a5888a487315b917f3f2aa10a037e35f646b720b
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
<<<<<<< HEAD

	if (!isClickable) {
		return <div className={cardClassName}>{cardContent}</div>;
	}

	return (
		<div
			className={cardClassName}
			onClick={onToggle}
			role='checkbox'
			aria-checked={isChecked}
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === ' ' || e.key === 'Enter') {
					e.preventDefault();
					onToggle();
				}
			}}>
			{cardContent}
		</div>
	);
};
=======
}
>>>>>>> a5888a487315b917f3f2aa10a037e35f646b720b
