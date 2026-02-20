import { cn } from '@/lib/utils';

import * as React from 'react';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
	return (
		<textarea
			data-slot='textarea'
			className={cn(
				'flex min-h-24 w-full resize-none border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm leading-relaxed text-neutral-100 transition-colors placeholder:text-neutral-500 outline-none disabled:cursor-not-allowed disabled:bg-neutral-950 disabled:text-neutral-500',
				'focus-visible:border-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-500/60',
				'aria-invalid:border-neutral-400',
				className
			)}
			{...props}
		/>
	);
}

export { Textarea };
