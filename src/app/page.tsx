'use client';

import { ProgressIndicator } from '@/components/rules-ui/progress-indicator';
import { RuleCard } from '@/components/rules-ui/rule-card';
import { SignatureSection } from '@/components/rules-ui/signature';
import { rules } from '@/rules';
import { Shield } from 'lucide-react';
import { useRef, useState } from 'react';

const STORAGE_KEY = 'psychiatrie_state';

interface StoredState {
  signed: boolean;
  name: string;
  checkedRules: number[];
}

interface LocalState {
  signed: boolean;
  name: string;
  checkedRules: Set<number>;
}

export default function HomePage() {
  const hydrated = useRef(false);

  // deterministic SSR initial state
  const [state, setState] = useState<LocalState>({
    signed: false,
    name: '',
    checkedRules: new Set(),
  });

  // manual hydration without useEffect
  if (!hydrated.current && typeof window !== 'undefined') {
    hydrated.current = true;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredState = JSON.parse(raw);
        setState({
          signed: parsed.signed ?? false,
          name: parsed.name ?? '',
          checkedRules: new Set(parsed.checkedRules ?? []),
        });
      }
    } catch {
      // ignore corrupted storage; keep defaults
    }
  }

  const { signed, name, checkedRules } = state;

  const persist = (partial: Partial<StoredState>) => {
    const next: StoredState = {
      signed,
      name,
      checkedRules: Array.from(checkedRules),
      ...partial,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const toggleRule = (index: number) => {
    if (signed) return;

    const next = new Set(checkedRules);
    next.has(index) ? next.delete(index) : next.add(index);

    setState({ signed, name, checkedRules: next });
    persist({ checkedRules: Array.from(next) });
  };

  const handleSign = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed || checkedRules.size !== rules.length) return;

    setState({ signed: true, name: trimmed, checkedRules });
    persist({ signed: true, name: trimmed });
  };

  const progressPercentage = (checkedRules.size / rules.length) * 100;

  if (!hydrated.current) {
    return (
      <main className='min-h-screen'>
        <div className='container mx-auto px-4 py-12 max-w-4xl'>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-muted rounded w-1/2 mx-auto'></div>
            <div className='h-4 bg-muted rounded w-1/3 mx-auto'></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen'>
      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        <header className='text-center mb-8'>
          <div className='inline-flex items-center gap-2 mb-4'>
            <Shield className='size-8 text-primary' />
            <h1 className='text-4xl font-bold text-foreground'>
              psychiatrie regeln
            </h1>
          </div>

          <p className='text-muted-foreground text-lg mb-6'>
            wichtige grundsätze und richtlinien
          </p>

          <ProgressIndicator
            signed={signed}
            checkedCount={checkedRules.size}
            totalCount={rules.length}
            progressPercentage={progressPercentage}
          />
        </header>

        <div className='space-y-3 mb-12'>
          {rules.map((rule, index) => (
            <RuleCard
              key={index}
              rule={rule}
              index={index}
              isChecked={checkedRules.has(index)}
              signed={signed}
              onToggle={() => toggleRule(index)}
            />
          ))}
        </div>

        <SignatureSection
          signed={signed}
          signatureName={name}
          allChecked={checkedRules.size === rules.length}
          onSign={handleSign}
        />
      </div>
    </main>
  );
}
