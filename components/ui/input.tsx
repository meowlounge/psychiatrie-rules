import { cn } from '@/lib/utils';

import { Input as InputPrimitive } from '@base-ui/react/input';
import * as React from 'react';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<InputPrimitive
			type={type}
			data-slot='input'
			className={cn(
				'bg-neutral-900 border-neutral-700 focus-visible:border-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-500/60 aria-invalid:border-neutral-400 h-10 border px-3 py-2 text-sm text-neutral-100 transition-colors file:h-8 file:text-xs file:font-normal file:text-neutral-300 placeholder:text-neutral-500 w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-950 disabled:text-neutral-500',
				className
			)}
			{...props}
		/>
	);
}

export { Input };
