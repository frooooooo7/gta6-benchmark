'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { GPUS, GPUS_MAP, type GpuTier } from '@/data/gpus';
import { CPUS, CPUS_MAP } from '@/data/cpus';
import { getTopHardwarePairs } from '@/data/popularPairs';

type CatalogTab = 'gpu' | 'cpu';

const FEATURED_PAIRS = getTopHardwarePairs().slice(0, 8);

const GPU_TIER_KEY: Record<GpuTier, 'tierBudget' | 'tierEntry' | 'tierMid' | 'tierHigh' | 'tierTop'> = {
  budget: 'tierBudget',
  entry: 'tierEntry',
  mid: 'tierMid',
  high: 'tierHigh',
  enthusiast: 'tierTop',
};

export function SpecsBrowser() {
  const t = useTranslations('specs');
  const [tab, setTab] = useState<CatalogTab>('gpu');
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const gpus = useMemo(
    () =>
      GPUS.filter((gpu) => {
        if (!normalizedQuery) return true;
        return `${gpu.name} ${gpu.brand} ${gpu.tier}`.toLowerCase().includes(normalizedQuery);
      }).sort((a, b) => b.rasterScore - a.rasterScore),
    [normalizedQuery]
  );

  const cpus = useMemo(
    () =>
      CPUS.filter((cpu) => {
        if (!normalizedQuery) return true;
        return `${cpu.name} ${cpu.brand} ${cpu.architecture}`.toLowerCase().includes(normalizedQuery);
      }).sort((a, b) => b.gamingScore - a.gamingScore),
    [normalizedQuery]
  );

  return (
    <div className="flex flex-col gap-4">
      <header className="hud-panel p-4 sm:p-5">
        <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
          {t('title')}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
          {t('subtitle')}
        </p>

        <label className="mt-4 block">
          <span className="sr-only">{t('searchPlaceholder')}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchPlaceholder')}
            className="min-h-11 w-full rounded-md border border-white/15 bg-black/50 px-3 text-sm text-white placeholder:text-white/55"
          />
        </label>

        <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label={t('title')}>
          <button
            type="button"
            aria-pressed={tab === 'gpu'}
            onClick={() => setTab('gpu')}
            className={`min-h-10 rounded-md text-sm font-bold ${
              tab === 'gpu' ? 'bg-[#3ec6ff] text-[#041018]' : 'border border-white/10 bg-white/5 text-white/80'
            }`}
          >
            {t('tabGpus')} · {gpus.length}
          </button>
          <button
            type="button"
            aria-pressed={tab === 'cpu'}
            onClick={() => setTab('cpu')}
            className={`min-h-10 rounded-md text-sm font-bold ${
              tab === 'cpu' ? 'bg-[#3ec6ff] text-[#041018]' : 'border border-white/10 bg-white/5 text-white/80'
            }`}
          >
            {t('tabCpus')} · {cpus.length}
          </button>
        </div>
      </header>

      <ul className="hud-panel divide-y divide-white/10">
        {tab === 'gpu'
          ? gpus.map((gpu) => (
              <li key={gpu.id}>
                <Link
                  href={`/?gpu=${gpu.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">{gpu.name}</span>
                    <span className="mt-0.5 block text-xs text-white/70">
                      {gpu.vramGB} GB {t('vramCol')} · {t(GPU_TIER_KEY[gpu.tier])} · {t('rtScoreCol')} {gpu.rtScore}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-bold tabular-nums text-[#8dffb4]">{gpu.rasterScore}</span>
                  </span>
                </Link>
              </li>
            ))
          : cpus.map((cpu) => (
              <li key={cpu.id}>
                <Link
                  href={`/?cpu=${cpu.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">{cpu.name}</span>
                    <span className="mt-0.5 block text-xs text-white/70">
                      {cpu.cores}C/{cpu.threads}T · {cpu.architecture}
                      {cpu.has3DVcache ? ' · 3D V-Cache' : ''}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-bold tabular-nums text-[#8dffb4]">{cpu.gamingScore}</span>
                  </span>
                </Link>
              </li>
            ))}
      </ul>

      {!normalizedQuery && (
        <section className="hud-panel p-4 sm:p-5" aria-label={t('pairsTitle')}>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">{t('pairsTitle')}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {FEATURED_PAIRS.map((pair) => {
              const gpu = GPUS_MAP[pair.gpuId];
              const cpu = CPUS_MAP[pair.cpuId];
              return (
                <li key={pair.slug}>
                  <Link
                    href={`/specs/${pair.slug}`}
                    className="block rounded-md border border-white/10 bg-black/40 px-3 py-2.5 hover:border-white/25"
                  >
                    <span className="block text-sm font-semibold text-white">{gpu.name}</span>
                    <span className="mt-0.5 block text-xs text-white/70">{cpu.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
