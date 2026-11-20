import { estimatePerformance, vramBudget, type CalculationInput } from '../src/lib/estimator';

const failures: string[] = [];

const check = (name: string, condition: boolean, detail: string) => {
  if (!condition) failures.push(`${name}: ${detail}`);
};

const sweet: CalculationInput = {
  gpuId: 'rtx-4070-super',
  cpuId: 'ryzen-7-7800x3d',
  ramGB: 32,
  storageType: 'nvme_gen4',
  resolution: '1440p',
  rayTracing: true,
  upscaler: 'quality',
};

const sweetResult = estimatePerformance(sweet);
check('default high', sweetResult.fps === 70, `expected 70, got ${sweetResult.fps}`);
check('default 1% low', sweetResult.low1Percent === 59, `expected 59, got ${sweetResult.low1Percent}`);
check('high matches headline', sweetResult.presets.high.fps === sweetResult.fps, 'preset high drifted from headline');
check(
  'preset order',
  sweetResult.presets.low.fps >= sweetResult.presets.medium.fps &&
    sweetResult.presets.medium.fps >= sweetResult.presets.high.fps &&
    sweetResult.presets.high.fps >= sweetResult.presets.ultra.fps,
  `${sweetResult.presets.low.fps}/${sweetResult.presets.medium.fps}/${sweetResult.presets.high.fps}/${sweetResult.presets.ultra.fps}`
);

const weak = estimatePerformance({
  gpuId: 'gtx-1650',
  cpuId: 'ryzen-5-3600',
  ramGB: 8,
  storageType: 'hdd',
  resolution: '1080p',
  rayTracing: false,
  upscaler: 'native',
});
check(
  'weak preset order',
  weak.presets.low.fps >= weak.presets.medium.fps &&
    weak.presets.medium.fps >= weak.presets.high.fps &&
    weak.presets.high.fps >= weak.presets.ultra.fps,
  `${weak.presets.low.fps}/${weak.presets.medium.fps}/${weak.presets.high.fps}/${weak.presets.ultra.fps}`
);
check(
  'weak 1% low order',
  weak.presets.low.low1Percent >= weak.presets.medium.low1Percent &&
    weak.presets.medium.low1Percent >= weak.presets.high.low1Percent &&
    weak.presets.high.low1Percent >= weak.presets.ultra.low1Percent,
  `${weak.presets.low.low1Percent}/${weak.presets.medium.low1Percent}/${weak.presets.high.low1Percent}/${weak.presets.ultra.low1Percent}`
);

const assertUpgrade = (label: string, input: CalculationInput) => {
  const current = estimatePerformance(input);
  const rec = current.recommendation;
  if (rec.type === 'none') return;

  const patch: Partial<CalculationInput> =
    rec.type === 'gpu' && rec.targetComponentId
      ? { gpuId: rec.targetComponentId }
      : rec.type === 'cpu' && rec.targetComponentId
        ? { cpuId: rec.targetComponentId }
        : rec.type === 'ram'
          ? { ramGB: 32 }
          : rec.type === 'storage'
            ? { storageType: 'nvme_gen4' }
            : {};

  const next = estimatePerformance({ ...input, ...patch });
  const expectedGain = next.fps <= current.fps ? 0 : Math.round(((next.fps - current.fps) / current.fps) * 100);
  check(`${label} next fps`, rec.newFpsEstimate === next.fps, `badge ${rec.newFpsEstimate}, rerun ${next.fps}`);
  check(`${label} gain`, rec.estimatedFpsGainPercent === expectedGain, `badge ${rec.estimatedFpsGainPercent}%, rerun ${expectedGain}%`);
};

assertUpgrade('sweet gpu', sweet);
assertUpgrade('hdd', { ...sweet, storageType: 'hdd' });
assertUpgrade('ram8', { ...sweet, ramGB: 8 });

const cpuBound = estimatePerformance({
  gpuId: 'rtx-4090',
  cpuId: 'core-i3-12100f',
  ramGB: 16,
  storageType: 'nvme_gen4',
  resolution: '1080p',
  rayTracing: false,
  upscaler: 'native',
});
const zen2 = estimatePerformance({
  ...cpuBound,
  gpuId: 'rtx-4090',
  cpuId: 'ryzen-7-3700x',
  ramGB: 16,
  storageType: 'nvme_gen4',
  resolution: '1080p',
  rayTracing: false,
  upscaler: 'native',
});
check('i3 beats 3700X on score', cpuBound.fps > zen2.fps, `i3 ${cpuBound.fps}, 3700X ${zen2.fps}`);
check('i3 is cpu bound', cpuBound.bottleneck.type === 'cpu_bound', cpuBound.bottleneck.type);
check('i3 upgrade is a cpu', cpuBound.recommendation.type === 'cpu', cpuBound.recommendation.type);
assertUpgrade('i3 cpu', {
  gpuId: 'rtx-4090',
  cpuId: 'core-i3-12100f',
  ramGB: 16,
  storageType: 'nvme_gen4',
  resolution: '1080p',
  rayTracing: false,
  upscaler: 'native',
});

const cacheFast = {
  gpuId: 'rtx-5090',
  ramGB: 16,
  storageType: 'nvme_gen4' as const,
  resolution: '1080p' as const,
  rayTracing: false,
  upscaler: 'native' as const,
};
const x3d = estimatePerformance({ ...cacheFast, cpuId: 'ryzen-7-7800x3d' });
const plain = estimatePerformance({ ...cacheFast, cpuId: 'ryzen-7-7700x' });
const cacheRatio = x3d.fps / plain.fps;
check('vcache is not doubled', cacheRatio < 1.35 && cacheRatio > 1.1, `ratio ${cacheRatio.toFixed(3)} (${x3d.fps}/${plain.fps})`);

const fourK = {
  cpuId: 'ryzen-7-9800x3d',
  ramGB: 32,
  storageType: 'nvme_gen4' as const,
  resolution: '4k' as const,
  rayTracing: true,
  upscaler: 'quality' as const,
};
const fps4090 = estimatePerformance({ ...fourK, gpuId: 'rtx-4090' }).fps;
const fps5090 = estimatePerformance({ ...fourK, gpuId: 'rtx-5090' }).fps;
check('flagship gap', fps5090 >= Math.round(fps4090 * 1.2), `4090 ${fps4090}, 5090 ${fps5090}`);

check('gpu load is the ceiling', sweetResult.bottleneck.type === 'gpu_bound' && sweetResult.bottleneck.gpuLoadPercent === 100, `${sweetResult.bottleneck.gpuLoadPercent}%`);
check('cpu load is the share', sweetResult.bottleneck.cpuLoadPercent < 100 && sweetResult.bottleneck.cpuLoadPercent > 0, `${sweetResult.bottleneck.cpuLoadPercent}%`);

const vram12 = vramBudget(12, '1440p');
const vram8 = vramBudget(8, '1440p');
const vram6 = vramBudget(6, '1440p');
check('12 GB 1440p is clear', vram12.status === 'ok' && vram12.averageFactor === 1, vram12.status);
check('8 GB 1440p hits 1% lows only', vram8.status === 'tight' && vram8.averageFactor === 1, `${vram8.status} ×${vram8.averageFactor}`);
check('6 GB 1440p hits average FPS', vram6.status === 'critical' && vram6.averageFactor === 0.8, `${vram6.status} ×${vram6.averageFactor}`);

const card8 = estimatePerformance({ ...sweet, gpuId: 'rtx-3070' });
const card6 = estimatePerformance({ ...sweet, gpuId: 'rtx-2060' });
check('8 GB warning is lows', card8.warnings.some((warning) => warning.id === 'vram' && warning.messageKey === 'vramWarningLows'), card8.warnings.map((warning) => warning.messageKey).join(','));
check('6 GB warning is average', card6.warnings.some((warning) => warning.id === 'vram' && warning.messageKey === 'vramWarningAverage'), card6.warnings.map((warning) => warning.messageKey).join(','));
check('12 GB has no vram warning', !sweetResult.warnings.some((warning) => warning.id === 'vram'), sweetResult.warnings.map((warning) => warning.id).join(','));

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('estimator checks passed');
console.log(`default ${sweetResult.fps} FPS, 1% low ${sweetResult.low1Percent}, load CPU ${sweetResult.bottleneck.cpuLoadPercent}% GPU ${sweetResult.bottleneck.gpuLoadPercent}%`);
console.log(`weak presets ${weak.presets.low.fps}/${weak.presets.medium.fps}/${weak.presets.high.fps}/${weak.presets.ultra.fps}`);
console.log(`4K 4090 ${fps4090} vs 5090 ${fps5090}`);
