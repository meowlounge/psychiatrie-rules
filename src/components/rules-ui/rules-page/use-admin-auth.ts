'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

import type { Provider, Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { oauthProviderLabelMap, type UseAdminAuthResult } from './types';
import { parseAdminStatusResponse, resolveOauthProvider } from './utils';

async function fetchAdminStatus(token: string) {
	const response = await fetch('/api/auth/admin-status', {
		method: 'GET',
		headers: {
			authorization: `Bearer ${token}`,
		},
		cache: 'no-store',
	});
	const responseBody = parseAdminStatusResponse(
		await response.json().catch(() => null)
	);

	return {
		response,
		responseBody,
	};
}

export function useAdminAuth(): UseAdminAuthResult {
	const supabaseRef = useRef(getSupabaseBrowserClient());
	const isMountedRef = useRef(true);
	const adminStatusRequestRef = useRef(0);
	const oauthProviderRef = useRef(resolveOauthProvider());
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [authenticatedEmail, setAuthenticatedEmail] = useState<string | null>(
		null
	);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isAuthLoading, setIsAuthLoading] = useState(true);
	const [isResolvingAdmin, setIsResolvingAdmin] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);
	const [isStartingLogin, setIsStartingLogin] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);

	const oauthProviderLabel = useMemo(() => {
		const provider = oauthProviderRef.current;

		return oauthProviderLabelMap[provider];
	}, []);

	const canCreateRules = useMemo(
		() => Boolean(accessToken) && isAdmin,
		[accessToken, isAdmin]
	);

	const isAuthBusy = useMemo(
		() => isAuthLoading || isResolvingAdmin,
		[isAuthLoading, isResolvingAdmin]
	);

	const resolveAdminStatus = useCallback(async (token: string) => {
		const requestId = adminStatusRequestRef.current + 1;
		adminStatusRequestRef.current = requestId;
		setIsResolvingAdmin(true);

		try {
			const { response, responseBody } = await fetchAdminStatus(token);

			if (!isMountedRef.current) {
				return;
			}

			if (requestId !== adminStatusRequestRef.current) {
				return;
			}

			if (response.status === 401) {
				setIsAdmin(false);
				setAuthError('anmeldung abgelaufen. bitte erneut anmelden.');
				return;
			}

			if (!response.ok) {
				const message =
					typeof responseBody?.error === 'string'
						? responseBody.error
						: 'admin-status konnte nicht geladen werden.';

				setIsAdmin(false);
				setAuthError(message);
				return;
			}

			const isAuthenticated = responseBody?.isAuthenticated === true;
			const hasAdminAccess = responseBody?.isAdmin === true;

			setAuthenticatedEmail(responseBody?.email ?? null);
			setIsAdmin(isAuthenticated && hasAdminAccess);
			setAuthError(
				isAuthenticated && !hasAdminAccess
					? 'eingeloggt, aber ohne admin-freigabe.'
					: null
			);
		} catch {
			if (!isMountedRef.current) {
				return;
			}

			if (requestId !== adminStatusRequestRef.current) {
				return;
			}

			setIsAdmin(false);
			setAuthError('admin-status konnte nicht geladen werden.');
		} finally {
			if (!isMountedRef.current) {
				return;
			}

			if (requestId !== adminStatusRequestRef.current) {
				return;
			}

			setIsResolvingAdmin(false);
		}
	}, []);

	const syncSessionState = useCallback(
		async (session: Session | null) => {
			if (!session) {
				setAccessToken(null);
				setAuthenticatedEmail(null);
				setIsAdmin(false);
				setAuthError(null);
				setIsAuthLoading(false);
				return;
			}

			setAccessToken(session.access_token);
			setAuthenticatedEmail(session.user.email ?? null);
			await resolveAdminStatus(session.access_token);
			setIsAuthLoading(false);
		},
		[resolveAdminStatus]
	);

	const handleStartLogin = useCallback(async () => {
		setAuthError(null);
		setIsStartingLogin(true);

		try {
			const provider = oauthProviderRef.current as Provider;
			const { error } = await supabaseRef.current.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: window.location.origin,
				},
			});

			if (error) {
				setAuthError(error.message);
			}
		} catch {
			setAuthError('oauth-login konnte nicht gestartet werden.');
		} finally {
			setIsStartingLogin(false);
		}
	}, []);

	const handleSignOut = useCallback(async () => {
		setAuthError(null);
		setIsSigningOut(true);

		try {
			const { error } = await supabaseRef.current.auth.signOut();

			if (error) {
				setAuthError(error.message);
			}
		} catch {
			setAuthError('abmeldung fehlgeschlagen.');
		} finally {
			setIsSigningOut(false);
		}
	}, []);

	useEffect(() => {
		const supabase = supabaseRef.current;

		void supabase.auth
			.getSession()
			.then(({ data }) => syncSessionState(data.session));

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, nextSession) => {
			void syncSessionState(nextSession);
		});

		return () => {
			isMountedRef.current = false;
			subscription.unsubscribe();
		};
	}, [syncSessionState]);

	return {
		accessToken,
		authenticatedEmail,
		isAdmin,
		canCreateRules,
		isAuthBusy,
		authError,
		isStartingLogin,
		isSigningOut,
		oauthProviderLabel,
		handleStartLogin,
		handleSignOut,
	};
}
