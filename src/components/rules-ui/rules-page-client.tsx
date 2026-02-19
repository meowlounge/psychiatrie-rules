'use client';

import { RuleCard } from '@/components/rules-ui/rule-card';
import { AccountDialog } from '@/components/rules-ui/rules-page/account-dialog';
import { CreateRuleSection } from '@/components/rules-ui/rules-page/create-rule-section';
import type { RulesPageClientProps } from '@/components/rules-ui/rules-page/types';
import { useAdminAuth } from '@/components/rules-ui/rules-page/use-admin-auth';
import { useCreateRuleForm } from '@/components/rules-ui/rules-page/use-create-rule-form';
import { useLiveRules } from '@/components/rules-ui/rules-page/use-live-rules';
import {
	formatSyncTime,
	getActionButtonClassName,
	getInputClassName,
} from '@/components/rules-ui/rules-page/utils';

import { useMemo } from 'react';

export function RulesPageClient({ rules, loadError }: RulesPageClientProps) {
	const { liveRules, syncError, lastSyncedAt, isSyncing, refreshRules } =
		useLiveRules({ rules });
	const {
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
	} = useAdminAuth();
	const {
		formState,
		isSubmittingRule,
		createRuleError,
		createRuleSuccess,
		handleContentChange,
		handleNoteChange,
		handlePriorityChange,
		handleIsNewChange,
		handleIsLimitedTimeChange,
		handleLimitedStartAtChange,
		handleLimitedEndAtChange,
		handleCreateRule,
	} = useCreateRuleForm({
		accessToken,
		isAdmin,
		refreshRules,
	});

	const inputClassName = useMemo(() => getInputClassName(), []);
	const actionButtonClassName = useMemo(() => getActionButtonClassName(), []);

	return (
		<main className='min-h-screen'>
			<div className='space-y-8 sm:space-y-10'>
				<header className='space-y-2'>
					<div className='flex items-start justify-between gap-4'>
						<div className='space-y-2'>
							<div className='flex items-center gap-3'>
								<h1 className='text-base sm:text-lg'>
									psychiatrie regeln
								</h1>
								<span
									className={`px-1 text-[11px] uppercase tracking-[0.08em] ${
										isSyncing
											? 'animate-pulse bg-stone-700 text-stone-100'
											: 'bg-stone-800 text-stone-400'
									}`}>
									live
								</span>
							</div>
							<p className='text-xs text-muted-foreground sm:text-sm'>
								{liveRules.length} regeln · zuletzt
								aktualisiert: {formatSyncTime(lastSyncedAt)}
							</p>
						</div>
						<AccountDialog
							canCreateRules={canCreateRules}
							isAuthBusy={isAuthBusy}
							accessToken={accessToken}
							authenticatedEmail={authenticatedEmail}
							authError={authError}
							isStartingLogin={isStartingLogin}
							isSigningOut={isSigningOut}
							oauthProviderLabel={oauthProviderLabel}
							actionButtonClassName={actionButtonClassName}
							handleStartLogin={handleStartLogin}
							handleSignOut={handleSignOut}
						/>
					</div>
				</header>

				<CreateRuleSection
					canCreateRules={canCreateRules}
					formState={formState}
					isSubmittingRule={isSubmittingRule}
					createRuleError={createRuleError}
					createRuleSuccess={createRuleSuccess}
					inputClassName={inputClassName}
					actionButtonClassName={actionButtonClassName}
					handleContentChange={handleContentChange}
					handleNoteChange={handleNoteChange}
					handlePriorityChange={handlePriorityChange}
					handleIsNewChange={handleIsNewChange}
					handleIsLimitedTimeChange={handleIsLimitedTimeChange}
					handleLimitedStartAtChange={handleLimitedStartAtChange}
					handleLimitedEndAtChange={handleLimitedEndAtChange}
					handleCreateRule={handleCreateRule}
				/>

				{loadError && (
					<p className='text-xs text-muted-foreground sm:text-sm'>
						{loadError}
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
						className={`space-y-5 transition-all duration-150 sm:space-y-6 ${
							isSyncing ? 'blur-[1.5px] opacity-90' : ''
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
