'use client';

import { useLocale, useTranslations } from 'next-intl';
import { type UpgradeRecommendation } from '@/lib/estimator';
import { getAffiliateLinks, getAffiliateDisclosure, type AffiliateLink } from '@/lib/affiliate';
import { type Locale } from '@/i18n/routing';
import { ShieldCheck } from 'lucide-react';

interface UpgradeAffiliateBoxProps {
  recommendation: UpgradeRecommendation;
}

const STORE_ICON: Record<AffiliateLink['store'], string> = {
  'x-kom': '/stores/x-kom.png',
  morele: '/stores/morele.png',
  'media-expert': '/stores/media-expert.png',
  amazon: '/stores/amazon.png',
};

function StoreMark({ store }: { store: AffiliateLink['store'] }) {
  return (
    <img
      src={STORE_ICON[store]}
      alt=""
      width={20}
      height={20}
      className="h-5 w-5 shrink-0 rounded-sm"
    />
  );
}

const STORE_BUTTON: Record<string, string> = {
  'x-kom': 'bg-[#0757b5] text-white hover:bg-[#064e96]',
  amazon: 'bg-[#f5c518] text-[#1a1203] hover:bg-[#e6b50e]',
  morele: 'bg-[#c81e3a] text-white hover:bg-[#a81830]',
  'media-expert': 'bg-[#1c2430] text-[#ffe08a] hover:bg-[#111820] border border-white/10',
};

export function UpgradeAffiliateBox({ recommendation }: UpgradeAffiliateBoxProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  if (recommendation.type === 'none' || !recommendation.targetComponentName) {
    return (
      <section className="hud-panel flex items-start gap-3 p-4 sm:p-5" aria-label={t('recommendations.title')}>
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8dffb4]" />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            {t('recommendations.title')}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-white/80">
            {t('recommendations.noUpgrade')}
          </p>
        </div>
      </section>
    );
  }

  const affiliateLinks = getAffiliateLinks({
    locale,
    componentName: recommendation.targetComponentName,
    query: recommendation.targetComponentName,
  });
  const legalDisclosure = getAffiliateDisclosure(locale);
  const reason =
    recommendation.reasonKey === 'gpuUpgradeBadge' || recommendation.reasonKey === 'cpuUpgradeBadge'
      ? t(`recommendations.${recommendation.reasonKey}`)
      : t('recommendations.title');

  return (
    <section className="hud-panel flex flex-col gap-4 p-4 sm:p-5" aria-label={t('recommendations.title')}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">
            {reason}
          </h2>
          <p className="mt-1 text-base font-semibold text-white">
            {recommendation.targetComponentName}
          </p>
          {recommendation.estimatedFpsGainPercent > 0 && (
            <p className="mt-1 text-sm font-semibold tabular-nums text-[#8dffb4]">
              {t('recommendations.gainEstimate', { percent: recommendation.estimatedFpsGainPercent })}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {affiliateLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3.5 text-sm font-bold ${
                STORE_BUTTON[link.store] ?? 'bg-white text-[#041018]'
              }`}
            >
              <StoreMark store={link.store} />
              {t('recommendations.openStore', { store: link.name })}
            </a>
          ))}
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-white/65">
        {legalDisclosure}
      </p>
    </section>
  );
}
