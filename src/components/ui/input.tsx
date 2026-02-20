import { cn } from '@/lib/utils';

import * as React from 'react';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot='input'
			className={cn(
				'w-full min-w-0 border border-border bg-muted px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-xs file:font-normal file:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/60 disabled:text-muted-foreground',
				'focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/60',
				'aria-invalid:border-foreground/70',
				className
			)}
			{...props}
		/>
	);
}

export { Input };
