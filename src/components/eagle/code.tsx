import { cn } from '@/lib/utils';

import type { JSX } from 'react';

export type CodeProps = React.HTMLAttributes<HTMLElement>;

/**
 * A styled `<code>` component for displaying inline code snippets in a consistent, accessible format.
 *
 * @param props - React props extending `HTMLAttributes<HTMLElement>`. Commonly used: `className`, `children`.
 *
 * @returns A styled inline `<code>` element.
 *
 * @author prodbyeagle
 */
export function Code({ className, ...props }: CodeProps): JSX.Element {
	return (
		<code
			className={cn('font-mono text-sm px-0.5', className)}
			{...props}
		/>
	);
}
