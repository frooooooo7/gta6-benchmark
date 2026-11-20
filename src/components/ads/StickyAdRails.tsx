'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

interface StickyAdRailsProps {
  children: React.ReactNode;
}

function AdRail({ side }: { side: 'left' | 'right' }) {
  const t = useTranslations('ads');

  return (
    <aside
      aria-label={side === 'left' ? 'Sidebar advertisement left' : 'Sidebar advertisement right'}
      className="hidden xl:flex sticky top-20 h-[min(640px,calc(100vh-6rem))] flex-col overflow-hidden rounded-lg border border-white/10 bg-black/55"
      data-ad-slot={`rail-${side}`}
      data-ad-format="skyscraper"
    >
      <p className="border-b border-white/10 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
        {t('advertisement')}
      </p>
      <div id={`ad-container-rail-${side}`} className="flex-1" />
    </aside>
  );
}

export function StickyAdRails({ children }: StickyAdRailsProps) {
  return (
    <div className="relative w-full">
      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 items-start gap-4 px-3 py-4 sm:px-5 lg:py-6 xl:grid-cols-[148px_minmax(0,1fr)_148px]">
        <AdRail side="left" />
        <div className="min-w-0">{children}</div>
        <AdRail side="right" />
      </div>
      <MobileStickyBottomBanner />
    </div>
  );
}

export function MobileStickyBottomBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const t = useTranslations('ads');

  if (isDismissed) return null;

  return (
    <div
      role="complementary"
      aria-label="Mobile advertisement"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 px-4 py-2 lg:hidden"
    >
      <div className="relative mx-auto flex h-[50px] w-full max-w-[340px] items-center justify-center">
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Close advertisement"
          className="absolute -top-3 right-0 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-[#161b22] text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
          {t('advertisement')}
        </span>
        <div id="ad-container-mobile-anchor" className="sr-only" />
      </div>
    </div>
  );
}
