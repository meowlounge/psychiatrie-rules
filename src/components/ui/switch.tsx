'use client';

import { cn } from '@/lib/utils';

import { Switch as SwitchPrimitive } from 'radix-ui';
import * as React from 'react';

function Switch({
	className,
	size = 'default',
	...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
	size?: 'sm' | 'default';
}) {
	return (
		<SwitchPrimitive.Root
			data-slot='switch'
			data-size={size}
			className={cn(
				'peer inline-flex shrink-0 items-center border border-neutral-600 bg-transparent transition-colors outline-none group/switch data-[state=checked]:border-neutral-100 data-[state=checked]:bg-neutral-100 focus-visible:border-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-500/60 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-6 data-[size=default]:w-9 data-[size=sm]:h-4 data-[size=sm]:w-7',
				className
			)}
			{...props}>
			<SwitchPrimitive.Thumb
				data-slot='switch-thumb'
				className={cn(
					'pointer-events-none block bg-neutral-300 ring-0 transition-transform data-[state=checked]:bg-neutral-950 group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-[1px]'
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
