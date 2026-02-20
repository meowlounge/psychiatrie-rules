import { cn } from '@/lib/utils';

import * as React from 'react';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot='input'
			className={cn(
				'w-full min-w-0 border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 transition-colors placeholder:text-neutral-500 outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-xs file:font-normal file:text-neutral-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-950 disabled:text-neutral-500',
				'focus-visible:border-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-500/60',
				'aria-invalid:border-neutral-400',
				className
			)}
			{...props}
		/>
	);
}

export { Input };
