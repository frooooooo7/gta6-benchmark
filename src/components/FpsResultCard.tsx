'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Share2 } from 'lucide-react';
import {
  type EstimationResult,
  type PresetTier,
  type Resolution,
  type StorageType,
  type UpscalerMode,
  vramBudget,
} from '@/lib/estimator';

interface FpsResultCardProps {
  result: EstimationResult;
  targetResolution: Resolution;
  targetPreset?: PresetTier;
  onSelectPreset?: (preset: PresetTier) => void;
  vramGB: number;
  storageType: StorageType;
  rayTracing: boolean;
  upscaler: UpscalerMode;
}

const PRESET_COLOR: Record<PresetTier, { figure: string; solid: string; soft: string }> = {
  low: { figure: 'text-[#ffb086]', solid: 'bg-[#c2410c] text-white', soft: 'bg-black/45 text-[#ffb086] border border-white/10' },
  medium: { figure: 'text-[#ffe08a]', solid: 'bg-[#f5c518] text-[#1a1203]', soft: 'bg-black/45 text-[#ffe08a] border border-white/10' },
  high: { figure: 'text-[#8dffb4]', solid: 'bg-[#157a38] text-white', soft: 'bg-black/45 text-[#8dffb4] border border-white/10' },
  ultra: { figure: 'text-[#ffb3bc]', solid: 'bg-[#c81e3a] text-white', soft: 'bg-black/45 text-[#ffb3bc] border border-white/10' },
};

function resolutionLabel(resolution: Resolution) {
  if (resolution === '4k') return '4K';
  return resolution.toUpperCase();
}

function meterTone(status: 'ok' | 'tight' | 'critical') {
  if (status === 'critical') return 'bg-[#e11d48]';
  if (status === 'tight') return 'bg-[#f5c518]';
  return 'bg-[#3ddc6a]';
}

function tierKey(fps: number) {
  if (fps < 30) return 'results.tierUnplayable';
  if (fps < 60) return 'results.tierPlayable';
  if (fps < 90) return 'results.tierSmooth';
  if (fps < 120) return 'results.tierHighRefresh';
  return 'results.tierUltraEnthusiast';
}

export function FpsResultCard({
  result,
  targetResolution,
  targetPreset = 'high',
  onSelectPreset,
  vramGB,
  storageType,
  rayTracing,
  upscaler,
}: FpsResultCardProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const displayed = result.presets[targetPreset];
  const tone = PRESET_COLOR[targetPreset];
  const presetShortKey = {
    low: 'results.presetLowShort',
    medium: 'results.presetMediumShort',
    high: 'results.presetHighShort',
    ultra: 'results.presetUltraShort',
  } as const;

  const vram = vramBudget(vramGB, targetResolution);
  const upscaleShortKey = {
    quality: 'results.upscaleQualityShort',
    balanced: 'results.upscaleBalancedShort',
    performance: 'results.upscalePerformanceShort',
  } as const;

  const storageFactor: Record<StorageType, number> = {
    nvme_gen4: 1.03,
    nvme_gen3: 1,
    sata_ssd: 0.97,
    hdd: 0.85,
  };
  const storageStatus: 'ok' | 'tight' | 'critical' =
    storageType === 'hdd' ? 'critical' : storageType === 'sata_ssd' ? 'tight' : 'ok';

  const meterLabel = (status: 'ok' | 'tight' | 'critical') => {
    if (status === 'critical') return t('results.meterCritical');
    if (status === 'tight') return t('results.meterTight');
    return t('results.meterOk');
  };

  const vramWarning = result.warnings.find((warning) => warning.id === 'vram');
  const storageWarning = result.warnings.find((warning) => warning.id === 'storage');
  const otherWarnings = result.warnings.filter((warning) => warning.id === 'ram' || warning.id === 'cpu_cores');

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="flex flex-col gap-4">
      <div id="fps-readout" className="scroll-mt-24">
        <p className={`fps-figure font-display text-7xl font-black leading-none tabular-nums sm:text-8xl ${tone.figure}`}>
          {displayed.fps}
          <span className="ml-2 text-3xl font-extrabold sm:text-4xl">FPS</span>
        </p>
        <p className={`mt-1 text-sm font-bold uppercase tracking-[0.14em] sm:text-base ${tone.figure}`}>
          {t(presetShortKey[targetPreset])} {resolutionLabel(targetResolution)}
          {rayTracing ? ' · RT' : ''}
          {upscaler !== 'native' ? ` · ${t(upscaleShortKey[upscaler])}` : ''}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
          <span className="tabular-nums">
            {t('results.percentile1')}: <strong className="font-semibold text-white">{displayed.low1Percent}</strong>
          </span>
          <span>{t(tierKey(displayed.fps))}</span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-white/80 hover:bg-white/10 hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copied ? t('results.linkCopied') : t('results.shareBuild')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2" role="group" aria-label={t('results.presetBreakdownTitle')}>
        {(
          [
            { key: 'low', label: t('results.presetLowShort') },
            { key: 'medium', label: t('results.presetMediumShort') },
            { key: 'high', label: t('results.presetHighShort') },
            { key: 'ultra', label: t('results.presetUltraShort') },
          ] as const
        ).map((preset) => {
          const isSelected = targetPreset === preset.key;
          const presetTone = PRESET_COLOR[preset.key];
          return (
            <button
              key={preset.key}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectPreset?.(preset.key)}
              className={`min-h-[64px] rounded-md px-1 py-2 text-center transition-transform ${
                isSelected ? `${presetTone.solid} ring-2 ring-white/80` : presetTone.soft
              }`}
            >
              <span className="block text-sm font-black tabular-nums leading-none sm:text-base">
                {result.presets[preset.key].fps}
                <span className="ml-1 text-[10px] font-bold">FPS</span>
              </span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide">
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>

      <section className="hud-panel flex flex-col gap-3 p-4 sm:p-5" aria-label={t('results.bottleneckTitle')}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">
            {t('results.bottleneckTitle')}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              displayed.bottleneck.type === 'balanced' ? 'bg-[#157a38] text-white' : 'bg-[#f5c518] text-[#1a1203]'
            }`}
          >
            {displayed.bottleneck.type === 'balanced'
              ? t('results.bottleneckBalanced')
              : displayed.bottleneck.type === 'gpu_bound'
                ? t('results.bottleneckGpu')
                : t('results.bottleneckCpu')}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-white/75">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#7dd3fc]" />
            CPU {displayed.bottleneck.cpuLoadPercent}%
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#8dffb4]" />
            GPU {displayed.bottleneck.gpuLoadPercent}%
          </span>
        </div>

        <p className="text-sm leading-relaxed text-white/80">
          {t(`results.${displayed.bottleneck.descriptionKey}`)}
        </p>

        <Meter
          label={t('results.vramMeter')}
          detail={`${vramGB} GB`}
          percent={vram.fillPercent}
          tone={meterTone(vram.status)}
          caption={vramWarning ? t(`results.${vramWarning.messageKey}`) : meterLabel(vram.status)}
        />
        <Meter
          label={t('results.storageMeter')}
          detail={`×${storageFactor[storageType].toFixed(2)}`}
          percent={Math.round((storageFactor[storageType] / 1.03) * 100)}
          tone={meterTone(storageStatus)}
          caption={storageWarning ? t(`results.${storageWarning.messageKey}`) : meterLabel(storageStatus)}
        />

        {otherWarnings.map((warning) => (
          <p key={warning.id} className="text-sm leading-relaxed text-white/80">
            {t(`results.${warning.messageKey}`)}
          </p>
        ))}
      </section>
    </div>
  );
}

function Meter({
  label,
  detail,
  percent,
  tone,
  caption,
}: {
  label: string;
  detail: string;
  percent: number;
  tone: string;
  caption: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
        <span className="font-semibold text-white">{label}</span>
        <span className="tabular-nums text-white/75">
          {detail} · {percent}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10" role="meter" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1 text-xs leading-relaxed text-white/70">{caption}</p>
    </div>
  );
}
