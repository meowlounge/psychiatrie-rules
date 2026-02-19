import { DemoPageClient } from '@/components/demo/demo-page-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'component demo',
};

export default function DemoPage() {
	return <DemoPageClient />;
}
