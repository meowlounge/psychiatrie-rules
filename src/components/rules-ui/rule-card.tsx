import type { Rule } from '@/rules';
import { CheckCircle2 } from 'lucide-react';

interface RuleCardProps {
	rule: Rule;
	index: number;
	isChecked: boolean;
	signed: boolean;
	onToggle: () => void;
}

export const RuleCard: React.FC<RuleCardProps> = ({
	rule,
	index,
	isChecked,
	signed,
	onToggle,
}) => {
	const isClickable = !signed;

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
			</div>
		</div>
	);

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
