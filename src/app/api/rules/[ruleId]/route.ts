import { deactivateRule, updateRule } from '@/lib/rules';

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { authorizeAdminRequest } from '../route-auth';

export const runtime = 'nodejs';

const ruleIdSchema = z.string().uuid();

interface RuleRouteContext {
	params:
		| Promise<{
				ruleId: string;
		  }>
		| {
				ruleId: string;
		  };
}

async function getValidatedRuleId(context: RuleRouteContext) {
	const params = await Promise.resolve(context.params);
	const parsedRuleId = ruleIdSchema.safeParse(params.ruleId);

	if (!parsedRuleId.success) {
		return null;
	}

	return parsedRuleId.data;
}

export async function PATCH(request: Request, context: RuleRouteContext) {
	const authorization = await authorizeAdminRequest(request);

	if (!authorization.isAuthorized) {
		return authorization.response;
	}

	const ruleId = await getValidatedRuleId(context);

	if (!ruleId) {
		return NextResponse.json(
			{ error: 'Invalid rule id.' },
			{ status: 400 }
		);
	}

	const payload = await request.json().catch(() => null);

	if (!payload) {
		return NextResponse.json(
			{ error: 'Invalid request payload.' },
			{ status: 400 }
		);
	}

	try {
		const rule = await updateRule(ruleId, payload);

		return NextResponse.json(
			{ rule },
			{
				headers: {
					'cache-control': 'no-store',
				},
			}
		);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Could not update rule.';

		if (message === 'Invalid rule payload.') {
			return NextResponse.json({ error: message }, { status: 400 });
		}

		if (message === 'Rule not found.') {
			return NextResponse.json({ error: message }, { status: 404 });
		}

		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function DELETE(request: Request, context: RuleRouteContext) {
	const authorization = await authorizeAdminRequest(request);

	if (!authorization.isAuthorized) {
		return authorization.response;
	}

	const ruleId = await getValidatedRuleId(context);

	if (!ruleId) {
		return NextResponse.json(
			{ error: 'Invalid rule id.' },
			{ status: 400 }
		);
	}

	try {
		await deactivateRule(ruleId);

		return NextResponse.json(
			{ success: true },
			{
				headers: {
					'cache-control': 'no-store',
				},
			}
		);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Could not delete rule.';

		if (message === 'Rule not found.') {
			return NextResponse.json({ error: message }, { status: 404 });
		}

		return NextResponse.json({ error: message }, { status: 500 });
	}
}
