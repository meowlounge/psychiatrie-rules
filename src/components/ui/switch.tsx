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
				'peer inline-flex shrink-0 items-center border border-border bg-background transition-colors outline-none group/switch data-[state=checked]:border-foreground data-[state=checked]:bg-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-6 data-[size=default]:w-9 data-[size=sm]:h-4 data-[size=sm]:w-7',
				className
			)}
			{...props}>
			<SwitchPrimitive.Thumb
				data-slot='switch-thumb'
				className={cn(
					'pointer-events-none block bg-muted-foreground ring-0 transition-transform data-[state=checked]:bg-background group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-[1px]'
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
