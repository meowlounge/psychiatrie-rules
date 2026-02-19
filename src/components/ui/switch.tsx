'use client';

import { cn } from '@/lib/utils';

import * as React from 'react';

interface SwitchProps extends Omit<React.ComponentProps<'button'>, 'onChange'> {
	checked: boolean;
	onCheckedChange?: (isChecked: boolean) => void;
}

function Switch({
	checked,
	onCheckedChange,
	className,
	disabled,
	type,
	onClick,
	...props
}: SwitchProps) {
	return (
		<button
			type={type ?? 'button'}
			role='switch'
			aria-checked={checked}
			data-slot='switch'
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
			onClick={(event) => {
				onClick?.(event);

				if (event.defaultPrevented || disabled) {
					return;
				}

				onCheckedChange?.(!checked);
			}}
			{...props}>
			<span
				data-slot='switch-thumb'
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
