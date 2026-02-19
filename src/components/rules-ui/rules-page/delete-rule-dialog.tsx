'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import type { RuleViewModel } from '@/types/rules';

import { useCallback, useEffect, useMemo, useState } from 'react';

interface DeleteRuleDialogProps {
	rule: RuleViewModel | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	accessToken: string | null;
	isAdmin: boolean;
	actionButtonClassName: string;
	refreshRules: () => Promise<void>;
}

function getRulePreviewText(rule: RuleViewModel | null) {
	if (!rule) {
		return '';
	}

	if (rule.content.length <= 160) {
		return rule.content;
	}

	return `${rule.content.slice(0, 157)}...`;
}

export function DeleteRuleDialog({
	rule,
	isOpen,
	onOpenChange,
	accessToken,
	isAdmin,
	actionButtonClassName,
	refreshRules,
}: DeleteRuleDialogProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const rulePreviewText = useMemo(() => getRulePreviewText(rule), [rule]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setError(null);
	}, [isOpen]);

	const handleDeleteRule = useCallback(async () => {
		if (!rule || !accessToken || !isAdmin) {
			setError('du bist nicht als admin eingeloggt.');
			return;
		}

		setError(null);
		setIsDeleting(true);

		try {
			const response = await fetch(`/api/rules/${rule.id}`, {
				method: 'DELETE',
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});
			const responseBody = await response.json().catch(() => null);

			if (!response.ok) {
				const message =
					typeof responseBody?.error === 'string'
						? responseBody.error
						: 'regel konnte nicht gelöscht werden.';

				setError(message);
				return;
			}

			await refreshRules();
			onOpenChange(false);
		} catch {
			setError('regel konnte nicht gelöscht werden.');
		} finally {
			setIsDeleting(false);
		}
	}, [accessToken, isAdmin, onOpenChange, refreshRules, rule]);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='border-stone-700 bg-stone-900 text-stone-100 sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='text-sm uppercase tracking-[0.08em]'>
						regel löschen
					</DialogTitle>
					<DialogDescription className='text-xs text-stone-400'>
						diese regel wird deaktiviert und verschwindet live aus
						der liste
					</DialogDescription>
				</DialogHeader>

				{rule && (
					<p className='border border-stone-800 bg-stone-950 p-3 text-xs leading-relaxed text-stone-300'>
						{rulePreviewText}
					</p>
				)}

				<button
					type='button'
					onClick={() => void handleDeleteRule()}
					disabled={isDeleting}
					className={actionButtonClassName}>
					{isDeleting ? 'wird gelöscht ...' : 'regel löschen'}
				</button>

				{error && <p className='text-xs text-stone-400'>{error}</p>}
			</DialogContent>
		</Dialog>
	);
}
