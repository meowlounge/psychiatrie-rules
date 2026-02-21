import { getAdminAuthStatusFromAccessToken } from '@/lib/admin-auth';
import { getBearerTokenFromRequest } from '@/lib/http-auth';

import { NextResponse } from 'next/server';

interface AuthorizedAdminResult {
	actor: string;
}

type AuthorizationResult =
	| {
			isAuthorized: true;
			value: AuthorizedAdminResult;
	  }
	| {
			isAuthorized: false;
			response: NextResponse;
	  };

export async function authorizeAdminRequest(
	request: Request
): Promise<AuthorizationResult> {
	const accessToken = getBearerTokenFromRequest(request);

	if (!accessToken) {
		return {
			isAuthorized: false,
			response: NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			),
		};
	}

	let adminAuthStatus: Awaited<
		ReturnType<typeof getAdminAuthStatusFromAccessToken>
	>;

	try {
		adminAuthStatus = await getAdminAuthStatusFromAccessToken(accessToken);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Could not verify user.';

		return {
			isAuthorized: false,
			response: NextResponse.json({ error: message }, { status: 500 }),
		};
	}

	if (!adminAuthStatus.isAuthenticated) {
		return {
			isAuthorized: false,
			response: NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			),
		};
	}

	if (!adminAuthStatus.isAdmin) {
		return {
			isAuthorized: false,
			response: NextResponse.json(
				{ error: 'Forbidden' },
				{ status: 403 }
			),
		};
	}

	return {
		isAuthorized: true,
		value: {
			actor: adminAuthStatus.email ?? adminAuthStatus.userId ?? 'admin',
		},
	};
}
