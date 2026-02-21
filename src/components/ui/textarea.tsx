import { cn } from '@/lib/utils';

import * as React from 'react';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
	return (
		<textarea
			data-slot='textarea'
			className={cn(
				'flex min-h-24 w-full resize-none border border-border bg-muted px-3 py-2 text-sm leading-relaxed text-foreground transition-colors placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:bg-muted/60 disabled:text-muted-foreground',
				'focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/60',
				'aria-invalid:border-foreground/70',
				className
			)}
			{...props}
		/>
	);
}

export { Textarea };
