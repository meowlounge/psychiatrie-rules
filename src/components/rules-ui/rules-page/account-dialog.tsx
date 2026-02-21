'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
	const isLoginDisabled = isLoggingIn || password.trim().length === 0;

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
				<Button
					type='button'
					className='flex h-10 w-10 items-center justify-center'
					aria-label='konto öffnen'>
					<UserRoundIcon className='h-4 w-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>konto</DialogTitle>
					<DialogDescription>
						passwort-login für admin-zugriff
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-5 px-4 py-4 text-sm text-foreground sm:px-6 sm:py-6'>
					{isAuthBusy && (
						<p
							role='status'
							aria-live='polite'
							className='border border-border px-3 py-2 text-foreground'>
							anmeldung wird geprüft ...
						</p>
					)}

					{!accessToken && !isAuthBusy && (
						<form
							onSubmit={handleSubmitLogin}
							className='space-y-4'>
							<div className='space-y-1'>
								<p className='text-sm text-foreground'>
									nicht eingeloggt
								</p>
								<p className='text-xs text-muted-foreground'>
									melde dich mit dem admin-passwort an
								</p>
							</div>
							<Label htmlFor='admin-password'>passwort</Label>
							<Input
								id='admin-password'
								type='password'
								value={password}
								onChange={(event) =>
									setPassword(event.target.value)
								}
								placeholder='passwort'
								autoComplete='current-password'
								autoFocus
								className={inputClassName}
							/>
							<Button
								type='submit'
								disabled={isLoginDisabled}
								className={actionButtonClassName}>
								<LogInIcon className='h-4 w-4' />
								{isLoggingIn ? 'login ...' : 'anmelden'}
							</Button>
						</form>
					)}

					{accessToken && !isAuthBusy && (
						<div className='space-y-3'>
							<div className='space-y-2 border border-border p-3'>
								<p className='text-xs uppercase tracking-[0.08em] text-muted-foreground'>
									angemeldet als
								</p>
								<p className='break-all text-sm text-foreground'>
									{authenticatedEmail ?? 'ohne e-mail'}
								</p>
								<p className='flex items-center gap-2 text-sm'>
									{canCreateRules ? (
										<ShieldCheckIcon className='h-4 w-4 text-foreground' />
									) : (
										<ShieldXIcon className='h-4 w-4 text-muted-foreground' />
									)}
									{canCreateRules
										? 'admin freigeschaltet'
										: 'kein admin-zugriff'}
								</p>
							</div>
							<Button
								type='button'
								onClick={handleSignOut}
								disabled={isSigningOut}
								className={actionButtonClassName}>
								<LogOutIcon className='h-4 w-4' />
								{isSigningOut ? 'logout ...' : 'abmelden'}
							</Button>
						</div>
					)}

					{authError && (
						<p className='border border-border px-3 py-2 text-sm text-muted-foreground'>
							{authError}
						</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
