'use client';

import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/routing';

const languages = [
  { code: 'pl', label: 'Polski' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
] as const;

function FlagMark({ code }: { code: string }) {
  if (code === 'pl') {
    return (
      <svg viewBox="0 0 16 12" className="h-3 w-4 rounded-[2px]" aria-hidden="true">
        <rect width="16" height="6" fill="#ffffff" />
        <rect y="6" width="16" height="6" fill="#dc143c" />
      </svg>
    );
  }
  if (code === 'de') {
    return (
      <svg viewBox="0 0 16 12" className="h-3 w-4 rounded-[2px]" aria-hidden="true">
        <rect width="16" height="4" fill="#000000" />
        <rect y="4" width="16" height="4" fill="#dd0000" />
        <rect y="8" width="16" height="4" fill="#ffce00" />
      </svg>
    );
  }
  if (code === 'fr') {
    return (
      <svg viewBox="0 0 16 12" className="h-3 w-4 rounded-[2px]" aria-hidden="true">
        <rect width="5.4" height="12" fill="#0055a4" />
        <rect x="5.4" width="5.2" height="12" fill="#ffffff" />
        <rect x="10.6" width="5.4" height="12" fill="#ef4135" />
      </svg>
    );
  }
  if (code === 'es') {
    return (
      <svg viewBox="0 0 16 12" className="h-3 w-4 rounded-[2px]" aria-hidden="true">
        <rect width="16" height="12" fill="#c60b1e" />
        <rect y="3" width="16" height="6" fill="#ffc400" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 12" className="h-3 w-4 rounded-[2px]" aria-hidden="true">
      <rect width="16" height="12" fill="#012169" />
      <path d="M0 0 L16 12 M16 0 L0 12" stroke="#ffffff" strokeWidth="2.2" />
      <path d="M0 0 L16 12 M16 0 L0 12" stroke="#c8102e" strokeWidth="1" />
      <path d="M8 0 V12 M0 6 H16" stroke="#ffffff" strokeWidth="3.2" />
      <path d="M8 0 V12 M0 6 H16" stroke="#c8102e" strokeWidth="1.6" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const current = languages.find((lang) => lang.code === currentLocale) ?? languages[0];

  useEffect(() => {
    const handlePointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointer);
    return () => document.removeEventListener('mousedown', handlePointer);
  }, []);

  const handleSelect = (nextLocale: string) => {
    setOpen(false);
    if (nextLocale === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={isPending}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 items-center gap-2 rounded-md px-2 text-sm font-medium text-white/90 hover:bg-white/10 disabled:opacity-60"
      >
        <FlagMark code={current.code} />
        <span className="hidden sm:inline">
          {t('nav.language')}
        </span>
        <ChevronDown className={`h-4 w-4 text-white/70 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={t('nav.language')}
          className="absolute right-0 z-50 mt-1 min-w-[180px] rounded-md border border-white/10 bg-[#0c1018] py-1 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
        >
          {languages.map((lang) => {
            const isActive = currentLocale === lang.code;
            return (
              <li key={lang.code} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                    isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FlagMark code={lang.code} />
                  <span>{lang.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
