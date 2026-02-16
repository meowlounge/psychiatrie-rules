export interface RuleRecord {
	id: string;
	content: string;
	note: string | null;
	is_new: boolean;
	is_limited_time: boolean;
	limited_start_at: string | null;
	limited_end_at: string | null;
	is_active: boolean;
	priority: number;
	created_by: string | null;
	created_at: string;
	updated_at: string;
}

export interface RuleViewModel {
	id: string;
	content: string;
	note?: string;
	isNew: boolean;
	isLimitedTime: boolean;
	limitedStartAt?: string;
	limitedEndAt?: string;
	priority: number;
}

export interface CreateRuleInput {
	content: string;
	note?: string;
	isNew: boolean;
	isLimitedTime: boolean;
	limitedStartAt?: string;
	limitedEndAt?: string;
	priority: number;
}
