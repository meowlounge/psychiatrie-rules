import { RulesPageClient } from '@/components/rules-ui/rules-page-client';

import { verifyRulesAdminToken } from '@/lib/admin-access';
import { fetchActiveRules } from '@/lib/rules';

export const dynamic = 'force-dynamic';

interface HomePageProps {
	searchParams?:
		| Record<string, string | string[] | undefined>
		| Promise<Record<string, string | string[] | undefined>>;
}

interface RulesPageData {
	rules: Awaited<ReturnType<typeof fetchActiveRules>>;
	loadError?: string;
}

function getSingleSearchParam(value: string | string[] | undefined) {
	if (!value) {
		return null;
	}

	return Array.isArray(value) ? (value[0] ?? null) : value;
}

export default async function HomePage({ searchParams }: HomePageProps) {
	const resolvedSearchParams = searchParams
		? await Promise.resolve(searchParams)
		: {};
	const adminToken = getSingleSearchParam(resolvedSearchParams.admin);
	const verifiedToken = adminToken
		? verifyRulesAdminToken(adminToken)
		: { isValid: false };
	const canCreateRules = Boolean(
		adminToken &&
		verifiedToken.isValid &&
		verifiedToken.payload?.scope === 'rules:create'
	);
	const adminAccessError =
		adminToken && !canCreateRules
			? 'admin-link ist ungültig oder abgelaufen.'
			: undefined;

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
			adminToken={canCreateRules ? (adminToken ?? undefined) : undefined}
			canCreateRules={canCreateRules}
			adminAccessError={adminAccessError}
		/>
	);
}
