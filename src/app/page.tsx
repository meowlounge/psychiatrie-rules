import { RulesPageClient } from '@/components/rules-ui/rules-page-client';

import { fetchActiveRules } from '@/lib/rules';

export const dynamic = 'force-dynamic';

interface RulesPageData {
	rules: Awaited<ReturnType<typeof fetchActiveRules>>;
	loadError?: string;
}

export default async function HomePage() {
	const rulesPageData = await fetchActiveRules()
		.then((rules): RulesPageData => ({ rules }))
		.catch(
			(): RulesPageData => ({
				rules: [],
				loadError: 'regeln sind gerade nicht erreichbar.',
			})
		);

	return (
		<RulesPageClient
			rules={rulesPageData.rules}
			loadError={rulesPageData.loadError}
		/>
	);
}
