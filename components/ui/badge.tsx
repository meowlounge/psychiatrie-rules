import { cn } from '@/lib/utils';

import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
	'h-6 gap-1 border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-xs uppercase tracking-[0.08em] font-normal text-neutral-200 transition-colors has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-500/60 overflow-hidden group/badge',
	{
		variants: {
			variant: {
				default:
					'bg-neutral-200 text-neutral-950 border-neutral-200 [a]:hover:bg-neutral-300',
				secondary:
					'bg-neutral-800 text-neutral-200 [a]:hover:bg-neutral-700',
				destructive:
					'bg-neutral-300 text-neutral-950 border-neutral-300 [a]:hover:bg-neutral-400',
				outline:
					'bg-neutral-900 text-neutral-300 border-neutral-700 [a]:hover:bg-neutral-800 [a]:hover:text-neutral-100',
				ghost: 'bg-transparent border-transparent hover:bg-neutral-800 hover:text-neutral-100',
				link: 'bg-transparent border-transparent px-0 normal-case tracking-normal text-neutral-200 underline-offset-4 hover:underline',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

function Badge({
	className,
	variant = 'default',
	render,
	...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
	return useRender({
		defaultTagName: 'span',
		props: mergeProps<'span'>(
			{
				className: cn(badgeVariants({ variant }), className),
			},
			props
		),
		render,
		state: {
			slot: 'badge',
			variant,
		},
	});
}

export { Badge, badgeVariants };
