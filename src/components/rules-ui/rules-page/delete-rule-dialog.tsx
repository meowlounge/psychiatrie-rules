'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<AlertTriangleIcon className='h-4 w-4 text-foreground' />
						regel löschen
					</DialogTitle>
					<DialogDescription>
						die regel wird deaktiviert und live aus der liste
						entfernt
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-5 px-4 py-4 sm:px-6 sm:py-6'>
					<p className='text-xs text-muted-foreground'>
						diese aktion kann nicht rückgängig gemacht werden.
					</p>

					{rule && (
						<div className='space-y-1'>
							<p className='text-xs uppercase tracking-[0.08em] text-muted-foreground'>
								zu löschende regel
							</p>
							<p className='text-sm leading-relaxed text-foreground'>
								{rulePreviewText}
							</p>
						</div>
					)}

					<div className='flex items-center justify-between gap-4'>
						<div className='space-y-0.5'>
							<p className='text-xs uppercase tracking-[0.08em] text-muted-foreground'>
								löschung bestätigen
							</p>
							<p className='text-sm text-foreground'>
								ich will diese regel entfernen
							</p>
						</div>
						<Switch
							checked={isConfirmed}
							onCheckedChange={setIsConfirmed}
							aria-label='löschung bestätigen'
							className='shrink-0'
						/>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button type='button' className={actionButtonClassName}>
							abbrechen
						</Button>
					</DialogClose>
					<Button
						type='button'
						onClick={() => void handleDeleteRule()}
						disabled={isDeleting || !isConfirmed}
						className={actionButtonClassName}>
						{isDeleting ? 'wird gelöscht ...' : 'regel löschen'}
					</Button>
				</DialogFooter>

				{error && (
					<p className='px-4 pb-4 text-sm text-muted-foreground sm:px-6 sm:pb-6'>
						fehler: {error}
					</p>
				)}
			</DialogContent>
		</Dialog>
	);
}
