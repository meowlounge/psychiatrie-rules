import {
	getBearerTokenFromRequest,
	verifyRulesAdminToken,
} from '@/lib/admin-access';
import { createRule } from '@/lib/rules';

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
	const adminToken = getBearerTokenFromRequest(request);

	if (!adminToken) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const verifiedToken = verifyRulesAdminToken(adminToken);

	if (!verifiedToken.isValid || !verifiedToken.payload) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const payload = await request.json().catch(() => null);

	if (!payload) {
		return NextResponse.json(
			{ error: 'Invalid request payload.' },
			{ status: 400 }
		);
	}

	try {
		const rule = await createRule(payload, verifiedToken.payload.sub);

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
