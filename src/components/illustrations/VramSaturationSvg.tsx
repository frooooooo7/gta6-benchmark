export function VramSaturationSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 680 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto ${className}`}
      aria-label="VRAM Saturation Comparison: 8GB Warning vs 16GB Safe Buffer"
      role="img"
    >
      <rect width="680" height="260" rx="12" fill="#11131D" stroke="rgba(255,255,255,0.08)" />

      {/* 8GB Card - Saturated & Spilling */}
      <g transform="translate(30, 30)">
        <text x="0" y="20" fill="#F4F6FB" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
          8 GB VRAM Configuration (High 1440p / 4K)
        </text>
        <text x="0" y="38" fill="#FF9E44" fontSize="11" fontFamily="monospace">
          Status: Buffer Overflow &bull; Textures Paged to PCIe System RAM
        </text>

        {/* Progress bar container */}
        <rect x="0" y="52" width="620" height="32" rx="6" fill="#181B29" stroke="rgba(255,255,255,0.06)" />
        {/* Used VRAM (100% full) */}
        <rect x="0" y="52" width="560" height="32" rx="6" fill="#FF9E44" />
        {/* Spilling overflow into system RAM */}
        <rect x="560" y="52" width="60" height="32" rx="6" fill="#FF4D8D" />

        <text x="14" y="73" fill="#090A0F" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
          GTA 6 Ultra Geometry &amp; 4K Textures: 7.8 GB / 8.0 GB (98% Saturated)
        </text>
        <text x="500" y="73" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace">
          +2.1 GB SPILL
        </text>
      </g>

      {/* 16GB Card - Optimal Headroom */}
      <g transform="translate(30, 140)">
        <text x="0" y="20" fill="#F4F6FB" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
          16 GB VRAM Configuration (High 1440p / 4K)
        </text>
        <text x="0" y="38" fill="#00E5C3" fontSize="11" fontFamily="monospace">
          Status: Optimal Headroom &bull; Zero Texture Swapping &bull; 0ms Pacing
        </text>

        {/* Progress bar container */}
        <rect x="0" y="52" width="620" height="32" rx="6" fill="#181B29" stroke="rgba(255,255,255,0.06)" />
        {/* Used VRAM (62%) */}
        <rect x="0" y="52" width="380" height="32" rx="6" fill="#00E5C3" />

        <text x="14" y="73" fill="#090A0F" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
          Allocated Memory: 9.8 GB / 16.0 GB (61% Safe Buffer)
        </text>
        <text x="410" y="73" fill="#949AB1" fontSize="11" fontFamily="monospace">
          6.2 GB Clean Headroom Available
        </text>
      </g>
    </svg>
  );
}
