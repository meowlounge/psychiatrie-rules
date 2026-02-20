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
				'peer data-[state=checked]:border-neutral-300 data-[state=checked]:bg-neutral-300 data-[state=unchecked]:border-neutral-700 data-[state=unchecked]:bg-neutral-900 focus-visible:border-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-500/60 group/switch inline-flex shrink-0 items-center rounded-none border transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-6 data-[size=default]:w-9 data-[size=sm]:h-4 data-[size=sm]:w-7',
				className
			)}
			{...props}>
			<SwitchPrimitive.Thumb
				data-slot='switch-thumb'
				className={cn(
					'bg-neutral-100 data-[state=checked]:bg-neutral-950 pointer-events-none block rounded-none ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-[1px]'
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
