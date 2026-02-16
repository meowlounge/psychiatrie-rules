'use client';

import { createClient } from '@supabase/supabase-js';

let browserSupabaseClient: ReturnType<typeof createClient> | null = null;

function getBrowserSupabaseKey() {
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	const publishableDefaultKey =
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
	const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

	return anonKey ?? publishableDefaultKey ?? publishableKey;
}

export function getSupabaseBrowserClient() {
	if (browserSupabaseClient) {
		return browserSupabaseClient;
	}

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseBrowserKey = getBrowserSupabaseKey();

	if (!supabaseUrl) {
		throw new Error(
			'Missing environment variable: NEXT_PUBLIC_SUPABASE_URL'
		);
	}

	if (!supabaseBrowserKey) {
		throw new Error(
			'Missing env var: set NEXT_PUBLIC_SUPABASE_ANON_KEY or ' +
				'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY'
		);
	}

	browserSupabaseClient = createClient(supabaseUrl, supabaseBrowserKey);

	return browserSupabaseClient;
}
