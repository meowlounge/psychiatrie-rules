import { getBearerTokenFromRequest } from '@/lib/admin-access';
import { getAdminAuthStatusFromAccessToken } from '@/lib/admin-auth';

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
	const accessToken = getBearerTokenFromRequest(request);

	if (!accessToken) {
		return NextResponse.json(
			{
				isAuthenticated: false,
				isAdmin: false,
				error: 'Unauthorized',
			},
			{ status: 401 }
		);
	}

	try {
		const adminAuthStatus =
			await getAdminAuthStatusFromAccessToken(accessToken);

		if (!adminAuthStatus.isAuthenticated) {
			return NextResponse.json(
				{
					isAuthenticated: false,
					isAdmin: false,
					error: adminAuthStatus.error ?? 'Unauthorized',
				},
				{ status: 401 }
			);
		}

		return NextResponse.json(
			{
				isAuthenticated: true,
				isAdmin: adminAuthStatus.isAdmin,
				email: adminAuthStatus.email ?? null,
			},
			{
				headers: {
					'cache-control': 'no-store',
				},
			}
		);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: 'Could not resolve admin status.';

		return NextResponse.json({ error: message }, { status: 500 });
	}
}
