import { cn } from '@/lib/utils';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none border-0 bg-transparent text-neutral-300 text-sm font-normal transition-colors hover:bg-white hover:text-black disabled:pointer-events-none disabled:text-neutral-600 disabled:hover:bg-transparent disabled:hover:text-neutral-600 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-white/60",
	{
		variants: {
			variant: {
				default: '',
				destructive: '',
				outline: '',
				secondary: '',
				ghost: '',
				link: 'underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-3 py-2 has-[>svg]:px-2',
				xs: "h-6 gap-1 px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: 'h-8 gap-1.5 px-2.5 has-[>svg]:px-2',
				lg: 'h-10 px-4 has-[>svg]:px-3',
				icon: 'size-9',
				'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
				'icon-sm': 'size-8',
				'icon-lg': 'size-10',
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
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : 'button';

	return (
		<Comp
			data-slot='button'
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
