'use client';

import { RuleCard } from '@/components/rules-ui/rule-card';

import { fetchActiveRulesFromSupabaseClient } from '@/lib/rules';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

import type { CreateRuleInput, RuleViewModel } from '@/types/rules';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

interface RulesPageClientProps {
  rules: RuleViewModel[];
  loadError?: string;
  adminToken?: string;
  canCreateRules: boolean;
  adminAccessError?: string;
}

interface RuleCreateFormState {
  content: string;
  note: string;
  isNew: boolean;
  isLimitedTime: boolean;
  limitedStartAt: string;
  limitedEndAt: string;
  priority: string;
}

function createInitialFormState(): RuleCreateFormState {
  return {
    content: '',
    note: '',
    isNew: false,
    isLimitedTime: false,
    limitedStartAt: '',
    limitedEndAt: '',
    priority: '100',
  };
}

function formatSyncTime(timestamp: string | null) {
  if (!timestamp) {
    return 'jetzt';
  }

  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

function toIsoTimestamp(value: string) {
  if (!value) {
    return undefined;
  }

  const timestamp = new Date(value);

  if (Number.isNaN(timestamp.getTime())) {
    return undefined;
  }

  return timestamp.toISOString();
}

function toCreateRulePayload(formState: RuleCreateFormState): CreateRuleInput {
  const parsedPriority = Number.parseInt(formState.priority, 10);
  const priority = Number.isFinite(parsedPriority) ? parsedPriority : 100;

  return {
    content: formState.content.trim(),
    note: formState.note.trim() || undefined,
    isNew: formState.isNew,
    isLimitedTime: formState.isLimitedTime,
    limitedStartAt: formState.isLimitedTime
      ? toIsoTimestamp(formState.limitedStartAt)
      : undefined,
    limitedEndAt: formState.isLimitedTime
      ? toIsoTimestamp(formState.limitedEndAt)
      : undefined,
    priority,
  };
}

function getInputClassName() {
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

function getActionButtonClassName() {
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

export function RulesPageClient({
  rules,
  loadError,
  adminToken,
  canCreateRules,
  adminAccessError,
}: RulesPageClientProps) {
  const supabaseRef = useRef(getSupabaseBrowserClient());
  const refreshTimerRef = useRef<number | null>(null);
  const isRefreshingRef = useRef(false);
  const hasPendingRefreshRef = useRef(false);
  const [liveRules, setLiveRules] = useState(rules);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSubmittingRule, setIsSubmittingRule] = useState(false);
  const [createRuleError, setCreateRuleError] = useState<string | null>(null);
  const [createRuleSuccess, setCreateRuleSuccess] = useState<string | null>(
    null
  );
  const [formState, setFormState] = useState<RuleCreateFormState>(
    createInitialFormState
  );

  const inputClassName = useMemo(() => getInputClassName(), []);
  const actionButtonClassName = useMemo(() => getActionButtonClassName(), []);

  const refreshRules = useCallback(async () => {
    if (isRefreshingRef.current) {
      hasPendingRefreshRef.current = true;
      return;
    }

    isRefreshingRef.current = true;
    setIsSyncing(true);

    try {
      const supabase = supabaseRef.current;
      const nextRules =
        await fetchActiveRulesFromSupabaseClient(supabase);

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

  const handleContentChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setFormState((previousState) => ({
        ...previousState,
        content: event.target.value,
      }));
    },
    []
  );

  const handleNoteChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((previousState) => ({
        ...previousState,
        note: event.target.value,
      }));
    },
    []
  );

  const handlePriorityChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((previousState) => ({
        ...previousState,
        priority: event.target.value,
      }));
    },
    []
  );

  const handleIsNewChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((previousState) => ({
        ...previousState,
        isNew: event.target.checked,
      }));
    },
    []
  );

  const handleIsLimitedTimeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const isLimitedTime = event.target.checked;

      setFormState((previousState) => ({
        ...previousState,
        isLimitedTime,
        limitedStartAt: isLimitedTime
          ? previousState.limitedStartAt
          : '',
        limitedEndAt: isLimitedTime ? previousState.limitedEndAt : '',
      }));
    },
    []
  );

  const handleLimitedStartAtChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((previousState) => ({
        ...previousState,
        limitedStartAt: event.target.value,
      }));
    },
    []
  );

  const handleLimitedEndAtChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((previousState) => ({
        ...previousState,
        limitedEndAt: event.target.value,
      }));
    },
    []
  );

  const handleCreateRule = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!adminToken) {
        setCreateRuleError('kein admin token vorhanden.');
        return;
      }

      setCreateRuleError(null);
      setCreateRuleSuccess(null);
      setIsSubmittingRule(true);

      try {
        const payload = toCreateRulePayload(formState);
        const response = await fetch('/api/rules', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(payload),
        });
        const responseBody = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            typeof responseBody?.error === 'string'
              ? responseBody.error
              : 'regel konnte nicht erstellt werden.';

          setCreateRuleError(message);
          return;
        }

        setCreateRuleSuccess('regel erstellt.');
        setFormState(createInitialFormState());
        void refreshRules();
      } catch {
        setCreateRuleError('regel konnte nicht erstellt werden.');
      } finally {
        setIsSubmittingRule(false);
      }
    },
    [adminToken, formState, refreshRules]
  );

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

  return (
    <main className='min-h-screen'>
      <div className='space-y-8 sm:space-y-10'>
        <header className='space-y-2'>
          <div className='flex items-center gap-3'>
            <h1 className='text-base sm:text-lg'>
              psychiatrie regeln
            </h1>
            <span
              className={`px-1 text-[11px] uppercase tracking-[0.08em] ${isSyncing
                  ? 'animate-pulse bg-stone-700 text-stone-100'
                  : 'bg-stone-800 text-stone-400'
                }`}>
              live
            </span>
          </div>
          <p className='text-xs text-muted-foreground sm:text-sm'>
            {liveRules.length} regeln · zuletzt aktualisiert:{' '}
            {formatSyncTime(lastSyncedAt)}
          </p>
        </header>

        {canCreateRules && (
          <section className='space-y-3 border-t border-stone-800 pt-5'>
            <p className='text-xs uppercase tracking-[0.08em] text-stone-400'>
              regel erstellen
            </p>
            <form onSubmit={handleCreateRule} className='space-y-3'>
              <textarea
                value={formState.content}
                onChange={handleContentChange}
                placeholder='regeltext'
                required
                rows={4}
                className={inputClassName}
              />
              <input
                type='text'
                value={formState.note}
                onChange={handleNoteChange}
                placeholder='notiz (optional)'
                className={inputClassName}
              />
              <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
                <label className='flex items-center gap-2 text-xs text-stone-300'>
                  <input
                    type='checkbox'
                    checked={formState.isNew}
                    onChange={handleIsNewChange}
                    className='h-3 w-3 accent-stone-300'
                  />
                  new
                </label>
                <label className='flex items-center gap-2 text-xs text-stone-300'>
                  <input
                    type='checkbox'
                    checked={formState.isLimitedTime}
                    onChange={handleIsLimitedTimeChange}
                    className='h-3 w-3 accent-stone-300'
                  />
                  limited
                </label>
                <input
                  type='number'
                  value={formState.priority}
                  onChange={handlePriorityChange}
                  placeholder='priority'
                  className={inputClassName}
                />
              </div>

              {formState.isLimitedTime && (
                <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                  <input
                    type='datetime-local'
                    value={formState.limitedStartAt}
                    onChange={handleLimitedStartAtChange}
                    className={inputClassName}
                  />
                  <input
                    type='datetime-local'
                    value={formState.limitedEndAt}
                    onChange={handleLimitedEndAtChange}
                    className={inputClassName}
                  />
                </div>
              )}

              <button
                type='submit'
                disabled={isSubmittingRule}
                className={actionButtonClassName}>
                {isSubmittingRule
                  ? 'wird erstellt ...'
                  : 'regel erstellen'}
              </button>
            </form>

            {createRuleError && (
              <p className='text-xs text-stone-400'>
                {createRuleError}
              </p>
            )}

            {createRuleSuccess && (
              <p className='text-xs text-stone-300'>
                {createRuleSuccess}
              </p>
            )}
          </section>
        )}

        {loadError && (
          <p className='text-xs text-muted-foreground sm:text-sm'>
            {loadError}
          </p>
        )}

        {adminAccessError && (
          <p className='text-xs text-muted-foreground sm:text-sm'>
            {adminAccessError}
          </p>
        )}

        {syncError && (
          <p className='text-xs text-muted-foreground sm:text-sm'>
            {syncError}
          </p>
        )}

        {liveRules.length === 0 ? (
          <p className='text-sm text-muted-foreground sm:text-base'>
            keine regeln verfügbar.
          </p>
        ) : (
          <section
            className={`space-y-5 transition-all duration-150 sm:space-y-6 ${isSyncing ? 'blur-[1.5px] opacity-90' : ''
              }`}>
            {liveRules.map((rule, index) => (
              <RuleCard key={rule.id} rule={rule} index={index} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
