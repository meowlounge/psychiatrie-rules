'use client';

import { Code } from '@/components/eagle/code';
import { DottedBackground } from '@/components/eagle/dotted';
import { ReactScan } from '@/components/eagle/react-scan';
import { ThemeToggle } from '@/components/eagle/theme-toggle';
import { Toaster } from '@/components/eagle/toaster';
import { RuleCard } from '@/components/rules-ui/rule-card';
import { AccountDialog } from '@/components/rules-ui/rules-page/account-dialog';
import { CreateRuleSection } from '@/components/rules-ui/rules-page/create-rule-section';
import { DeleteRuleDialog } from '@/components/rules-ui/rules-page/delete-rule-dialog';
import { EditRuleDialog } from '@/components/rules-ui/rules-page/edit-rule-dialog';
import {
	createInitialFormState,
	toCreateRulePayload,
	type RuleCreateFormState,
} from '@/components/rules-ui/rules-page/types';
import {
	getActionButtonClassName,
	getInputClassName,
} from '@/components/rules-ui/rules-page/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

import type { RuleViewModel } from '@/types/rules';

import {
	BellIcon,
	CheckIcon,
	InfoIcon,
	MenuIcon,
	SparklesIcon,
} from 'lucide-react';
import { ThemeProvider } from 'next-themes';
import {
	useCallback,
	useMemo,
	useState,
	type ChangeEvent,
	type FormEvent,
} from 'react';
import { toast } from 'sonner';

const INITIAL_RULES: RuleViewModel[] = [
	{
		id: '11111111-1111-1111-1111-111111111111',
		content: 'immer respektvoller umgangston gegenüber patient:innen',
		note: 'basisregel',
		isNew: true,
		isLimitedTime: false,
		priority: 10,
	},
	{
		id: '22222222-2222-2222-2222-222222222222',
		content: 'ruhezeiten von 22:00 bis 06:00 einhalten',
		isNew: false,
		isLimitedTime: true,
		limitedStartAt: '2026-02-19T20:00:00.000Z',
		limitedEndAt: '2026-12-31T22:59:59.000Z',
		priority: 20,
	},
];

function createDemoRuleFromFormState(formState: RuleCreateFormState) {
	const payload = toCreateRulePayload(formState);

	return {
		id: crypto.randomUUID(),
		content: payload.content,
		note: payload.note,
		isNew: payload.isNew,
		isLimitedTime: payload.isLimitedTime,
		limitedStartAt: payload.limitedStartAt,
		limitedEndAt: payload.limitedEndAt,
		priority: payload.priority,
	} satisfies RuleViewModel;
}

export function DemoPageClient() {
	const inputClassName = useMemo(() => getInputClassName(), []);
	const actionButtonClassName = useMemo(() => getActionButtonClassName(), []);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dropdownChecked, setDropdownChecked] = useState(true);
	const [progressValue, setProgressValue] = useState(56);
	const [switchValue, setSwitchValue] = useState(false);
	const [rules, setRules] = useState(INITIAL_RULES);
	const [ruleToEdit, setRuleToEdit] = useState<RuleViewModel | null>(null);
	const [ruleToDelete, setRuleToDelete] = useState<RuleViewModel | null>(
		null
	);
	const [formState, setFormState] = useState(createInitialFormState);
	const [isSubmittingRule, setIsSubmittingRule] = useState(false);
	const [createRuleError, setCreateRuleError] = useState<string | null>(null);
	const [createRuleSuccess, setCreateRuleSuccess] = useState<string | null>(
		null
	);
	const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);
	const [isDemoSigningOut, setIsDemoSigningOut] = useState(false);
	const [isDemoLoggedIn, setIsDemoLoggedIn] = useState(false);
	const [demoAuthError, setDemoAuthError] = useState<string | null>(null);

	const handleContentChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setFormState((previousState) => ({
				...previousState,
				content: event.target.value,
			}));
		},
		[]
	);

	const handleNoteChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFormState((previousState) => ({
				...previousState,
				note: event.target.value,
			}));
		},
		[]
	);

	const handlePriorityChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFormState((previousState) => ({
				...previousState,
				priority: event.target.value,
			}));
		},
		[]
	);

	const handleIsNewChange = useCallback((isChecked: boolean) => {
		setFormState((previousState) => ({
			...previousState,
			isNew: isChecked,
		}));
	}, []);

	const handleIsLimitedTimeChange = useCallback((isChecked: boolean) => {
		setFormState((previousState) => ({
			...previousState,
			isLimitedTime: isChecked,
			limitedStartAt: isChecked ? previousState.limitedStartAt : '',
			limitedEndAt: isChecked ? previousState.limitedEndAt : '',
		}));
	}, []);

	const handleLimitedStartAtChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFormState((previousState) => ({
				...previousState,
				limitedStartAt: event.target.value,
			}));
		},
		[]
	);

	const handleLimitedEndAtChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFormState((previousState) => ({
				...previousState,
				limitedEndAt: event.target.value,
			}));
		},
		[]
	);

	const handleCreateRule = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setCreateRuleError(null);
			setCreateRuleSuccess(null);
			setIsSubmittingRule(true);

			if (formState.content.trim().length < 3) {
				setCreateRuleError(
					'demo: regeltext muss mindestens 3 zeichen haben.'
				);
				setIsSubmittingRule(false);
				return;
			}

			await new Promise((resolve) => {
				window.setTimeout(resolve, 320);
			});

			const newRule = createDemoRuleFromFormState(formState);
			setRules((previousRules) => {
				return [newRule, ...previousRules];
			});
			setFormState(createInitialFormState());
			setIsSubmittingRule(false);
			setCreateRuleSuccess('demo: regel lokal erstellt.');
		},
		[formState]
	);

	const resetCreateRuleFeedback = useCallback(() => {
		setCreateRuleError(null);
		setCreateRuleSuccess(null);
	}, []);

	const handlePasswordLogin = useCallback(async (password: string) => {
		setDemoAuthError(null);
		setIsDemoLoggingIn(true);

		await new Promise((resolve) => {
			window.setTimeout(resolve, 280);
		});

		if (password.trim().length === 0) {
			setDemoAuthError('demo: bitte passwort eingeben.');
			setIsDemoLoggingIn(false);
			return;
		}

		setIsDemoLoggedIn(true);
		setIsDemoLoggingIn(false);
	}, []);

	const handleSignOut = useCallback(async () => {
		setDemoAuthError(null);
		setIsDemoSigningOut(true);
		await new Promise((resolve) => {
			window.setTimeout(resolve, 200);
		});
		setIsDemoLoggedIn(false);
		setIsDemoSigningOut(false);
	}, []);

	return (
		<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
			<ReactScan />
			<Toaster />
			<TooltipProvider>
				<main className='space-y-8'>
					<header className='space-y-2'>
						<h1 className='text-lg sm:text-xl'>component demo</h1>
						<p className='text-xs text-muted-foreground sm:text-sm'>
							alle komponenten zum schnellen visuellen testen
						</p>
					</header>

					<section className='grid gap-4 sm:grid-cols-2'>
						<Card>
							<CardHeader>
								<CardTitle>buttons & badges</CardTitle>
								<CardDescription>
									basisvarianten und icon-layout
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-3'>
								<div className='flex flex-wrap items-center gap-2'>
									<Button>default</Button>
									<Button variant='secondary'>
										secondary
									</Button>
									<Button variant='outline'>outline</Button>
									<Button variant='ghost'>ghost</Button>
								</div>
								<div className='flex flex-wrap items-center gap-2'>
									<Badge>default</Badge>
									<Badge variant='secondary'>secondary</Badge>
									<Badge variant='outline'>outline</Badge>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>form controls</CardTitle>
								<CardDescription>
									input, label, switch und progress
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-1.5'>
									<Label htmlFor='demo-input'>
										beispiel input
									</Label>
									<Input
										id='demo-input'
										placeholder='tippe etwas ...'
									/>
								</div>
								<div className='flex items-center justify-between border border-stone-800 bg-stone-950 p-2.5'>
									<div className='space-y-0.5'>
										<p className='text-xs uppercase tracking-[0.08em] text-stone-300'>
											switch
										</p>
										<p className='text-[11px] text-stone-500'>
											zustand:{' '}
											{switchValue ? 'an' : 'aus'}
										</p>
									</div>
									<Switch
										checked={switchValue}
										onCheckedChange={setSwitchValue}
									/>
								</div>
								<div className='space-y-2'>
									<Progress value={progressValue} />
									<Button
										variant='outline'
										onClick={() => {
											setProgressValue((previous) => {
												return previous >= 100
													? 8
													: previous + 12;
											});
										}}>
										fortschritt +12
									</Button>
								</div>
							</CardContent>
						</Card>
					</section>

					<section className='grid gap-4 sm:grid-cols-2'>
						<Card>
							<CardHeader>
								<CardTitle>overlay components</CardTitle>
								<CardDescription>
									dialog, dropdown, hover card, tooltip
								</CardDescription>
							</CardHeader>
							<CardContent className='flex flex-wrap gap-2'>
								<Dialog
									open={dialogOpen}
									onOpenChange={setDialogOpen}>
									<DialogTrigger asChild>
										<Button variant='outline'>
											dialog öffnen
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>
												demo dialog
											</DialogTitle>
											<DialogDescription>
												dies ist ein einfacher
												test-dialog.
											</DialogDescription>
										</DialogHeader>
										<Button
											onClick={() =>
												setDialogOpen(false)
											}>
											schließen
										</Button>
									</DialogContent>
								</Dialog>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='outline'>
											<MenuIcon className='h-4 w-4' />
											menu
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='start'>
										<DropdownMenuLabel>
											aktionen
										</DropdownMenuLabel>
										<DropdownMenuItem>
											<InfoIcon className='h-4 w-4' />
											info
										</DropdownMenuItem>
										<DropdownMenuCheckboxItem
											checked={dropdownChecked}
											onCheckedChange={(value) => {
												setDropdownChecked(
													Boolean(value)
												);
											}}>
											demo checkbox
										</DropdownMenuCheckboxItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											<CheckIcon className='h-4 w-4' />
											bestätigen
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>

								<HoverCard>
									<HoverCardTrigger asChild>
										<Button variant='outline'>
											hover card
										</Button>
									</HoverCardTrigger>
									<HoverCardContent>
										<p className='text-sm'>
											kurze hover-information zur
											komponente.
										</p>
									</HoverCardContent>
								</HoverCard>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant='outline'>
											tooltip
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										test-tooltip
									</TooltipContent>
								</Tooltip>
							</CardContent>
						</Card>

						<Card className='relative overflow-hidden'>
							<DottedBackground dotSize={1} spacing={20} />
							<CardHeader>
								<CardTitle>avatar, theme, toaster</CardTitle>
								<CardDescription>
									projektkomponenten aus `eagle`
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-3'>
								<div className='flex items-center gap-3'>
									<Avatar className='size-10'>
										<AvatarImage
											src='https://avatars.githubusercontent.com/u/2?v=4'
											alt='demo avatar'
										/>
										<AvatarFallback>DE</AvatarFallback>
									</Avatar>
									<Code>const status = 'ready';</Code>
								</div>
								<div className='flex items-center gap-2'>
									<ThemeToggle />
									<Button
										variant='outline'
										onClick={() => {
											toast('demo toast ausgelöst', {
												description:
													'komponente: sonner toaster',
												icon: (
													<BellIcon className='h-4 w-4' />
												),
											});
										}}>
										toast testen
									</Button>
								</div>
							</CardContent>
							<CardFooter>
								<p className='text-xs text-muted-foreground'>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className='inline-flex items-center gap-1'>
												<SparklesIcon className='h-3.5 w-3.5' />
												quick sandbox
											</span>
										</TooltipTrigger>
										<TooltipContent>
											theme toggle braucht ThemeProvider
										</TooltipContent>
									</Tooltip>
								</p>
							</CardFooter>
						</Card>
					</section>

					<section className='space-y-4'>
						<div className='space-y-1'>
							<h2 className='text-sm uppercase tracking-[0.08em] text-stone-300'>
								rules components
							</h2>
							<p className='text-xs text-muted-foreground'>
								create/edit/delete dialogs sind hier ohne
								backend-token zum UI-test eingebunden.
							</p>
						</div>

						<div className='flex items-center justify-between gap-3'>
							<CreateRuleSection
								canCreateRules
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
								canCreateRules={isDemoLoggedIn}
								isAuthBusy={false}
								accessToken={
									isDemoLoggedIn ? 'demo-token' : null
								}
								authenticatedEmail={
									isDemoLoggedIn
										? 'demo-admin@auth.local'
										: null
								}
								authError={demoAuthError}
								isLoggingIn={isDemoLoggingIn}
								isSigningOut={isDemoSigningOut}
								inputClassName={inputClassName}
								actionButtonClassName={actionButtonClassName}
								handlePasswordLogin={handlePasswordLogin}
								handleSignOut={handleSignOut}
							/>
						</div>

						<div className='space-y-5 border-t border-stone-800 pt-5'>
							{rules.map((rule, index) => (
								<RuleCard
									key={rule.id}
									rule={rule}
									index={index}
									canManageRule
									handleEditRule={setRuleToEdit}
									handleDeleteRule={setRuleToDelete}
								/>
							))}
						</div>

						<EditRuleDialog
							rule={ruleToEdit}
							isOpen={Boolean(ruleToEdit)}
							onOpenChange={(isOpen) => {
								if (!isOpen) {
									setRuleToEdit(null);
								}
							}}
							accessToken={null}
							isAdmin={false}
							inputClassName={inputClassName}
							actionButtonClassName={actionButtonClassName}
							refreshRules={async () => {}}
						/>

						<DeleteRuleDialog
							rule={ruleToDelete}
							isOpen={Boolean(ruleToDelete)}
							onOpenChange={(isOpen) => {
								if (!isOpen) {
									setRuleToDelete(null);
								}
							}}
							accessToken={null}
							isAdmin={false}
							actionButtonClassName={actionButtonClassName}
							refreshRules={async () => {}}
						/>
					</section>
				</main>
			</TooltipProvider>
		</ThemeProvider>
	);
}
