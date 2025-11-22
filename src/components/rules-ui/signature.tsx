import { CheckCircle2, Users } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

interface SignatureSectionProps {
	signed: boolean;
	signatureName: string;
	allChecked: boolean;
	onSign: (name: string) => void;
}

const MIN_SIGNATURE_LENGTH = 3;

export const SignatureSection: React.FC<SignatureSectionProps> = ({
	signed,
	signatureName,
	allChecked,
	onSign,
}) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [name, setName] = useState('');
	const [signatureError, setSignatureError] = useState<string | null>(null);

	const handleDialogChange = (open: boolean) => {
		setIsDialogOpen(open);
		if (!open) {
			setName('');
			setSignatureError(null);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = name.trim();

		if (!allChecked) {
			setSignatureError(
				'schön versuchen, aber ohne alle haken kein offizielles gekritzel.'
			);
			return;
		}

		if (trimmed.length < MIN_SIGNATURE_LENGTH) {
			setSignatureError('mindestens drei buchstaben, sonst lacht das archiv.');
			return;
		}

		if (/^\d+$/.test(trimmed)) {
			setSignatureError('zahlen gelten nicht als name. wir haben das geprüft.');
			return;
		}

		setSignatureError(null);
		onSign(trimmed);
		setIsDialogOpen(false);
		setName('');
	};

	if (signed) {
		return (
			<footer className='text-center'>
				<div className='space-y-4'>
					<div className='inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary'>
						<CheckCircle2 className='size-5' />
						<span className='font-medium'>regeln akzeptiert</span>
					</div>
					<div className='space-y-1'>
						<p className='text-sm text-muted-foreground'>
							ich bestätige hiermit, dass ich die psychiatrie
							regeln gelesen und verstanden habe.
						</p>
						<p className='text-xs italic text-muted-foreground'>
							— {signatureName}
						</p>
					</div>
				</div>
			</footer>
		);
	}

	return (
		<footer className='text-center'>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							disabled={!allChecked}
							onClick={() => {
								setSignatureError(null);
								setIsDialogOpen(true);
							}}
							className={`group relative px-8 py-4 font-semibold transition-all duration-200 ${
								allChecked
									? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-lg hover:shadow-xl'
									: 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
							}`}>
							<span className='flex items-center gap-2'>
								<Users className='size-4' />
								{allChecked
									? 'ich schwöre feierlich, dass ich mich benehme'
									: 'erst lesen, dann unterschreiben'}
							</span>
							{allChecked && (
								<div className='absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-200' />
							)}
						</button>
					</TooltipTrigger>
					{!allChecked && (
						<TooltipContent>
							<span>
								du musst alle regeln lesen und anklicken
							</span>
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>

			<p className='mt-3 text-sm text-muted-foreground'>
				ja, es ist nur localStorage – aber lass uns so tun, als säße die
				compliance-abteilung mit im raum.
			</p>

			<Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>unterschrift eingeben</DialogTitle>
						<DialogDescription>
							bitte gib einen namen ein, der du im zweifel deiner oma
							erklären würdest.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='signature-name'>name</Label>
							<Input
								id='signature-name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder='dein name...'
								autoFocus
							/>
							<p className='text-xs text-muted-foreground'>
								kleiner tipp: spitzname okay, solange du ihn mit ernstem
								gesicht sagen kannst.
							</p>
							{signatureError && (
								<p className='text-sm text-destructive'>{signatureError}</p>
							)}
						</div>
						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => handleDialogChange(false)}>
								abbrechen
							</Button>
							<Button type='submit' disabled={!name.trim()}>
								unterschreiben
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</footer>
	);
};
