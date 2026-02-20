'use client';

import { RuleCard } from '@/components/rules-ui/rule-card';
import { AccountDialog } from '@/components/rules-ui/rules-page/account-dialog';
import { CreateRuleSection } from '@/components/rules-ui/rules-page/create-rule-section';
import { DeleteRuleDialog } from '@/components/rules-ui/rules-page/delete-rule-dialog';
import { EditRuleDialog } from '@/components/rules-ui/rules-page/edit-rule-dialog';
import type { RulesPageClientProps } from '@/components/rules-ui/rules-page/types';
import { useAdminAuth } from '@/components/rules-ui/rules-page/use-admin-auth';
import { useCreateRuleForm } from '@/components/rules-ui/rules-page/use-create-rule-form';
import { useLiveRules } from '@/components/rules-ui/rules-page/use-live-rules';
import {
	formatSyncTime,
	getActionButtonClassName,
	getInputClassName,
} from '@/components/rules-ui/rules-page/utils';

import type { RuleViewModel } from '@/types/rules';

import { useCallback, useMemo, useState } from 'react';

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
		isLoggingIn,
		isSigningOut,
		handlePasswordLogin,
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
		resetCreateRuleFeedback,
	} = useCreateRuleForm({
		accessToken,
		isAdmin,
		refreshRules,
	});
	const [ruleToEdit, setRuleToEdit] = useState<RuleViewModel | null>(null);
	const [ruleToDelete, setRuleToDelete] = useState<RuleViewModel | null>(
		null
	);

	const inputClassName = useMemo(() => getInputClassName(), []);
	const actionButtonClassName = useMemo(() => getActionButtonClassName(), []);
	const handleEditRule = useCallback((rule: RuleViewModel) => {
		setRuleToEdit(rule);
	}, []);
	const handleDeleteRule = useCallback((rule: RuleViewModel) => {
		setRuleToDelete(rule);
	}, []);
	const hasPageNotice = Boolean(loadError || syncError);

	return (
		<main className='min-h-screen pb-6'>
			<div className='border border-border'>
				<header className='border-b border-border px-4 py-4 sm:px-5 sm:py-5'>
					<div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
						<div className='space-y-2'>
							<div className='flex items-center gap-3'>
								<h1 className='text-lg leading-tight sm:text-xl'>
									psychiatrie regeln
								</h1>
								<span
									className={`px-1.5 py-0.5 text-xs uppercase tracking-[0.08em] ${
										isSyncing
											? 'animate-pulse bg-foreground text-background'
											: 'bg-muted text-muted-foreground'
									}`}>
									live
								</span>
							</div>
							<p className='text-sm text-muted-foreground'>
								{liveRules.length} regeln · zuletzt
								aktualisiert: {formatSyncTime(lastSyncedAt)}
							</p>
						</div>
						<div className='flex flex-wrap items-center gap-2'>
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
								handleIsLimitedTimeChange={
									handleIsLimitedTimeChange
								}
								handleLimitedStartAtChange={
									handleLimitedStartAtChange
								}
								handleLimitedEndAtChange={
									handleLimitedEndAtChange
								}
								handleCreateRule={handleCreateRule}
								resetCreateRuleFeedback={
									resetCreateRuleFeedback
								}
							/>
							<AccountDialog
								canCreateRules={canCreateRules}
								isAuthBusy={isAuthBusy}
								accessToken={accessToken}
								authenticatedEmail={authenticatedEmail}
								authError={authError}
								isLoggingIn={isLoggingIn}
								isSigningOut={isSigningOut}
								inputClassName={inputClassName}
								actionButtonClassName={actionButtonClassName}
								handlePasswordLogin={handlePasswordLogin}
								handleSignOut={handleSignOut}
							/>
						</div>
					</div>
				</header>

				{hasPageNotice && (
					<section
						className='space-y-2 border-b border-border px-4 py-3 sm:px-5 sm:py-4'
						role='status'
						aria-live='polite'>
						{loadError && (
							<p className='border border-border px-3 py-2 text-sm text-foreground'>
								{loadError}
							</p>
						)}
						{syncError && (
							<p className='border border-border px-3 py-2 text-sm text-foreground'>
								{syncError}
							</p>
						)}
					</section>
				)}

				<section
					className={`px-4 py-4 transition-all duration-150 sm:px-5 sm:py-5 ${
						isSyncing ? 'opacity-90' : ''
					}`}>
					{liveRules.length === 0 ? (
						<p className='text-sm text-muted-foreground sm:text-base'>
							keine regeln verfügbar.
						</p>
					) : (
						<div className='space-y-5 sm:space-y-6'>
							{liveRules.map((rule, index) => (
								<RuleCard
									key={rule.id}
									rule={rule}
									index={index}
									canManageRule={canCreateRules}
									handleEditRule={handleEditRule}
									handleDeleteRule={handleDeleteRule}
								/>
							))}
						</div>
					)}
				</section>
			</div>
			<EditRuleDialog
				rule={ruleToEdit}
				isOpen={Boolean(ruleToEdit)}
				onOpenChange={(isOpen) => {
					if (!isOpen) {
						setRuleToEdit(null);
					}
				}}
				accessToken={accessToken}
				isAdmin={isAdmin}
				inputClassName={inputClassName}
				actionButtonClassName={actionButtonClassName}
				refreshRules={refreshRules}
			/>
			<DeleteRuleDialog
				rule={ruleToDelete}
				isOpen={Boolean(ruleToDelete)}
				onOpenChange={(isOpen) => {
					if (!isOpen) {
						setRuleToDelete(null);
					}
				}}
				accessToken={accessToken}
				isAdmin={isAdmin}
				actionButtonClassName={actionButtonClassName}
				refreshRules={refreshRules}
			/>
		</main>
	);
}
