'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { UseAdminAuthResult } from './types';
import { parseAdminStatusResponse, resolvePasswordLoginEmail } from './utils';

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
	const resolvedIdentityRef = useRef<string | null>(null);
	const loginEmailRef = useRef(resolvePasswordLoginEmail());
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [authenticatedEmail, setAuthenticatedEmail] = useState<string | null>(
		null
	);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isAuthLoading, setIsAuthLoading] = useState(true);
	const [isResolvingAdmin, setIsResolvingAdmin] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);

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
		async (
			event: AuthChangeEvent | 'INITIAL_FETCH',
			session: Session | null
		) => {
			if (!session) {
				setAccessToken(null);
				setAuthenticatedEmail(null);
				setIsAdmin(false);
				setAuthError(null);
				resolvedIdentityRef.current = null;
				setIsAuthLoading(false);
				return;
			}

			setAccessToken(session.access_token);
			setAuthenticatedEmail(session.user.email ?? null);

			const identityKey = `${session.user.id}:${session.user.email ?? ''}`;
			const hasResolvedIdentity =
				resolvedIdentityRef.current === identityKey;
			const shouldSkipAdminStatusRefresh =
				hasResolvedIdentity && event !== 'USER_UPDATED';

			if (shouldSkipAdminStatusRefresh) {
				setIsAuthLoading(false);
				return;
			}

			await resolveAdminStatus(session.access_token);
			resolvedIdentityRef.current = identityKey;
			setIsAuthLoading(false);
		},
		[resolveAdminStatus]
	);

	const handlePasswordLogin = useCallback(async (password: string) => {
		if (password.length === 0) {
			setAuthError('bitte passwort eingeben.');
			return;
		}

		setAuthError(null);
		setIsLoggingIn(true);

		try {
			const { error } = await supabaseRef.current.auth.signInWithPassword(
				{
					email: loginEmailRef.current,
					password,
				}
			);

			if (error) {
				setAuthError(error.message);
			}
		} catch {
			setAuthError('passwort-login konnte nicht gestartet werden.');
		} finally {
			setIsLoggingIn(false);
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
			.then(({ data }) =>
				syncSessionState('INITIAL_FETCH', data.session)
			);

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, nextSession) => {
			void syncSessionState(event, nextSession);
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
		isLoggingIn,
		isSigningOut,
		handlePasswordLogin,
		handleSignOut,
	};
}
