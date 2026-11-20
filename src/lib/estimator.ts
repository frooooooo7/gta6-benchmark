import { GPUS_MAP, type GpuSpec } from '@/data/gpus';
import { CPUS_MAP, type CpuSpec } from '@/data/cpus';

export type Resolution = '1080p' | '1440p' | '4k';
export type StorageType = 'nvme_gen4' | 'nvme_gen3' | 'sata_ssd' | 'hdd';
export type UpscalerMode = 'native' | 'quality' | 'balanced' | 'performance';
export type PresetTier = 'low' | 'medium' | 'high' | 'ultra';

export interface CalculationInput {
  gpuId: string;
  cpuId: string;
  ramGB: number;
  storageType: StorageType;
  resolution: Resolution;
  rayTracing: boolean;
  upscaler: UpscalerMode;
}

export interface PresetResult {
  fps: number;
  low1Percent: number;
  playable: boolean;
  bottleneck: BottleneckAnalysis;
}

export interface BottleneckAnalysis {
  type: 'cpu_bound' | 'gpu_bound' | 'balanced';
  percentage: number;
  descriptionKey: string;
  cpuLoadPercent: number;
  gpuLoadPercent: number;
}

export interface HardwareWarning {
  id: 'vram' | 'storage' | 'ram' | 'cpu_cores';
  severity: 'critical' | 'warning' | 'info';
  titleKey: string;
  messageKey: string;
  details?: string;
}

export interface UpgradeRecommendation {
  type: 'gpu' | 'cpu' | 'ram' | 'storage' | 'none';
  targetComponentId?: string;
  targetComponentName?: string;
  estimatedFpsGainPercent: number;
  reasonKey: string;
  newFpsEstimate?: number;
  affiliateSlug?: string;
}

export interface EstimationResult {
  fps: number; // Primary FPS (Target High preset)
  low1Percent: number;
  presets: Record<PresetTier, PresetResult>;
  bottleneck: BottleneckAnalysis;
  warnings: HardwareWarning[];
  recommendation: UpgradeRecommendation;
  tierStatus: 'unplayable' | 'playable' | 'smooth' | 'high_refresh' | 'enthusiast';
  systemScore: number;
}

// =========================================================================
// CALIBRATION ENGINE CONSTANTS (PS5 / XSX Baseline Calibration)
// =========================================================================
// PS5 Hardware Reference:
// - GPU: Custom RDNA 2 with 36 CUs (equiv. RX 6700 ~ 49 raster score, 28 RT score)
// - CPU: 8-Core Zen 2 @ 3.5 GHz (equiv. Ryzen 7 3700X ~ 44 gaming score)
// - Target Console Output: 1440p dynamic reconstructed to 4K @ 30 FPS with RTGI
// =========================================================================

const RESOLUTION_GPU_FACTORS: Record<Resolution, number> = {
  '1080p': 1.0,
  '1440p': 0.69, // Model factor. 1440p is 1.78× the pixels of 1080p.
  '4k': 0.40,    // Model factor. 4K is 4× the pixels of 1080p.
};

const MIN_FPS = 1;

const UPSCALER_MULTIPLIERS: Record<UpscalerMode, number> = {
  native: 1.0,
  quality: 1.32,
  balanced: 1.48,
  performance: 1.68,
};

const PRESET_GPU_FACTORS: Record<PresetTier, number> = {
  low: 1.42,
  medium: 1.18,
  high: 1.0,
  ultra: 0.74,
};

/**
 * Calculates GTA 6 performance metrics based on hardware parameters.
 * The upgrade percent is a second pass of this same model.
 */
export function estimatePerformance(input: CalculationInput): EstimationResult {
  const core = computeCore(input);
  const gpu = GPUS_MAP[input.gpuId] || GPUS_MAP['rtx-4070-super'] || Object.values(GPUS_MAP)[0];
  const cpu = CPUS_MAP[input.cpuId] || CPUS_MAP['ryzen-7-7800x3d'] || Object.values(CPUS_MAP)[0];

  return {
    ...core,
    recommendation: generateUpgradeRecommendation(gpu, cpu, input, core.bottleneck, core.fps),
  };
}

function computeCore(input: CalculationInput): Omit<EstimationResult, 'recommendation'> {
  const gpu = GPUS_MAP[input.gpuId] || GPUS_MAP['rtx-4070-super'] || Object.values(GPUS_MAP)[0];
  const cpu = CPUS_MAP[input.cpuId] || CPUS_MAP['ryzen-7-7800x3d'] || Object.values(CPUS_MAP)[0];

  const memoryMultiplier = calculateMemoryMultiplier(input.ramGB);
  const storageMultiplier = calculateStorageMultiplier(input.storageType);
  const systemEnvironmentFactor = memoryMultiplier * storageMultiplier;
  const low1PercentRatio = calculateLowRatio(cpu, gpu, input);

  const presets: Record<PresetTier, PresetResult> = {
    low: generatePresetResult(gpu, cpu, input, 'low', systemEnvironmentFactor, low1PercentRatio),
    medium: generatePresetResult(gpu, cpu, input, 'medium', systemEnvironmentFactor, low1PercentRatio),
    high: generatePresetResult(gpu, cpu, input, 'high', systemEnvironmentFactor, low1PercentRatio),
    ultra: generatePresetResult(gpu, cpu, input, 'ultra', systemEnvironmentFactor, low1PercentRatio),
  };

  return {
    fps: presets.high.fps,
    low1Percent: presets.high.low1Percent,
    presets,
    bottleneck: presets.high.bottleneck,
    warnings: generateHardwareWarnings(gpu, cpu, input),
    tierStatus: determineTierStatus(presets.high.fps),
    systemScore: Math.min(100, Math.round((gpu.rasterScore * 0.6 + cpu.gamingScore * 0.4))),
  };
}

// =========================================================================
// HELPER FUNCTIONS
// =========================================================================

function calculateGpuFps(gpu: GpuSpec, input: CalculationInput): number {
  // Baseline: RX 6700 (49 raster score) produces ~48 FPS at 1080p High without RT
  const baseScale = 1.05;
  let effectiveScore = gpu.rasterScore;

  // Ray Tracing calculations
  if (input.rayTracing) {
    if (gpu.rtScore === 0) {
      // GPU lacks dedicated RT cores (e.g. GTX 1660 Super)
      effectiveScore *= 0.35;
    } else {
      // Modern RT units handle ray bounces based on RT architecture
      const rtEfficiency = Math.min(1, gpu.rtScore / 100);
      const rtDropFactor = 0.58 + rtEfficiency * 0.36; // Range: 0.58x to 0.94x
      effectiveScore *= rtDropFactor;
    }
  }

  // Resolution scaling
  effectiveScore *= RESOLUTION_GPU_FACTORS[input.resolution];

  // Upscaling scaling
  effectiveScore *= UPSCALER_MULTIPLIERS[input.upscaler];

  effectiveScore *= averageVramFactor(gpu.vramGB, input.resolution);

  return Math.round(effectiveScore * baseScale);
}

function calculateCpuFps(cpu: CpuSpec, input: CalculationInput): number {
  // gamingScore already includes 3D V-Cache and core count. Do not multiply them again.
  // Baseline: Ryzen 7 3700X (44) → round(44 * 1.55) = 68 FPS CPU ceiling before RAM and storage.
  let cpuScore = cpu.gamingScore;

  if (input.rayTracing) {
    cpuScore *= 0.90;
  }

  return Math.round(cpuScore * 1.55);
}

function calculateMemoryMultiplier(ramGB: number): number {
  if (ramGB <= 8) return 0.78;  // Severe paging to disk
  if (ramGB < 16) return 0.92;
  if (ramGB >= 32) return 1.02; // Optimal headroom for GTA 6 DirectStorage memory buffers
  return 1.0;
}

function calculateStorageMultiplier(storageType: StorageType): number {
  switch (storageType) {
    case 'hdd':
      return 0.85; // Heavy micro-stutters during asset streaming
    case 'sata_ssd':
      return 0.97;
    case 'nvme_gen3':
      return 1.0;
    case 'nvme_gen4':
      return 1.03; // Native DirectStorage 1.2 GPU decompression
  }
}

function calculateLowRatio(cpu: CpuSpec, gpu: GpuSpec, input: CalculationInput): number {
  let ratio = 0.72;
  if (cpu.has3DVcache) ratio += 0.09;
  if (input.storageType === 'nvme_gen4') ratio += 0.03;
  if (input.storageType === 'hdd') ratio -= 0.22;
  if (input.ramGB <= 8) ratio -= 0.20;
  if (isVramConstrained(gpu.vramGB, input.resolution)) ratio -= 0.12;
  return Math.max(0.18, ratio);
}

/** Average-FPS multiplier. Separate from the 1% low penalty in isVramConstrained. */
export function averageVramFactor(vramGB: number, resolution: Resolution): number {
  if (resolution === '4k' && vramGB <= 8) return 0.75;
  if (resolution === '1440p' && vramGB <= 6) return 0.80;
  return 1;
}

export function isVramConstrained(vramGB: number, res: Resolution): boolean {
  if (res === '4k' && vramGB < 12) return true;
  if (res === '1440p' && vramGB <= 8) return true;
  if (res === '1080p' && vramGB <= 4) return true;
  return false;
}

export function vramBudget(vramGB: number, resolution: Resolution): {
  status: 'ok' | 'tight' | 'critical';
  comfortGB: number;
  fillPercent: number;
  averageFactor: number;
} {
  const averageFactor = averageVramFactor(vramGB, resolution);
  const comfortGB = resolution === '4k' ? 12 : resolution === '1440p' ? 10 : 6;
  const status: 'ok' | 'tight' | 'critical' =
    averageFactor < 1 ? 'critical' : isVramConstrained(vramGB, resolution) ? 'tight' : 'ok';

  return {
    status,
    comfortGB,
    fillPercent: Math.min(100, Math.round((comfortGB / Math.max(vramGB, 1)) * 100)),
    averageFactor,
  };
}

function generatePresetResult(
  gpu: GpuSpec,
  cpu: CpuSpec,
  input: CalculationInput,
  preset: PresetTier,
  envFactor: number,
  baseLowRatio: number
): PresetResult {
  const gpuPresetFps = calculateGpuFps(gpu, input) * PRESET_GPU_FACTORS[preset];
  const cpuPresetMultiplier = preset === 'low' ? 1.08 : preset === 'ultra' ? 0.94 : 1.0;
  const cpuPresetFps = calculateCpuFps(cpu, input) * cpuPresetMultiplier;
  const fps = Math.max(MIN_FPS, Math.round(Math.min(gpuPresetFps, cpuPresetFps) * envFactor));
  const low1Percent = Math.max(MIN_FPS, Math.round(fps * baseLowRatio));

  return {
    fps,
    low1Percent,
    playable: fps >= 30,
    bottleneck: analyzeBottleneck(gpuPresetFps, cpuPresetFps),
  };
}

function loadShare(used: number, ceiling: number): number {
  if (ceiling <= 0) return 100;
  return Math.max(1, Math.min(100, Math.round((used / ceiling) * 100)));
}

function analyzeBottleneck(gpuFps: number, cpuFps: number): BottleneckAnalysis {
  const faster = Math.max(gpuFps, cpuFps, 1);
  const slower = Math.min(gpuFps, cpuFps);
  const unusedPercent = Math.min(99, Math.round(((faster - slower) / faster) * 100));
  const cpuLoadPercent = loadShare(slower, cpuFps);
  const gpuLoadPercent = loadShare(slower, gpuFps);

  if (unusedPercent <= 8) {
    return {
      type: 'balanced',
      percentage: unusedPercent,
      descriptionKey: 'bottleneckBalancedDesc',
      cpuLoadPercent,
      gpuLoadPercent,
    };
  }

  if (gpuFps < cpuFps) {
    return {
      type: 'gpu_bound',
      percentage: unusedPercent,
      descriptionKey: 'bottleneckGpuDesc',
      cpuLoadPercent,
      gpuLoadPercent,
    };
  }

  return {
    type: 'cpu_bound',
    percentage: unusedPercent,
    descriptionKey: 'bottleneckCpuDesc',
    cpuLoadPercent,
    gpuLoadPercent,
  };
}

function generateHardwareWarnings(
  gpu: GpuSpec,
  cpu: CpuSpec,
  input: CalculationInput
): HardwareWarning[] {
  const warnings: HardwareWarning[] = [];

  const vram = vramBudget(gpu.vramGB, input.resolution);
  if (vram.status === 'critical') {
    warnings.push({
      id: 'vram',
      severity: 'critical',
      titleKey: 'vramWarningTitle',
      messageKey: 'vramWarningAverage',
      details: `${gpu.vramGB} GB at ${input.resolution} multiplies average FPS by ${vram.averageFactor}.`,
    });
  } else if (vram.status === 'tight') {
    warnings.push({
      id: 'vram',
      severity: 'warning',
      titleKey: 'vramWarningTitle',
      messageKey: 'vramWarningLows',
      details: `${gpu.vramGB} GB at ${input.resolution} lowers 1% lows only.`,
    });
  }

  // Storage Warning
  if (input.storageType === 'hdd') {
    warnings.push({
      id: 'storage',
      severity: 'critical',
      titleKey: 'storageWarningTitle',
      messageKey: 'storageWarningHdd',
      details: 'Mechanical HDD will cause severe micro-stutters during vehicle driving.',
    });
  }

  // RAM Warning
  if (input.ramGB <= 8) {
    warnings.push({
      id: 'ram',
      severity: 'critical',
      titleKey: 'ramTitle',
      messageKey: 'ramWarning8gb',
      details: '8 GB RAM will trigger continuous Windows pagefile swapping.',
    });
  }

  // CPU Quad Core Warning
  if (cpu.cores <= 4) {
    warnings.push({
      id: 'cpu_cores',
      severity: 'warning',
      titleKey: 'bottleneckTitle',
      messageKey: 'cpuCoresWarning',
      details: '4-core processors lack sufficient threads for background streaming.',
    });
  }

  return warnings;
}

function fpsGainPercent(currentFps: number, nextFps: number): number {
  if (currentFps <= 0 || nextFps <= currentFps) return 0;
  return Math.round(((nextFps - currentFps) / currentFps) * 100);
}

function measuredUpgrade(
  input: CalculationInput,
  currentFps: number,
  patch: Partial<CalculationInput>
): { nextFps: number; gainPercent: number } {
  const nextFps = computeCore({ ...input, ...patch }).fps;
  return { nextFps, gainPercent: fpsGainPercent(currentFps, nextFps) };
}

function generateUpgradeRecommendation(
  gpu: GpuSpec,
  cpu: CpuSpec,
  input: CalculationInput,
  bottleneck: BottleneckAnalysis,
  currentFps: number
): UpgradeRecommendation {
  if (input.storageType === 'hdd') {
    const measured = measuredUpgrade(input, currentFps, { storageType: 'nvme_gen4' });
    return {
      type: 'storage',
      targetComponentName: '1TB NVMe PCIe 4.0 SSD (DirectStorage Ready)',
      estimatedFpsGainPercent: measured.gainPercent,
      reasonKey: 'storageWarningHdd',
      newFpsEstimate: measured.nextFps,
      affiliateSlug: 'nvme-gen4-1tb',
    };
  }

  if (input.ramGB <= 8) {
    const measured = measuredUpgrade(input, currentFps, { ramGB: 32 });
    return {
      type: 'ram',
      targetComponentName: '32GB (2x16GB) High-Speed RAM Kit',
      estimatedFpsGainPercent: measured.gainPercent,
      reasonKey: 'ramWarning8gb',
      newFpsEstimate: measured.nextFps,
      affiliateSlug: 'ram-32gb-ddr4-ddr5',
    };
  }

  if (bottleneck.type === 'gpu_bound' && bottleneck.percentage >= 15) {
    let candidates = Object.values(GPUS_MAP)
      .filter((g) => g.id !== gpu.id && g.rasterScore >= gpu.rasterScore * 1.35 && g.vramGB >= 12);

    if (candidates.length === 0) {
      candidates = Object.values(GPUS_MAP)
        .filter((g) => g.id !== gpu.id && g.rasterScore >= gpu.rasterScore * 1.20 && g.vramGB >= 12);
    }

    if (candidates.length === 0) {
      candidates = Object.values(GPUS_MAP)
        .filter((g) => g.id !== gpu.id && g.rasterScore > gpu.rasterScore && g.vramGB >= gpu.vramGB);
    }

    const sameBrandCandidates = candidates.filter((g) => g.brand === gpu.brand);
    const targetPool = (sameBrandCandidates.length > 0 ? sameBrandCandidates : candidates)
      .sort((a, b) => a.rasterScore - b.rasterScore);

    for (const recommendedGpu of targetPool) {
      const measured = measuredUpgrade(input, currentFps, { gpuId: recommendedGpu.id });
      if (measured.gainPercent <= 0) continue;

      return {
        type: 'gpu',
        targetComponentId: recommendedGpu.id,
        targetComponentName: recommendedGpu.name,
        estimatedFpsGainPercent: measured.gainPercent,
        reasonKey: 'gpuUpgradeBadge',
        newFpsEstimate: measured.nextFps,
        affiliateSlug: recommendedGpu.popularAffiliateSlug || recommendedGpu.id,
      };
    }
  }

  if (bottleneck.type === 'cpu_bound' && bottleneck.percentage >= 15) {
    let recommendedCpu: CpuSpec | undefined;
    if (cpu.brand === 'AMD') {
      if (cpu.socket === 'AM4') {
        recommendedCpu =
          cpu.id === 'ryzen-7-5700x3d' || cpu.id === 'ryzen-7-5800x3d'
            ? CPUS_MAP['ryzen-7-7800x3d']
            : CPUS_MAP['ryzen-7-5700x3d'];
      } else {
        recommendedCpu =
          cpu.id === 'ryzen-7-7800x3d' || cpu.id === 'ryzen-7-9800x3d'
            ? undefined
            : (CPUS_MAP['ryzen-7-7800x3d'] || CPUS_MAP['ryzen-7-9800x3d']);
      }
    } else {
      if (cpu.gamingScore < 75) {
        recommendedCpu = CPUS_MAP['core-i5-13600k'] || CPUS_MAP['core-i5-14600k'];
      } else if (cpu.gamingScore < 85) {
        recommendedCpu = CPUS_MAP['core-i7-14700k'];
      } else {
        recommendedCpu = CPUS_MAP['core-i9-14900k'];
      }
    }

    if (recommendedCpu && recommendedCpu.id !== cpu.id && recommendedCpu.gamingScore > cpu.gamingScore) {
      const measured = measuredUpgrade(input, currentFps, { cpuId: recommendedCpu.id });
      if (measured.gainPercent > 0) {
        return {
          type: 'cpu',
          targetComponentId: recommendedCpu.id,
          targetComponentName: recommendedCpu.name,
          estimatedFpsGainPercent: measured.gainPercent,
          reasonKey: 'cpuUpgradeBadge',
          newFpsEstimate: measured.nextFps,
          affiliateSlug: recommendedCpu.popularAffiliateSlug || recommendedCpu.id,
        };
      }
    }
  }

  return {
    type: 'none',
    estimatedFpsGainPercent: 0,
    reasonKey: 'verdict',
  };
}

function determineTierStatus(fps: number): EstimationResult['tierStatus'] {
  if (fps < 30) return 'unplayable';
  if (fps < 60) return 'playable';       // 30–59 FPS (Console tier)
  if (fps < 90) return 'smooth';         // 60–89 FPS (PC standard)
  if (fps < 120) return 'high_refresh';  // 90–119 FPS
  return 'enthusiast';                   // 120+ FPS
}
