import type { CreateRuleInput, RuleViewModel } from '@/types/rules';

import type { ChangeEvent, FormEvent } from 'react';

export interface RulesPageClientProps {
	rules: RuleViewModel[];
	loadError?: string;
}

export interface RuleCreateFormState {
	content: string;
	note: string;
	isNew: boolean;
	isLimitedTime: boolean;
	limitedStartAt: string;
	limitedEndAt: string;
	priority: string;
}

export interface AdminStatusResponse {
	isAuthenticated?: boolean;
	isAdmin?: boolean;
	email?: string | null;
	error?: string;
}

export interface UseLiveRulesResult {
	liveRules: RuleViewModel[];
	syncError: string | null;
	lastSyncedAt: string | null;
	isSyncing: boolean;
	refreshRules: () => Promise<void>;
}

export interface UseAdminAuthResult {
	accessToken: string | null;
	authenticatedEmail: string | null;
	isAdmin: boolean;
	canCreateRules: boolean;
	isAuthBusy: boolean;
	authError: string | null;
	isLoggingIn: boolean;
	isSigningOut: boolean;
	handlePasswordLogin: (password: string) => Promise<void>;
	handleSignOut: () => Promise<void>;
}

export interface UseCreateRuleFormResult {
	formState: RuleCreateFormState;
	isSubmittingRule: boolean;
	createRuleError: string | null;
	createRuleSuccess: string | null;
	handleContentChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	handleNoteChange: (event: ChangeEvent<HTMLInputElement>) => void;
	handlePriorityChange: (event: ChangeEvent<HTMLInputElement>) => void;
	handleIsNewChange: (event: ChangeEvent<HTMLInputElement>) => void;
	handleIsLimitedTimeChange: (event: ChangeEvent<HTMLInputElement>) => void;
	handleLimitedStartAtChange: (event: ChangeEvent<HTMLInputElement>) => void;
	handleLimitedEndAtChange: (event: ChangeEvent<HTMLInputElement>) => void;
	handleCreateRule: (event: FormEvent<HTMLFormElement>) => Promise<void>;
	resetCreateRuleFeedback: () => void;
}

export function createInitialFormState(): RuleCreateFormState {
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

export function createFormStateFromRule(
	rule: RuleViewModel
): RuleCreateFormState {
	return {
		content: rule.content,
		note: rule.note ?? '',
		isNew: rule.isNew,
		isLimitedTime: rule.isLimitedTime,
		limitedStartAt: toDateTimeLocalValue(rule.limitedStartAt),
		limitedEndAt: toDateTimeLocalValue(rule.limitedEndAt),
		priority: String(rule.priority),
	};
}

export function toCreateRulePayload(
	formState: RuleCreateFormState
): CreateRuleInput {
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

function toDateTimeLocalValue(value: string | undefined) {
	if (!value) {
		return '';
	}

	const parsedDate = new Date(value);

	if (Number.isNaN(parsedDate.getTime())) {
		return '';
	}

	const timezoneOffset = parsedDate.getTimezoneOffset() * 60 * 1000;
	const localDate = new Date(parsedDate.getTime() - timezoneOffset);

	return localDate.toISOString().slice(0, 16);
}
