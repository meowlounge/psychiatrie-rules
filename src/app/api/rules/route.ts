import { getAdminAuthStatusFromAccessToken } from '@/lib/admin-auth';
import { getBearerTokenFromRequest } from '@/lib/http-auth';
import { createRule } from '@/lib/rules';

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
	const accessToken = getBearerTokenFromRequest(request);

	if (!accessToken) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	let adminAuthStatus: Awaited<
		ReturnType<typeof getAdminAuthStatusFromAccessToken>
	>;

	try {
		adminAuthStatus = await getAdminAuthStatusFromAccessToken(accessToken);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Could not verify user.';

		return NextResponse.json({ error: message }, { status: 500 });
	}

	if (!adminAuthStatus.isAuthenticated) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!adminAuthStatus.isAdmin) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}

	const payload = await request.json().catch(() => null);

	if (!payload) {
		return NextResponse.json(
			{ error: 'Invalid request payload.' },
			{ status: 400 }
		);
	}

	try {
		const createdBy = adminAuthStatus.email ?? adminAuthStatus.userId;
		const rule = await createRule(payload, createdBy);

		return NextResponse.json(
			{ rule },
			{
				status: 201,
				headers: {
					'cache-control': 'no-store',
				},
			}
		);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Could not create rule.';

		if (message === 'Invalid rule payload.') {
			return NextResponse.json({ error: message }, { status: 400 });
		}

		return NextResponse.json({ error: message }, { status: 500 });
	}
}
