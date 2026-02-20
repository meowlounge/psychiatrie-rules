'use client';

import { cn } from '@/lib/utils';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
	"focus-visible:border-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-500/60 rounded-none border border-neutral-700 bg-neutral-800 text-sm uppercase tracking-[0.08em] text-neutral-100 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-colors disabled:pointer-events-none disabled:bg-neutral-900 disabled:text-neutral-500 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none",
	{
		variants: {
			variant: {
				default: 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700',
				outline: 'bg-neutral-900 text-neutral-200 hover:bg-neutral-800',
				secondary:
					'border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800',
				ghost: 'border-transparent bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100',
				destructive:
					'border-neutral-300 bg-neutral-200 text-neutral-950 hover:bg-neutral-300',
				link: 'border-transparent bg-transparent px-0 py-0 normal-case tracking-normal text-neutral-200 underline-offset-4 hover:underline',
			},
			size: {
				default:
					"h-10 gap-2 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
				xs: "h-8 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-9 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
				lg: "h-11 gap-2 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-4",
				icon: "size-10 [&_svg:not([class*='size-'])]:size-4",
				'icon-xs': "size-8 [&_svg:not([class*='size-'])]:size-3",
				'icon-sm': "size-9 [&_svg:not([class*='size-'])]:size-3.5",
				'icon-lg': "size-11 [&_svg:not([class*='size-'])]:size-4",
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

function Button({
	className,
	variant = 'default',
	size = 'default',
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	return (
		<ButtonPrimitive
			data-slot='button'
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
