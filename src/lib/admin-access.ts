import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';

import { z } from 'zod';

const TOKEN_VERSION = 'v1';
const DEFAULT_TTL_MINUTES = 30;
const MIN_TTL_MINUTES = 5;
const MAX_TTL_MINUTES = 120;

const rulesAdminTokenSchema = z.object({
	iss: z.string().min(1),
	scope: z.literal('rules:create'),
	iat: z.number().int().positive(),
	exp: z.number().int().positive(),
	sub: z.string().min(1).optional(),
});

export type RulesAdminTokenPayload = z.infer<typeof rulesAdminTokenSchema>;

interface CreateRulesAdminTokenOptions {
	ttlMinutes?: number;
	subject?: string;
	issuer?: string;
}

interface VerifyRulesAdminTokenResult {
	isValid: boolean;
	payload?: RulesAdminTokenPayload;
	error?: string;
}

function getRulesAdminTokenSecret() {
	const secret = process.env.RULES_ADMIN_TOKEN_SECRET;

	if (!secret) {
		return null;
	}

	return secret;
}

function clampTtlMinutes(ttlMinutes: number) {
	return Math.max(
		MIN_TTL_MINUTES,
		Math.min(MAX_TTL_MINUTES, Math.floor(ttlMinutes))
	);
}

function signTokenPart(payloadPart: string, secret: string) {
	return createHmac('sha256', secret).update(payloadPart).digest('base64url');
}

function toTokenPayloadPart(payload: RulesAdminTokenPayload) {
	const jsonPayload = JSON.stringify(payload);

	return Buffer.from(jsonPayload, 'utf8').toString('base64url');
}

function fromTokenPayloadPart(payloadPart: string) {
	try {
		const decodedPayload = Buffer.from(payloadPart, 'base64url').toString(
			'utf8'
		);
		const payload = JSON.parse(decodedPayload);

		return rulesAdminTokenSchema.safeParse(payload);
	} catch {
		return null;
	}
}

export function createRulesAdminToken(
	options: CreateRulesAdminTokenOptions = {}
) {
	const secret = getRulesAdminTokenSecret();

	if (!secret) {
		throw new Error(
			'Missing environment variable: RULES_ADMIN_TOKEN_SECRET'
		);
	}

	const nowSeconds = Math.floor(Date.now() / 1000);
	const ttlMinutes = clampTtlMinutes(
		options.ttlMinutes ?? DEFAULT_TTL_MINUTES
	);

	const payload: RulesAdminTokenPayload = {
		iss: options.issuer ?? 'discord-bot',
		scope: 'rules:create',
		iat: nowSeconds,
		exp: nowSeconds + ttlMinutes * 60,
		sub: options.subject,
	};

	const payloadPart = toTokenPayloadPart(payload);
	const signaturePart = signTokenPart(payloadPart, secret);

	return `${TOKEN_VERSION}.${payloadPart}.${signaturePart}`;
}

export function verifyRulesAdminToken(
	token: string
): VerifyRulesAdminTokenResult {
	const secret = getRulesAdminTokenSecret();

	if (!secret) {
		return {
			isValid: false,
			error: 'RULES_ADMIN_TOKEN_SECRET is not configured.',
		};
	}

	const tokenParts = token.split('.');

	if (tokenParts.length !== 3) {
		return {
			isValid: false,
			error: 'Invalid token format.',
		};
	}

	const [versionPart, payloadPart, signaturePart] = tokenParts;

	if (versionPart !== TOKEN_VERSION) {
		return {
			isValid: false,
			error: 'Unsupported token version.',
		};
	}

	const expectedSignaturePart = signTokenPart(payloadPart, secret);
	const expectedBuffer = Buffer.from(expectedSignaturePart);
	const receivedBuffer = Buffer.from(signaturePart);

	if (expectedBuffer.length !== receivedBuffer.length) {
		return {
			isValid: false,
			error: 'Invalid token signature.',
		};
	}

	if (!timingSafeEqual(expectedBuffer, receivedBuffer)) {
		return {
			isValid: false,
			error: 'Invalid token signature.',
		};
	}

	const parsedPayload = fromTokenPayloadPart(payloadPart);

	if (!parsedPayload || !parsedPayload.success) {
		return {
			isValid: false,
			error: 'Invalid token payload.',
		};
	}

	const nowSeconds = Math.floor(Date.now() / 1000);
	const payload = parsedPayload.data;

	if (payload.exp <= nowSeconds) {
		return {
			isValid: false,
			error: 'Token has expired.',
		};
	}

	return {
		isValid: true,
		payload,
	};
}

export function getBearerTokenFromRequest(request: Request) {
	const authorization = request.headers.get('authorization');

	if (!authorization) {
		return null;
	}

	const [scheme, value] = authorization.split(' ');

	if (scheme !== 'Bearer' || !value) {
		return null;
	}

	return value;
}

export function getAdminLinkIssuerSecret() {
	return process.env.ADMIN_LINK_ISSUER_SECRET ?? null;
}
