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
		'bg-neutral-900',
		'text-neutral-100',
		'placeholder:text-neutral-600',
		'border',
		'border-neutral-700',
		'px-3',
		'py-2',
		'min-h-10',
		'text-sm',
		'leading-5',
		'outline-none',
		'focus-visible:border-neutral-500',
		'focus-visible:ring-1',
		'focus-visible:ring-neutral-500/60',
		'transition-colors',
	].join(' ');
}

export function getActionButtonClassName() {
	return [
		'inline-flex',
		'items-center',
		'justify-center',
		'gap-2',
		'px-3',
		'py-1.5',
		'min-h-10',
		'text-sm',
		'uppercase',
		'tracking-[0.08em]',
		'bg-neutral-800',
		'text-neutral-100',
		'border',
		'border-neutral-700',
		'transition-colors',
		'hover:bg-neutral-700',
		'focus-visible:outline-none',
		'focus-visible:ring-1',
		'focus-visible:ring-neutral-500/60',
		'disabled:cursor-not-allowed',
		'disabled:bg-neutral-900',
		'disabled:text-neutral-500',
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
