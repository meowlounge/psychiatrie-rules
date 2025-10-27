import type { ReactNode } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from './components/ui/hover-card';

export type Rule = {
	content: ReactNode;
	note?: ReactNode;
};

export const rules: Rule[] = [
	{
		content: (
			<>
				sprechfehler müssen sofort{' '}
				<HoverCard>
					<HoverCardTrigger className='underline decoration-dotted cursor-help text-primary hover:text-primary/80 transition-colors'>
						<span className='text-primary font-medium'>
							dokumentiert
						</span>
					</HoverCardTrigger>
					<HoverCardContent className='p-3 min-w-md'>
						<div className='space-y-2'>
							<p className='text-sm font-medium'>format:</p>
							<code className='block text-xs bg-muted p-2'>
								falsches wort = richtiges wort @name
							</code>
							<p className='text-xs text-muted-foreground'>
								<span className='font-medium'>beispiel:</span>
								<br />
								<code>polnien = polen @prodbyeagle</code>
							</p>
						</div>
					</HoverCardContent>
				</HoverCard>{' '}
				werden! wenn während des schreibens eines sprachfehlers ein
				weiterer sprachfehler passiert, z. b. beim aussprechen oder
				verschreiben, muss dieser ebenfalls{' '}
				<HoverCard>
					<HoverCardTrigger className='underline decoration-dotted cursor-help text-primary hover:text-primary/80 transition-colors'>
						<span className='text-primary font-medium'>
							dokumentiert
						</span>
					</HoverCardTrigger>
					<HoverCardContent className='p-3 min-w-md'>
						<div className='space-y-2'>
							<p className='text-sm font-medium'>format:</p>
							<code className='block text-xs bg-muted p-2'>
								falsches wort = falsches wort 2 = richtiges wort
								@name
							</code>
							<p className='text-xs text-muted-foreground'>
								<span className='font-medium'>beispiel:</span>
								<br />
								<code>
									bleybläid = bayblade = beyplate = beyblade
									@andi
								</code>
							</p>
						</div>
					</HoverCardContent>
				</HoverCard>{' '}
				werden ).
			</>
		),
		note: (
			<>
				bitte sorgfältig dokumentieren, um missverständnisse zu
				vermeiden.
			</>
		),
	},
	{
		content: (
			<>
				was in der <span className='text-primary'>psychiatrie</span>{' '}
				passiert, bleibt in der{' '}
				<span className='text-primary'>psychiatrie</span>.
			</>
		),
	},
	{
		content: (
			<>
				in der <span className='text-primary'>psychiatrie</span> darf
				man dinge tun, die sonst in der öffentlichkeit{' '}
				<span className='text-destructive font-medium'>
					nicht erlaubt
				</span>{' '}
				wären.
			</>
		),
	},
	{
		content: (
			<>
				wir schließen <span className='font-semibold'>niemanden</span>{' '}
				aus.
			</>
		),
		note: (
			<>
				zählt nicht für personen die nicht online sind. ( ich denke mal
				das ist klar )
			</>
		),
	},
	{
		content: (
			<>
				man darf{' '}
				<span className='text-primary font-medium'>beleidigen</span>,
				doch nicht auf die{' '}
				<span className='text-destructive'>eltern</span> oder andere{' '}
				<span className='text-destructive'>erwachsene</span> gehen.
			</>
		),
	},
	{
		content: (
			<>
				die <span className='text-primary'>psychiatrie</span> sollte,
				wenn möglich, immer einen laufenden{' '}
				<HoverCard>
					<HoverCardTrigger className='underline decoration-dotted cursor-help text-primary hover:text-primary/80 transition-colors'>
						<span className='text-primary font-medium'>
							recorder
						</span>
					</HoverCardTrigger>
					<HoverCardContent className='p-3'>
						<div className='flex items-center gap-3'>
							<Avatar className='rounded-none'>
								<AvatarImage
									src='https://cdn.discordapp.com/avatars/272937604339466240/2f5382bb33d016c8c25b7f18acf898cc.webp'
									alt='craig avatar'
								/>
								<AvatarFallback>cr</AvatarFallback>
							</Avatar>
							<div>
								<p className='font-semibold'>@craig</p>
								<p className='text-sm text-muted-foreground'>
									bot für aufnahme
								</p>
							</div>
						</div>
					</HoverCardContent>
				</HoverCard>{' '}
				haben.
			</>
		),
	},
	{
		content: (
			<>
				versprecher und bilder bitte{' '}
				<span className='text-primary'>trennen</span> (
				<code className='text-sm'>words</code> und{' '}
				<code className='text-sm'>gallery</code>)
			</>
		),
	},
	{
		content: (
			<>
				wenn aussagen geschehen, wird man sich{' '}
				<strong>nicht äußern</strong> - auch genannt{' '}
				<span className='italic text-primary'>disziplin</span> (nicht
				lachen, augen schließen oder sonst irgendeine reaktion).
			</>
		),
	},
];
