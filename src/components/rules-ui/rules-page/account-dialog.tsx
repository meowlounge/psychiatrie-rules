'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import {
	LogInIcon,
	LogOutIcon,
	ShieldCheckIcon,
	ShieldXIcon,
	UserRoundIcon,
} from 'lucide-react';

interface AccountDialogProps {
	canCreateRules: boolean;
	isAuthBusy: boolean;
	accessToken: string | null;
	authenticatedEmail: string | null;
	authError: string | null;
	isStartingLogin: boolean;
	isSigningOut: boolean;
	oauthProviderLabel: string;
	actionButtonClassName: string;
	handleStartLogin: () => Promise<void>;
	handleSignOut: () => Promise<void>;
}

export function AccountDialog({
	canCreateRules,
	isAuthBusy,
	accessToken,
	authenticatedEmail,
	authError,
	isStartingLogin,
	isSigningOut,
	oauthProviderLabel,
	actionButtonClassName,
	handleStartLogin,
	handleSignOut,
}: AccountDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button
					type='button'
					className='flex h-9 w-9 items-center justify-center border border-stone-700 bg-stone-900 text-stone-300 transition-colors hover:bg-stone-800 hover:text-stone-100'
					aria-label='konto öffnen'>
					<UserRoundIcon className='h-4 w-4' />
				</button>
			</DialogTrigger>
			<DialogContent className='border-stone-700 bg-stone-900 text-stone-100 sm:max-w-sm'>
				<DialogHeader>
					<DialogTitle className='text-sm uppercase tracking-[0.08em]'>
						konto
					</DialogTitle>
					<DialogDescription className='text-xs text-stone-400'>
						supabase oauth login für admin-zugriff
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-3 text-xs text-stone-300'>
					{isAuthBusy && <p>anmeldung wird geprüft ...</p>}

					{!accessToken && !isAuthBusy && (
						<div className='space-y-3'>
							<p>nicht eingeloggt.</p>
							<button
								type='button'
								onClick={handleStartLogin}
								disabled={isStartingLogin}
								className={actionButtonClassName}>
								<LogInIcon className='h-3.5 w-3.5' />
								{isStartingLogin
									? 'oauth startet ...'
									: `mit ${oauthProviderLabel} anmelden`}
							</button>
						</div>
					)}

					{accessToken && !isAuthBusy && (
						<div className='space-y-3'>
							<p className='break-all text-stone-300'>
								{authenticatedEmail ?? 'ohne e-mail'}
							</p>
							<p className='flex items-center gap-2'>
								{canCreateRules ? (
									<ShieldCheckIcon className='h-3.5 w-3.5 text-stone-200' />
								) : (
									<ShieldXIcon className='h-3.5 w-3.5 text-stone-500' />
								)}
								{canCreateRules
									? 'admin freigeschaltet'
									: 'kein admin-zugriff'}
							</p>
							<button
								type='button'
								onClick={handleSignOut}
								disabled={isSigningOut}
								className={actionButtonClassName}>
								<LogOutIcon className='h-3.5 w-3.5' />
								{isSigningOut ? 'logout ...' : 'abmelden'}
							</button>
						</div>
					)}

					{authError && <p className='text-stone-400'>{authError}</p>}
				</div>
			</DialogContent>
		</Dialog>
	);
}
