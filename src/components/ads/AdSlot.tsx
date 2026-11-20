'use client';

import { useTranslations } from 'next-intl';

export type AdFormat =
  | 'leaderboard' // 728x90
  | 'billboard' // 970x250
  | 'rectangle' // 300x250
  | 'half-page' // 300x600
  | 'skyscraper' // 160x600
  | 'mobile-banner' // 320x50
  | 'mobile-large' // 320x100
  | 'responsive'; // fluid width, reserved height

interface AdSlotProps {
  /** Local place name used for markup only. Not an AdSense unit id. */
  slotId: string;
  /** Real AdSense data-ad-slot unit id. Required to render outside preview. */
  adSlot?: string;
  format: AdFormat;
  className?: string;
  label?: string;
}

const FORMAT_DIMENSIONS: Record<AdFormat, { minH: string; maxW?: string; labelSize: string }> = {
  leaderboard: { minH: 'min-h-[90px]', maxW: 'max-w-[728px]', labelSize: '728x90 Leaderboard' },
  billboard: { minH: 'min-h-[250px]', maxW: 'max-w-[970px]', labelSize: '970x250 Billboard' },
  rectangle: { minH: 'min-h-[250px]', maxW: 'max-w-[300px]', labelSize: '300x250 Medium Rectangle' },
  'half-page': { minH: 'min-h-[600px]', maxW: 'max-w-[300px]', labelSize: '300x600 Half-Page Ad' },
  skyscraper: { minH: 'min-h-[600px]', maxW: 'max-w-[160px]', labelSize: '160x600 Skyscraper' },
  'mobile-banner': { minH: 'min-h-[50px]', maxW: 'max-w-[320px]', labelSize: '320x50 Mobile Banner' },
  'mobile-large': { minH: 'min-h-[100px]', maxW: 'max-w-[320px]', labelSize: '320x100 Large Mobile Banner' },
  responsive: { minH: 'min-h-[90px] sm:min-h-[250px]', labelSize: 'Responsive In-Content Ad' },
};

const isRealAdUnitId = (value?: string) => Boolean(value && /^\d{8,}$/.test(value.trim()));

export function AdSlot({
  slotId,
  adSlot,
  format,
  className = '',
  label,
}: AdSlotProps) {
  const t = useTranslations('ads');
  const isPreview = process.env.NEXT_PUBLIC_AD_PREVIEW === 'true';
  const unitId = adSlot?.trim() || (isRealAdUnitId(slotId) ? slotId.trim() : '');
  const hasRealAdUnit = isRealAdUnitId(unitId);

  if (!isPreview && !hasRealAdUnit) {
    return null;
  }

  const config = FORMAT_DIMENSIONS[format];

  return (
    <div
      className={`ad-slot-wrapper w-full flex flex-col items-center justify-center my-6 p-6 ${config.minH} ${className}`}
      data-ad-slot={unitId || slotId}
      data-ad-format={format}
    >
      <span className="ad-label" aria-hidden="true">
        {label || t('advertisement')}
      </span>

      <div
        className={`w-full ${config.maxW || 'w-full'} flex items-center justify-center border border-dashed border-border-subtle/80 bg-surface/80 rounded-md py-4 px-2 text-center text-xs font-mono text-content-muted`}
      >
        {isPreview && !hasRealAdUnit ? (
          <span className="text-[11px] text-content-muted">{label || t('advertisement')}</span>
        ) : (
          <div id={`ad-container-${slotId}`} className="w-full h-full" data-ad-unit={unitId || undefined} />
        )}
      </div>
    </div>
  );
}
