'use client';

import { Button } from '@/components/ui/button';

import { useHasMounted } from '@/hooks/use-has-mounted';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { JSX } from 'react';

/**
 * A client-side dropdown menu for switching between light, dark, and system themes.
 *
 * @returns A dropdown menu JSX element for toggling the app theme.
 *
 * @author prodbyeagle
 */
export function ThemeToggle(): JSX.Element {
	const { theme, setTheme } = useTheme();
	const hasMounted = useHasMounted();

	if (!hasMounted) {
		return <></>;
	}

	const themeOrder = ['light', 'dark', 'system'] as const;
	const currentTheme =
		theme === 'light' || theme === 'dark' || theme === 'system'
			? theme
			: 'system';
	const currentThemeIndex = themeOrder.indexOf(currentTheme);
	const nextTheme = themeOrder[(currentThemeIndex + 1) % themeOrder.length];

	const ThemeIcon =
		currentTheme === 'light'
			? Sun
			: currentTheme === 'dark'
				? Moon
				: Monitor;

	return (
		<Button
			type='button'
			size='icon'
			aria-label={`Theme wechseln (${currentTheme})`}
			onClick={() => setTheme(nextTheme)}>
			<ThemeIcon className='h-[1.1rem] w-[1.1rem]' />
		</Button>
	);
}
