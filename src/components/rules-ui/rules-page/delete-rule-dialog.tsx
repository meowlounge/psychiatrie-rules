'use client';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

import type { RuleViewModel } from '@/types/rules';

import { AlertTriangleIcon } from 'lucide-react';
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

	if (rule.content.length <= 220) {
		return rule.content;
	}

	return `${rule.content.slice(0, 217)}...`;
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
	const [isConfirmed, setIsConfirmed] = useState(false);
	const rulePreviewText = useMemo(() => getRulePreviewText(rule), [rule]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setError(null);
		setIsConfirmed(false);
	}, [isOpen]);

	const handleDeleteRule = useCallback(async () => {
		if (!rule || !accessToken || !isAdmin) {
			setError('du bist nicht als admin eingeloggt.');
			return;
		}

		if (!isConfirmed) {
			setError('bitte löschvorgang vorher bestätigen.');
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
	}, [accessToken, isAdmin, isConfirmed, onOpenChange, refreshRules, rule]);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='border-neutral-700 bg-neutral-900 text-neutral-100 sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2 text-base uppercase tracking-[0.08em]'>
						<AlertTriangleIcon className='h-4 w-4 text-neutral-300' />
						regel löschen
					</DialogTitle>
					<DialogDescription className='text-sm text-neutral-400'>
						die regel wird deaktiviert und live aus der liste
						entfernt
					</DialogDescription>
				</DialogHeader>

				{rule && (
					<div className='space-y-2 border border-neutral-800 bg-neutral-950 p-3'>
						<p className='text-xs uppercase tracking-[0.08em] text-neutral-500'>
							vorschau
						</p>
						<p className='text-sm leading-relaxed text-neutral-300'>
							{rulePreviewText}
						</p>
					</div>
				)}

				<div className='flex items-center justify-between border border-neutral-800 bg-neutral-950 p-2.5'>
					<div className='space-y-0.5'>
						<p className='text-sm uppercase tracking-[0.08em] text-neutral-300'>
							löschung bestätigen
						</p>
						<p className='text-xs text-neutral-500'>
							ich will diese regel wirklich entfernen
						</p>
					</div>
					<Switch
						checked={isConfirmed}
						onCheckedChange={setIsConfirmed}
						aria-label='löschung bestätigen'
					/>
				</div>

				<div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
					<DialogClose asChild>
						<button
							type='button'
							className={`${actionButtonClassName} border border-neutral-700 bg-neutral-900`}>
							abbrechen
						</button>
					</DialogClose>
					<button
						type='button'
						onClick={() => void handleDeleteRule()}
						disabled={isDeleting || !isConfirmed}
						className={`${actionButtonClassName} bg-neutral-200 text-neutral-950 hover:bg-neutral-300 disabled:bg-neutral-800 disabled:text-neutral-500`}>
						{isDeleting ? 'wird gelöscht ...' : 'regel löschen'}
					</button>
				</div>

				{error && <p className='text-sm text-neutral-400'>{error}</p>}
			</DialogContent>
		</Dialog>
	);
}
