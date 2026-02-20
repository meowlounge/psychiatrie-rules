import 'server-only';

import { getSupabaseServerClient } from '@/lib/supabase';

import { z } from 'zod';

const adminEnvSchema = z.object({
	RULES_ADMIN_EMAIL: z.email(),
});

export interface AdminAuthStatus {
	isAuthenticated: boolean;
	isAdmin: boolean;
	userId?: string;
	email?: string;
	error?: string;
}

let cachedAdminEmail: string | null = null;

function normalizeEmail(value: string) {
	return value.trim().toLowerCase();
}

function getRulesAdminEmail() {
	if (cachedAdminEmail) {
		return cachedAdminEmail;
	}

	const parsed = adminEnvSchema.safeParse(process.env);

	if (!parsed.success) {
		throw new Error('Missing environment variable: RULES_ADMIN_EMAIL');
	}

	cachedAdminEmail = normalizeEmail(parsed.data.RULES_ADMIN_EMAIL);

	return cachedAdminEmail;
}

function isRulesAdminEmail(email: string | null | undefined) {
	if (!email) {
		return false;
	}

	return normalizeEmail(email) === getRulesAdminEmail();
}

export async function getAdminAuthStatusFromAccessToken(accessToken: string) {
	const supabase = getSupabaseServerClient();
	const { data, error } = await supabase.auth.getUser(accessToken);

	if (error || !data.user) {
		return {
			isAuthenticated: false,
			isAdmin: false,
			error: 'Unauthorized',
		} satisfies AdminAuthStatus;
	}

	return {
		isAuthenticated: true,
		isAdmin: isRulesAdminEmail(data.user.email),
		userId: data.user.id,
		email: data.user.email,
	} satisfies AdminAuthStatus;
}
