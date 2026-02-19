import { createRule } from '@/lib/rules';

import { NextResponse } from 'next/server';

import { authorizeAdminRequest } from './route-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
	const authorization = await authorizeAdminRequest(request);

	if (!authorization.isAuthorized) {
		return authorization.response;
	}

	const payload = await request.json().catch(() => null);

	if (!payload) {
		return NextResponse.json(
			{ error: 'Invalid request payload.' },
			{ status: 400 }
		);
	}

	try {
		const rule = await createRule(payload, authorization.value.actor);

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
