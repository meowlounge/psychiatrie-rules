import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const envSchema = z.object({
	NEXT_PUBLIC_SUPABASE_URL: z.url(),
	SUPABASE_SECRET_KEY: z.string().min(1),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

function getServerEnv() {
	if (cachedEnv) {
		return cachedEnv;
	}

	const parsed = envSchema.safeParse(process.env);

	if (!parsed.success) {
		throw new Error(
			'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and/or ' +
				'SUPABASE_SECRET_KEY'
		);
	}

	cachedEnv = parsed.data;

	return cachedEnv;
}

export function getSupabaseServerClient() {
	const env = getServerEnv();

	return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}
