'use client';

import { useState, useMemo, useCallback, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { GPUS, GPUS_MAP, type GpuTier } from '@/data/gpus';
import { CPUS, CPUS_MAP } from '@/data/cpus';
import {
  estimatePerformance,
  type CalculationInput,
  type Resolution,
  type StorageType,
  type UpscalerMode,
  type PresetTier,
} from '@/lib/estimator';
import { HardwareCombobox, type ComboboxOption } from '@/components/HardwareCombobox';
import { FpsResultCard } from '@/components/FpsResultCard';
import { UpgradeAffiliateBox } from '@/components/UpgradeAffiliateBox';

const RAM_STEPS = [8, 16, 32, 64] as const;

const STORAGE_OPTIONS: { id: StorageType; label: string; hintKey: 'storageNvme' | 'storageGen3' | 'storageSata' | 'storageHdd' }[] = [
  { id: 'nvme_gen4', label: 'NVMe 4.0', hintKey: 'storageNvme' },
  { id: 'nvme_gen3', label: 'NVMe 3.0', hintKey: 'storageGen3' },
  { id: 'sata_ssd', label: 'SATA', hintKey: 'storageSata' },
  { id: 'hdd', label: 'HDD', hintKey: 'storageHdd' },
];

const GPU_TIER_KEY: Record<GpuTier, 'specs.tierBudget' | 'specs.tierEntry' | 'specs.tierMid' | 'specs.tierHigh' | 'specs.tierTop'> = {
  budget: 'specs.tierBudget',
  entry: 'specs.tierEntry',
  mid: 'specs.tierMid',
  high: 'specs.tierHigh',
  enthusiast: 'specs.tierTop',
};

const RESOLUTION_OPTIONS: { id: Resolution; label: string }[] = [
  { id: '1080p', label: '1080p' },
  { id: '1440p', label: '1440p' },
  { id: '4k', label: '4K' },
];

export function HardwareCalculator() {
  return (
    <Suspense fallback={<HardwareCalculatorSkeleton />}>
      <HardwareCalculatorInner />
    </Suspense>
  );
}

function HardwareCalculatorInner() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const initialGpu = searchParams.get('gpu') || 'rtx-4070-super';
  const initialCpu = searchParams.get('cpu') || 'ryzen-7-7800x3d';
  const initialRam = parseInt(searchParams.get('ram') || '32', 10);
  const initialStorage = (searchParams.get('storage') as StorageType) || 'nvme_gen4';
  const initialRes = (searchParams.get('res') as Resolution) || '1440p';
  const initialRt = searchParams.get('rt') === '0' ? false : true;
  const initialUpscale = (searchParams.get('upscale') as UpscalerMode) || 'quality';

  const [gpuId, setGpuId] = useState<string>(initialGpu in GPUS_MAP ? initialGpu : 'rtx-4070-super');
  const [cpuId, setCpuId] = useState<string>(initialCpu in CPUS_MAP ? initialCpu : 'ryzen-7-7800x3d');
  const [ramGB, setRamGB] = useState<number>(RAM_STEPS.includes(initialRam as (typeof RAM_STEPS)[number]) ? initialRam : 32);
  const [storageType, setStorageType] = useState<StorageType>(initialStorage);
  const [resolution, setResolution] = useState<Resolution>(initialRes);
  const [rayTracing, setRayTracing] = useState<boolean>(initialRt);
  const [upscaler, setUpscaler] = useState<UpscalerMode>(initialUpscale);
  const [selectedPreset, setSelectedPreset] = useState<PresetTier>('high');

  const gpuOptions: ComboboxOption[] = useMemo(
    () =>
      GPUS.map((gpu) => ({
        id: gpu.id,
        name: gpu.name,
        brand: gpu.brand,
        secondaryInfo: `${gpu.vramGB} GB VRAM · ${t(GPU_TIER_KEY[gpu.tier])}`,
        score: gpu.rasterScore,
        highlight: gpu.vramGB >= 16,
      })),
    [t]
  );

  const cpuOptions: ComboboxOption[] = useMemo(
    () =>
      CPUS.map((cpu) => ({
        id: cpu.id,
        name: cpu.name,
        brand: cpu.brand,
        secondaryInfo: `${cpu.cores}C/${cpu.threads}T • ${cpu.architecture}`,
        score: cpu.gamingScore,
        highlight: cpu.has3DVcache,
      })),
    []
  );

  const updateUrlParams = useCallback(
    (newParams: Partial<CalculationInput>) => {
      const current = new URLSearchParams(searchParams.toString());
      if (newParams.gpuId) current.set('gpu', newParams.gpuId);
      if (newParams.cpuId) current.set('cpu', newParams.cpuId);
      if (newParams.ramGB) current.set('ram', String(newParams.ramGB));
      if (newParams.storageType) current.set('storage', newParams.storageType);
      if (newParams.resolution) current.set('res', newParams.resolution);
      if (newParams.rayTracing !== undefined) current.set('rt', newParams.rayTracing ? '1' : '0');
      if (newParams.upscaler) current.set('upscale', newParams.upscaler);

      startTransition(() => {
        router.replace(`${pathname}?${current.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const calculationInput: CalculationInput = useMemo(
    () => ({
      gpuId,
      cpuId,
      ramGB,
      storageType,
      resolution,
      rayTracing,
      upscaler,
    }),
    [gpuId, cpuId, ramGB, storageType, resolution, rayTracing, upscaler]
  );

  const result = useMemo(() => estimatePerformance(calculationInput), [calculationInput]);
  const ramIndex = Math.max(0, RAM_STEPS.indexOf(ramGB as (typeof RAM_STEPS)[number]));
  const ramFill = `${(ramIndex / (RAM_STEPS.length - 1)) * 100}%`;

  const handleGpuChange = (id: string) => {
    setGpuId(id);
    updateUrlParams({ gpuId: id });
  };

  const handleCpuChange = (id: string) => {
    setCpuId(id);
    updateUrlParams({ cpuId: id });
  };

  const handleRamChange = (val: number) => {
    setRamGB(val);
    updateUrlParams({ ramGB: val });
  };

  const handleStorageChange = (val: StorageType) => {
    setStorageType(val);
    updateUrlParams({ storageType: val });
  };

  const handleResolutionChange = (val: Resolution) => {
    setResolution(val);
    updateUrlParams({ resolution: val });
  };

  const handleRayTracingToggle = (val: boolean) => {
    setRayTracing(val);
    updateUrlParams({ rayTracing: val });
  };

  const handleUpscalerChange = (val: UpscalerMode) => {
    setUpscaler(val);
    updateUrlParams({ upscaler: val });
  };

  const handleCheck = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('fps-readout')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  const upscalerOptions: { id: UpscalerMode; label: string }[] = [
    { id: 'native', label: t('calculator.modeNative') },
    { id: 'quality', label: t('calculator.modeQuality') },
    { id: 'balanced', label: t('calculator.modeBalanced') },
    { id: 'performance', label: t('calculator.modePerformance') },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <form
          className="hud-panel flex flex-col gap-3.5 p-4 sm:p-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleCheck();
          }}
        >
          <div>
            <h1 className="font-display text-lg font-extrabold uppercase tracking-wide text-white">
              {t('calculator.title')}
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-white/75">
              {t('calculator.subtitle')}
            </p>
          </div>

          <HardwareCombobox
            label={t('calculator.gpuLabel')}
            options={gpuOptions}
            selectedId={gpuId}
            onSelect={handleGpuChange}
            placeholder={t('calculator.gpuPlaceholder')}
            typeIcon="gpu"
            compact
          />

          <HardwareCombobox
            label={t('calculator.cpuLabel')}
            options={cpuOptions}
            selectedId={cpuId}
            onSelect={handleCpuChange}
            placeholder={t('calculator.cpuPlaceholder')}
            typeIcon="cpu"
            compact
          />

          <div>
            <label htmlFor="ram-slider" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-white/75">
              {t('calculator.ramLabel')}
            </label>
            <input
              id="ram-slider"
              className="ram-slider"
              type="range"
              min={0}
              max={RAM_STEPS.length - 1}
              step={1}
              value={ramIndex}
              aria-valuetext={`${ramGB} GB`}
              style={{ ['--ram-fill' as string]: ramFill }}
              onChange={(event) => handleRamChange(RAM_STEPS[Number(event.target.value)])}
            />
            <div className="relative mt-2 h-4 text-[11px] font-semibold tabular-nums text-white/70">
              {RAM_STEPS.map((step, index) => (
                <span
                  key={step}
                  className={`absolute top-0 whitespace-nowrap ${step === ramGB ? 'text-white' : ''}`}
                  style={{
                    left: `${(index / (RAM_STEPS.length - 1)) * 100}%`,
                    transform: index === 0 ? 'none' : index === RAM_STEPS.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
                  }}
                >
                  {step} GB
                </span>
              ))}
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/75">
              {t('calculator.storageLabel')}
            </legend>
            <div className="grid grid-cols-4 gap-1.5">
              {STORAGE_OPTIONS.map((option) => {
                const isSelected = storageType === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    title={t(`calculator.${option.hintKey}`)}
                    aria-pressed={isSelected}
                    onClick={() => handleStorageChange(option.id)}
                    className={`min-h-10 rounded-md px-1 text-[11px] font-bold ${
                      isSelected ? 'bg-[#3ec6ff] text-[#041018]' : 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/75">
              {t('calculator.resolutionLabel')}
            </legend>
            <div className="grid grid-cols-3 gap-1.5">
              {RESOLUTION_OPTIONS.map((option) => {
                const isSelected = resolution === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleResolutionChange(option.id)}
                    className={`min-h-10 rounded-md text-sm font-bold tabular-nums ${
                      isSelected ? 'bg-[#3ec6ff] text-[#041018]' : 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex items-center justify-between gap-3">
            <span id="ray-tracing-label" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/75">
              {t('calculator.rayTracingLabel')}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={rayTracing}
              aria-labelledby="ray-tracing-label"
              onClick={() => handleRayTracingToggle(!rayTracing)}
              className={`relative h-7 w-12 shrink-0 rounded-full ${rayTracing ? 'bg-[#3ec6ff]' : 'bg-white/20'}`}
            >
              <span
              className={`absolute left-0 top-1 h-5 w-5 rounded-full transition-transform ${
                rayTracing ? 'translate-x-6 bg-[#041018]' : 'translate-x-1 bg-white'
              }`}
              />
            </button>
          </div>

          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/75">
              {t('calculator.upscalerLabel')}
            </legend>
            <div className="grid grid-cols-4 gap-1.5">
              {upscalerOptions.map((option) => {
                const isSelected = upscaler === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleUpscalerChange(option.id)}
                    className={`min-h-10 rounded-md px-1 text-[11px] font-bold leading-tight ${
                      isSelected ? 'bg-[#3ec6ff] text-[#041018]' : 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <button
              type="submit"
              className="min-h-11 w-full rounded-md bg-[#0757b5] text-sm font-extrabold uppercase tracking-[0.14em] text-white hover:bg-[#064e96]"
            >
              {t('calculator.checkCta')}
            </button>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-white/70">
              {t('calculator.liveHint')}
            </p>
          </div>
        </form>

        <FpsResultCard
          result={result}
          targetResolution={resolution}
          targetPreset={selectedPreset}
          onSelectPreset={setSelectedPreset}
          vramGB={GPUS_MAP[gpuId]?.vramGB ?? 8}
          storageType={storageType}
          rayTracing={rayTracing}
          upscaler={upscaler}
        />
      </div>

      <UpgradeAffiliateBox recommendation={result.recommendation} />
    </div>
  );
}

function HardwareCalculatorSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <div className="hud-panel min-h-[520px]" />
      <div className="hud-panel min-h-[520px]" />
    </div>
  );
}
