import { GPUS_MAP } from './gpus';
import { CPUS_MAP } from './cpus';

export const POPULAR_GPU_IDS = [
  'rtx-4070-super',
  'rtx-4060',
  'rtx-4070',
  'rtx-3060-12gb',
  'rtx-3060-ti',
  'rtx-4080-super',
  'rtx-4090',
  'rx-6700-xt',
  'rx-7800-xt',
  'gtx-1660-super',
] as const;

export const POPULAR_CPU_IDS = [
  'ryzen-7-7800x3d',
  'ryzen-5-5600',
  'ryzen-5-7600x',
  'ryzen-7-5700x3d',
  'ryzen-7-9800x3d',
  'core-i5-12400f',
  'core-i5-13600k',
  'core-i5-14600k',
  'core-i7-14700k',
  'ryzen-7-3700x',
] as const;

export interface HardwarePair {
  slug: string;
  gpuId: string;
  cpuId: string;
}

/**
 * Generates the top 100 hardware combinations (10 popular GPUs x 10 popular CPUs).
 */
export function getTopHardwarePairs(): HardwarePair[] {
  const pairs: HardwarePair[] = [];

  for (const gpuId of POPULAR_GPU_IDS) {
    for (const cpuId of POPULAR_CPU_IDS) {
      pairs.push({
        slug: `${gpuId}-with-${cpuId}`,
        gpuId,
        cpuId,
      });
    }
  }

  return pairs;
}

export function parsePairSlug(slug: string): HardwarePair | null {
  const parts = slug.split('-with-');
  if (parts.length !== 2) return null;

  const [gpuId, cpuId] = parts;
  if (!GPUS_MAP[gpuId] || !CPUS_MAP[cpuId]) return null;

  return {
    slug,
    gpuId,
    cpuId,
  };
}
