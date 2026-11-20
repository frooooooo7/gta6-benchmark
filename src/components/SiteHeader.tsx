'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    {
      href: '/' as const,
      label: t('nav.calculator'),
      active: pathname === '/',
    },
    {
      href: '/specs' as const,
      label: t('nav.specs'),
      active: pathname.startsWith('/specs'),
    },
    {
      href: '/methodology' as const,
      label: t('nav.methodology'),
      active: pathname.startsWith('/methodology'),
    },
  ];

  const handleNavigate = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-white/10">
      <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-4 px-3 sm:px-5">
        <div className="flex items-center gap-6 min-w-0">
          <Link
            href="/"
            className="font-display text-xl font-extrabold tracking-tight text-white shrink-0"
            onClick={handleNavigate}
          >
            .ifro.pl
          </Link>

          <nav className="hidden md:flex items-center gap-5" aria-label="Main">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={link.active ? 'page' : undefined}
                className={`text-sm font-medium transition-colors ${
                  link.active ? 'text-white' : 'text-white/75 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" className="md:hidden border-t border-white/10 bg-black px-3 py-2" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.active ? 'page' : undefined}
              onClick={handleNavigate}
              className={`block rounded-md px-3 py-3 text-sm font-medium ${
                link.active ? 'text-white bg-white/10' : 'text-white/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
