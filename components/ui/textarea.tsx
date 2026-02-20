import { cn } from '@/lib/utils';

import * as React from 'react';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
	return (
		<textarea
			data-slot='textarea'
			className={cn(
				'border-neutral-700 bg-neutral-900 focus-visible:border-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-500/60 aria-invalid:border-neutral-400 resize-none border px-3 py-2 text-sm text-neutral-100 leading-relaxed transition-colors placeholder:text-neutral-500 flex field-sizing-content min-h-24 w-full outline-none disabled:cursor-not-allowed disabled:bg-neutral-950 disabled:text-neutral-500',
				className
			)}
			{...props}
		/>
	);
}

export { Textarea };
