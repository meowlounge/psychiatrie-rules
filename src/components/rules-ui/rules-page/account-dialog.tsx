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
import { useCallback, useState, type FormEvent } from 'react';

interface AccountDialogProps {
	canCreateRules: boolean;
	isAuthBusy: boolean;
	accessToken: string | null;
	authenticatedEmail: string | null;
	authError: string | null;
	isLoggingIn: boolean;
	isSigningOut: boolean;
	inputClassName: string;
	actionButtonClassName: string;
	handlePasswordLogin: (password: string) => Promise<void>;
	handleSignOut: () => Promise<void>;
}

export function AccountDialog({
	canCreateRules,
	isAuthBusy,
	accessToken,
	authenticatedEmail,
	authError,
	isLoggingIn,
	isSigningOut,
	inputClassName,
	actionButtonClassName,
	handlePasswordLogin,
	handleSignOut,
}: AccountDialogProps) {
	const [password, setPassword] = useState('');

	const handleSubmitLogin = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			await handlePasswordLogin(password);
			setPassword('');
		},
		[handlePasswordLogin, password]
	);

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
						passwort-login für admin-zugriff
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-3 text-xs text-stone-300'>
					{isAuthBusy && <p>anmeldung wird geprüft ...</p>}

					{!accessToken && !isAuthBusy && (
						<form
							onSubmit={handleSubmitLogin}
							className='space-y-3'>
							<p>nicht eingeloggt.</p>
							<input
								type='password'
								value={password}
								onChange={(event) =>
									setPassword(event.target.value)
								}
								placeholder='passwort'
								autoComplete='current-password'
								className={inputClassName}
							/>
							<button
								type='submit'
								disabled={isLoggingIn}
								className={actionButtonClassName}>
								<LogInIcon className='h-3.5 w-3.5' />
								{isLoggingIn ? 'login ...' : 'anmelden'}
							</button>
						</form>
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
