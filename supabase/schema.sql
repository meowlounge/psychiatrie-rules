create extension if not exists pgcrypto;

create table if not exists public.rules (
	id uuid primary key default gen_random_uuid(),
	content text not null check (char_length(trim(content)) >= 3),
	note text,
	is_new boolean not null default false,
	is_limited_time boolean not null default false,
	limited_start_at timestamptz,
	limited_end_at timestamptz,
	is_active boolean not null default true,
	priority integer not null default 100,
	created_by text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint limited_window_valid check (
		is_limited_time = false
		or limited_start_at is not null
		or limited_end_at is not null
	)
);

create index if not exists rules_active_priority_idx
	on public.rules (is_active, priority, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

drop trigger if exists trigger_rules_set_updated_at on public.rules;

create trigger trigger_rules_set_updated_at
before update on public.rules
for each row
execute function public.set_updated_at();

alter table public.rules enable row level security;

drop policy if exists "Allow read active rules" on public.rules;

create policy "Allow read active rules"
on public.rules
for select
using (is_active = true);

drop policy if exists "Service role full access" on public.rules;

create policy "Service role full access"
on public.rules
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
