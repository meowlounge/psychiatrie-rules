import type { AdminStatusResponse } from '@/components/rules-ui/rules-page/types';

export function formatSyncTime(timestamp: string | null) {
	if (!timestamp) {
		return 'jetzt';
	}

	return new Intl.DateTimeFormat('de-DE', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(new Date(timestamp));
}

export function getInputClassName() {
	return ['min-h-11', 'text-[15px]', 'leading-6'].join(' ');
}

export function getActionButtonClassName() {
	return [
		'px-4',
		'py-2',
		'min-h-11',
		'text-sm',
		'uppercase',
		'tracking-[0.08em]',
	].join(' ');
}

function isValidEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function extractSupabaseProjectRef() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

	if (!supabaseUrl) {
		return null;
	}

	try {
		const url = new URL(supabaseUrl);
		const projectRef = url.hostname.split('.')[0];

		return projectRef ?? null;
	} catch {
		return null;
	}
}

export function resolvePasswordLoginEmail() {
	const configuredEmail = process.env.NEXT_PUBLIC_SUPABASE_LOGIN_EMAIL;

	if (configuredEmail) {
		const normalizedEmail = configuredEmail.trim().toLowerCase();

		if (isValidEmail(normalizedEmail)) {
			return normalizedEmail;
		}
	}

	const generatedLocalPart =
		extractSupabaseProjectRef() ?? 'psychiatrie-rules-admin';

	return `${generatedLocalPart}@auth.local`;
}

export function parseAdminStatusResponse(responseBody: unknown) {
	if (!responseBody || typeof responseBody !== 'object') {
		return null;
	}

	return responseBody as AdminStatusResponse;
}
