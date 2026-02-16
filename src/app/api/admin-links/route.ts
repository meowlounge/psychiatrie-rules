import {
	createRulesAdminToken,
	getAdminLinkIssuerSecret,
	verifyRulesAdminToken,
} from '@/lib/admin-access';

import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const createAdminLinkSchema = z.object({
	ttlMinutes: z.coerce.number().int().min(5).max(120).optional(),
	actor: z.string().trim().max(120).optional(),
	issuer: z.string().trim().max(120).optional(),
});

interface CreateAdminLinkInput {
	ttlMinutes?: number | string;
	actor?: string;
	issuer?: string;
}

function normalizeCreateAdminLinkInput(input: unknown): CreateAdminLinkInput {
	if (!input || typeof input !== 'object') {
		return {};
	}

	const rawInput = input as Record<string, unknown>;
	const normalizedActor =
		typeof rawInput.actor === 'string'
			? rawInput.actor.trim() || undefined
			: undefined;
	const normalizedIssuer =
		typeof rawInput.issuer === 'string'
			? rawInput.issuer.trim() || undefined
			: undefined;

	return {
		ttlMinutes: (rawInput.ttlMinutes ?? rawInput.ttl_minutes) as
			| number
			| string
			| undefined,
		actor: normalizedActor,
		issuer: normalizedIssuer,
	};
}

function isAuthorized(request: Request) {
	const issuerSecret = getAdminLinkIssuerSecret();

	if (!issuerSecret) {
		return false;
	}

	const authorization = request.headers.get('authorization');
	const customSecret = request.headers.get('x-admin-link-secret');

	if (authorization === `Bearer ${issuerSecret}`) {
		return true;
	}

	if (customSecret === issuerSecret) {
		return true;
	}

	return false;
}

function resolveBaseUrl(request: Request) {
	const configuredBaseUrl =
		process.env.APP_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL;

	if (configuredBaseUrl) {
		return configuredBaseUrl;
	}

	return new URL(request.url).origin;
}

export async function POST(request: Request) {
	if (!isAuthorized(request)) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const rawBody = await request.json().catch(() => null);

	const parsedBody = createAdminLinkSchema.safeParse(
		normalizeCreateAdminLinkInput(rawBody)
	);

	if (!parsedBody.success) {
		return NextResponse.json(
			{ error: 'Invalid request payload.' },
			{ status: 400 }
		);
	}

	let token: string;

	try {
		token = createRulesAdminToken({
			ttlMinutes: parsedBody.data.ttlMinutes,
			subject: parsedBody.data.actor,
			issuer: parsedBody.data.issuer,
		});
	} catch (error) {
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: 'Could not create token.',
			},
			{ status: 500 }
		);
	}
	const verifiedToken = verifyRulesAdminToken(token);

	if (!verifiedToken.isValid || !verifiedToken.payload) {
		return NextResponse.json(
			{ error: verifiedToken.error ?? 'Could not create token.' },
			{ status: 500 }
		);
	}

	const expiresAtIso = new Date(
		verifiedToken.payload.exp * 1000
	).toISOString();
	const baseUrl = resolveBaseUrl(request);
	const adminUrl = `${baseUrl}/?admin=${encodeURIComponent(token)}`;

	return NextResponse.json(
		{
			token,
			url: adminUrl,
			expiresAt: expiresAtIso,
		},
		{
			headers: {
				'cache-control': 'no-store',
			},
		}
	);
}
