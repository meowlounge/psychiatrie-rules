'use client';

import { cn } from '@/lib/utils';

interface SwitchProps {
	checked: boolean;
	onCheckedChange: (isChecked: boolean) => void;
	disabled?: boolean;
	className?: string;
	id?: string;
	'aria-label'?: string;
}

function Switch({
	checked,
	onCheckedChange,
	className,
	disabled,
	id,
	'aria-label': ariaLabel,
}: SwitchProps) {
	return (
		<button
			type='button'
			id={id}
			role='switch'
			aria-checked={checked}
			aria-label={ariaLabel}
			data-state={checked ? 'checked' : 'unchecked'}
			disabled={disabled}
			className={cn(
				'peer inline-flex h-6 w-11 items-center border transition-colors outline-none',
				'border-stone-700 bg-stone-900',
				'data-[state=checked]:border-stone-500 data-[state=checked]:bg-stone-800',
				'disabled:cursor-not-allowed disabled:opacity-50',
				'focus-visible:border-stone-500',
				className
			)}
			onClick={() => {
				if (disabled) {
					return;
				}

				onCheckedChange(!checked);
			}}>
			<span
				data-state={checked ? 'checked' : 'unchecked'}
				className={cn(
					'h-4 w-4 bg-stone-300 transition-transform',
					'translate-x-1 data-[state=checked]:translate-x-6'
				)}
			/>
		</button>
	);
}

export { Switch, type SwitchProps };
