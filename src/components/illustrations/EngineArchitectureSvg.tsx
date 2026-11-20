export function EngineArchitectureSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto ${className}`}
      aria-label="Vice City Engine 9.0 Rendering and Streaming Pipeline"
      role="img"
    >
      <rect width="800" height="360" rx="12" fill="#11131D" stroke="rgba(255,255,255,0.08)" />

      {/* Grid Background Pattern */}
      <defs>
        <pattern id="arch-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </pattern>
        <linearGradient id="teal-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00E5C3" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <rect width="800" height="360" rx="12" fill="url(#arch-grid)" />

      {/* Step 1: Storage / DirectStorage 1.2 */}
      <g transform="translate(40, 60)">
        <rect width="180" height="240" rx="8" fill="#181B29" stroke="rgba(0,229,195,0.3)" strokeWidth="1.5" />
        <rect x="16" y="20" width="32" height="32" rx="6" fill="rgba(0,229,195,0.15)" />
        <path d="M 26 36 L 38 36 M 26 42 L 34 42" stroke="#00E5C3" strokeWidth="2" strokeLinecap="round" />
        <text x="56" y="36" fill="#F4F6FB" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
          NVMe Gen4 SSD
        </text>
        <text x="56" y="52" fill="#949AB1" fontSize="10" fontFamily="monospace">
          DirectStorage 1.2
        </text>

        <rect x="16" y="76" width="148" height="36" rx="4" fill="#11131D" stroke="rgba(255,255,255,0.06)" />
        <text x="24" y="94" fill="#F4F6FB" fontSize="11" fontFamily="sans-serif">Bypass System RAM</text>
        <text x="24" y="106" fill="#00E5C3" fontSize="9" fontFamily="monospace">GPU Decompression</text>

        <rect x="16" y="124" width="148" height="96" rx="4" fill="#11131D" stroke="rgba(255,255,255,0.06)" />
        <text x="24" y="144" fill="#949AB1" fontSize="10" fontFamily="sans-serif">Asset Streaming:</text>
        <text x="24" y="162" fill="#F4F6FB" fontSize="11" fontFamily="sans-serif">• 4K High-Res Textures</text>
        <text x="24" y="180" fill="#F4F6FB" fontSize="11" fontFamily="sans-serif">• Volumetric Meshes</text>
        <text x="24" y="198" fill="#F4F6FB" fontSize="11" fontFamily="sans-serif">• Audio &amp; NPC Logic</text>
      </g>

      {/* Arrow 1 -> 2 */}
      <path d="M 230 180 L 290 180" stroke="#00E5C3" strokeWidth="2" strokeDasharray="4 4" />
      <polygon points="296,180 288,175 288,185" fill="#00E5C3" />

      {/* Step 2: CPU Open World Simulation */}
      <g transform="translate(310, 60)">
        <rect width="200" height="240" rx="8" fill="#181B29" stroke="rgba(56,189,248,0.3)" strokeWidth="1.5" />
        <rect x="16" y="20" width="32" height="32" rx="6" fill="rgba(56,189,248,0.15)" />
        <circle cx="32" cy="36" r="6" stroke="#38BDF8" strokeWidth="2" />
        <text x="56" y="36" fill="#F4F6FB" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
          CPU Crowd Engine
        </text>
        <text x="56" y="52" fill="#949AB1" fontSize="10" fontFamily="monospace">
          8-16 Threads Parallel
        </text>

        {/* 3D V-Cache Highlight Box */}
        <rect x="16" y="76" width="168" height="50" rx="4" fill="#11131D" stroke="rgba(0,229,195,0.4)" />
        <text x="24" y="96" fill="#00E5C3" fontSize="11" fontWeight="bold" fontFamily="monospace">
          ★ 3D V-Cache L3 Pool
        </text>
        <text x="24" y="114" fill="#949AB1" fontSize="10" fontFamily="sans-serif">
          +18% NPC Pathfinding Boost
        </text>

        <rect x="16" y="136" width="168" height="84" rx="4" fill="#11131D" stroke="rgba(255,255,255,0.06)" />
        <text x="24" y="156" fill="#F4F6FB" fontSize="11" fontFamily="sans-serif">Physics &amp; Traffic AI</text>
        <text x="24" y="174" fill="#F4F6FB" fontSize="11" fontFamily="sans-serif">BVH Hierarchy Build</text>
        <text x="24" y="192" fill="#38BDF8" fontSize="10" fontFamily="monospace">Draw Calls Dispatch</text>
      </g>

      {/* Arrow 2 -> 3 */}
      <path d="M 520 180 L 570 180" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 4" />
      <polygon points="576,180 568,175 568,185" fill="#38BDF8" />

      {/* Step 3: GPU Rasterization & Ray Tracing */}
      <g transform="translate(585, 60)">
        <rect width="180" height="240" rx="8" fill="#181B29" stroke="rgba(255,77,141,0.3)" strokeWidth="1.5" />
        <rect x="16" y="20" width="32" height="32" rx="6" fill="rgba(255,77,141,0.15)" />
        <rect x="24" y="28" width="16" height="16" stroke="#FF4D8D" strokeWidth="2" />
        <text x="56" y="36" fill="#F4F6FB" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
          GPU RT Pipeline
        </text>
        <text x="56" y="52" fill="#949AB1" fontSize="10" fontFamily="monospace">
          RTGI &amp; RTAO Bounces
        </text>

        <rect x="16" y="76" width="148" height="60" rx="4" fill="#11131D" stroke="rgba(255,255,255,0.06)" />
        <text x="24" y="96" fill="#F4F6FB" fontSize="11" fontFamily="sans-serif">Hardware Ray Tracing:</text>
        <text x="24" y="112" fill="#FF4D8D" fontSize="10" fontFamily="monospace">• RT Global Illumination</text>
        <text x="24" y="126" fill="#FF9E44" fontSize="10" fontFamily="monospace">• Water &amp; Neon Reflections</text>

        <rect x="16" y="146" width="148" height="74" rx="4" fill="#11131D" stroke="rgba(0,229,195,0.2)" />
        <text x="24" y="166" fill="#00E5C3" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
          Frame Output
        </text>
        <text x="24" y="184" fill="#F4F6FB" fontSize="11" fontFamily="sans-serif">
          DLSS 4 / FSR 3.1
        </text>
        <text x="24" y="202" fill="#949AB1" fontSize="10" fontFamily="monospace">
          Stable 60–120 FPS
        </text>
      </g>
    </svg>
  );
}
