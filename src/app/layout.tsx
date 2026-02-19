import type { Metadata } from 'next';
import { Fragment_Mono } from 'next/font/google';

import './globals.css';

const mono = Fragment_Mono({
	variable: '--font-fragment-mono',
	subsets: ['latin'],
	weight: ['400'],
});

export const metadata: Metadata = {
	title: 'psychiatrie regeln',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='de'>
			<body
				className={`${mono.variable} min-h-screen bg-background font-mono text-foreground antialiased select-none`}>
				<div className='mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16'>
					{children}
				</div>
			</body>
		</html>
	);
}
