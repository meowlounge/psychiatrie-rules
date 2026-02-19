import { pingSupabaseRulesTable } from '@/lib/rules';

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function isAuthorized(request: Request) {
	const cronSecret = process.env.CRON_SECRET;

	if (!cronSecret) {
		return true;
	}

	const authorization = request.headers.get('authorization');
	const customSecret = request.headers.get('x-cron-secret');

	if (authorization === `Bearer ${cronSecret}`) {
		return true;
	}

	if (customSecret === cronSecret) {
		return true;
	}

	return false;
}

export async function GET(request: Request) {
	if (!isAuthorized(request)) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await pingSupabaseRulesTable();
	} catch (error) {
		return NextResponse.json(
			{
				ok: false,
				error:
					error instanceof Error ? error.message : 'Keepalive failed',
			},
			{ status: 500 }
		);
	}

	return NextResponse.json({
		ok: true,
		timestamp: new Date().toISOString(),
	});
}
