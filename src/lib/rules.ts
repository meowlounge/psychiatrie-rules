import { getSupabaseServerClient } from '@/lib/supabase';

import type { CreateRuleInput, RuleRecord, RuleViewModel } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

const ruleRecordSchema = z.object({
	id: z.string(),
	content: z.string(),
	note: z.string().nullable(),
	is_new: z.boolean(),
	is_limited_time: z.boolean(),
	limited_start_at: z.string().nullable(),
	limited_end_at: z.string().nullable(),
	is_active: z.boolean(),
	priority: z.number(),
	created_by: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
});

const ruleRecordsSchema = z.array(ruleRecordSchema);
const createRuleInputSchema = z
	.object({
		content: z.string().trim().min(3).max(2000),
		note: z.string().trim().max(500).optional(),
		isNew: z.boolean().default(false),
		isLimitedTime: z.boolean().default(false),
		limitedStartAt: z.string().datetime({ offset: true }).optional(),
		limitedEndAt: z.string().datetime({ offset: true }).optional(),
		priority: z.number().int().min(0).max(10000).default(100),
	})
	.refine(
		(input) =>
			!input.isLimitedTime ||
			Boolean(input.limitedStartAt || input.limitedEndAt),
		{
			message: 'Limited rules require a start or end timestamp.',
			path: ['limitedStartAt'],
		}
	)
	.refine(
		(input) => {
			if (!input.limitedStartAt || !input.limitedEndAt) {
				return true;
			}

			return (
				new Date(input.limitedStartAt) <= new Date(input.limitedEndAt)
			);
		},
		{
			message: 'limitedStartAt must be earlier than limitedEndAt.',
			path: ['limitedStartAt'],
		}
	);

function isRuleWithinLimitedWindow(rule: RuleRecord, now: Date) {
	if (!rule.is_limited_time) {
		return true;
	}

	const hasStart = Boolean(rule.limited_start_at);
	const hasEnd = Boolean(rule.limited_end_at);

	if (!hasStart && !hasEnd) {
		return false;
	}

	if (hasStart) {
		const startsAt = new Date(rule.limited_start_at as string);

		if (startsAt > now) {
			return false;
		}
	}

	if (hasEnd) {
		const endsAt = new Date(rule.limited_end_at as string);

		if (endsAt < now) {
			return false;
		}
	}

	return true;
}

function mapRuleRecordToViewModel(rule: RuleRecord): RuleViewModel {
	return {
		id: rule.id,
		content: rule.content,
		note: rule.note ?? undefined,
		isNew: rule.is_new,
		isLimitedTime: rule.is_limited_time,
		limitedStartAt: rule.limited_start_at ?? undefined,
		limitedEndAt: rule.limited_end_at ?? undefined,
		priority: rule.priority,
	};
}

function parseCreateRuleInput(input: unknown): CreateRuleInput {
	const parsedInput = createRuleInputSchema.safeParse(input);

	if (!parsedInput.success) {
		throw new Error('Invalid rule payload.');
	}

	return parsedInput.data;
}

export async function fetchActiveRulesFromSupabaseClient(
	supabase: SupabaseClient
) {
	const { data, error } = await supabase
		.from('rules')
		.select('*')
		.eq('is_active', true)
		.order('priority', { ascending: true })
		.order('created_at', { ascending: true });

	if (error) {
		throw new Error(`Failed to load rules: ${error.message}`);
	}

	const now = new Date();
	const parsedRules = ruleRecordsSchema.safeParse(data ?? []);

	if (!parsedRules.success) {
		throw new Error('Supabase returned an invalid rules payload.');
	}

	return parsedRules.data
		.filter((rule) => isRuleWithinLimitedWindow(rule, now))
		.map(mapRuleRecordToViewModel);
}

export async function fetchActiveRules() {
	const supabase = getSupabaseServerClient();

	return fetchActiveRulesFromSupabaseClient(supabase);
}

export async function createRuleFromSupabaseClient(
	supabase: SupabaseClient,
	input: unknown,
	createdBy?: string
) {
	const parsedInput = parseCreateRuleInput(input);
	const note = parsedInput.note?.trim();
	const shouldUseLimitedWindow = parsedInput.isLimitedTime;
	const limitedStartAt = shouldUseLimitedWindow
		? (parsedInput.limitedStartAt ?? null)
		: null;
	const limitedEndAt = shouldUseLimitedWindow
		? (parsedInput.limitedEndAt ?? null)
		: null;

	const { data, error } = await supabase
		.from('rules')
		.insert({
			content: parsedInput.content,
			note: note && note.length > 0 ? note : null,
			is_new: parsedInput.isNew,
			is_limited_time: shouldUseLimitedWindow,
			limited_start_at: limitedStartAt,
			limited_end_at: limitedEndAt,
			is_active: true,
			priority: parsedInput.priority,
			created_by: createdBy ?? null,
		})
		.select('*')
		.single();

	if (error) {
		throw new Error(`Failed to create rule: ${error.message}`);
	}

	const parsedRule = ruleRecordSchema.safeParse(data);

	if (!parsedRule.success) {
		throw new Error('Supabase returned an invalid rule payload.');
	}

	return mapRuleRecordToViewModel(parsedRule.data);
}

export async function createRule(input: unknown, createdBy?: string) {
	const supabase = getSupabaseServerClient();

	return createRuleFromSupabaseClient(supabase, input, createdBy);
}

export async function updateRuleFromSupabaseClient(
	supabase: SupabaseClient,
	ruleId: string,
	input: unknown
) {
	const parsedInput = parseCreateRuleInput(input);
	const note = parsedInput.note?.trim();
	const shouldUseLimitedWindow = parsedInput.isLimitedTime;
	const limitedStartAt = shouldUseLimitedWindow
		? (parsedInput.limitedStartAt ?? null)
		: null;
	const limitedEndAt = shouldUseLimitedWindow
		? (parsedInput.limitedEndAt ?? null)
		: null;

	const { data, error } = await supabase
		.from('rules')
		.update({
			content: parsedInput.content,
			note: note && note.length > 0 ? note : null,
			is_new: parsedInput.isNew,
			is_limited_time: shouldUseLimitedWindow,
			limited_start_at: limitedStartAt,
			limited_end_at: limitedEndAt,
			priority: parsedInput.priority,
		})
		.eq('id', ruleId)
		.eq('is_active', true)
		.select('*')
		.single();

	if (error) {
		if (error.code === 'PGRST116') {
			throw new Error('Rule not found.');
		}

		throw new Error(`Failed to update rule: ${error.message}`);
	}

	const parsedRule = ruleRecordSchema.safeParse(data);

	if (!parsedRule.success) {
		throw new Error('Supabase returned an invalid rule payload.');
	}

	return mapRuleRecordToViewModel(parsedRule.data);
}

export async function updateRule(ruleId: string, input: unknown) {
	const supabase = getSupabaseServerClient();

	return updateRuleFromSupabaseClient(supabase, ruleId, input);
}

export async function deactivateRuleFromSupabaseClient(
	supabase: SupabaseClient,
	ruleId: string
) {
	const { error } = await supabase
		.from('rules')
		.update({
			is_active: false,
		})
		.eq('id', ruleId)
		.eq('is_active', true)
		.select('id')
		.single();

	if (error) {
		if (error.code === 'PGRST116') {
			throw new Error('Rule not found.');
		}

		throw new Error(`Failed to delete rule: ${error.message}`);
	}
}

export async function deactivateRule(ruleId: string) {
	const supabase = getSupabaseServerClient();

	return deactivateRuleFromSupabaseClient(supabase, ruleId);
}

export async function pingSupabaseRulesTable() {
	const supabase = getSupabaseServerClient();
	const { error } = await supabase.from('rules').select('id').limit(1);

	if (error) {
		throw new Error(`Supabase keepalive failed: ${error.message}`);
	}
}
