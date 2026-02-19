'use client';

import { fetchActiveRulesFromSupabaseClient } from '@/lib/rules';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

import type { RuleViewModel } from '@/types/rules';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { UseLiveRulesResult } from './types';

interface UseLiveRulesOptions {
	rules: RuleViewModel[];
}

export function useLiveRules({
	rules,
}: UseLiveRulesOptions): UseLiveRulesResult {
	const supabaseRef = useRef(getSupabaseBrowserClient());
	const refreshTimerRef = useRef<number | null>(null);
	const isRefreshingRef = useRef(false);
	const hasPendingRefreshRef = useRef(false);
	const [liveRules, setLiveRules] = useState(rules);
	const [syncError, setSyncError] = useState<string | null>(null);
	const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
	const [isSyncing, setIsSyncing] = useState(false);

	const refreshRules = useCallback(async () => {
		if (isRefreshingRef.current) {
			hasPendingRefreshRef.current = true;
			return;
		}

		isRefreshingRef.current = true;
		setIsSyncing(true);

		try {
			const nextRules = await fetchActiveRulesFromSupabaseClient(
				supabaseRef.current
			);

			setLiveRules(nextRules);
			setLastSyncedAt(new Date().toISOString());
			setSyncError(null);
		} catch {
			setSyncError('aktualisierung fehlgeschlagen.');
		} finally {
			isRefreshingRef.current = false;
			setIsSyncing(false);

			if (hasPendingRefreshRef.current) {
				hasPendingRefreshRef.current = false;
				void refreshRules();
			}
		}
	}, []);

	const scheduleRefreshRules = useCallback(() => {
		if (refreshTimerRef.current) {
			window.clearTimeout(refreshTimerRef.current);
		}

		refreshTimerRef.current = window.setTimeout(() => {
			void refreshRules();
		}, 180);
	}, [refreshRules]);

	useEffect(() => {
		const supabase = supabaseRef.current;
		const channel = supabase
			.channel('rules-live')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'rules',
				},
				() => {
					scheduleRefreshRules();
				}
			)
			.subscribe((status) => {
				if (status === 'SUBSCRIBED') {
					setLastSyncedAt(new Date().toISOString());
				}
			});

		return () => {
			if (refreshTimerRef.current) {
				window.clearTimeout(refreshTimerRef.current);
			}

			void supabase.removeChannel(channel);
		};
	}, [scheduleRefreshRules]);

	return {
		liveRules,
		syncError,
		lastSyncedAt,
		isSyncing,
		refreshRules,
	};
}
