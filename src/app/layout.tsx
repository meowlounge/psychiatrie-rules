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
				<div className='mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-14 lg:py-20'>
					{children}
				</div>
			</body>
		</html>
	);
}
