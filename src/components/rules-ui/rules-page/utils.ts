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
	return [
		'w-full',
		'bg-stone-900',
		'text-stone-100',
		'placeholder:text-stone-600',
		'border',
		'border-stone-700',
		'px-2',
		'py-1.5',
		'text-sm',
		'outline-none',
		'focus-visible:border-stone-500',
	].join(' ');
}

export function getActionButtonClassName() {
	return [
		'px-2',
		'py-1',
		'text-xs',
		'uppercase',
		'tracking-[0.08em]',
		'bg-stone-800',
		'text-stone-100',
		'transition-colors',
		'hover:bg-stone-700',
		'disabled:cursor-not-allowed',
		'disabled:bg-stone-900',
		'disabled:text-stone-500',
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
