import {
	defaultOauthProvider,
	oauthProviderLabelMap,
	type AdminStatusResponse,
	type SupportedOauthProvider,
} from '@/components/rules-ui/rules-page/types';

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

export function resolveOauthProvider(): SupportedOauthProvider {
	const configuredProvider = process.env.NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDER;

	if (!configuredProvider) {
		return defaultOauthProvider;
	}

	const normalizedProvider = configuredProvider.trim().toLowerCase();
	const isSupportedProvider = Object.hasOwn(
		oauthProviderLabelMap,
		normalizedProvider
	);

	if (!isSupportedProvider) {
		return defaultOauthProvider;
	}

	return normalizedProvider as SupportedOauthProvider;
}

export function parseAdminStatusResponse(responseBody: unknown) {
	if (!responseBody || typeof responseBody !== 'object') {
		return null;
	}

	return responseBody as AdminStatusResponse;
}
