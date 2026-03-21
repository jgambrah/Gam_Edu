import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="logo-bg-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main Vibrant Container */}
      <rect width="100" height="100" rx="28" fill="url(#logo-bg-grad)" />
      
      {/* Decorative Geometric Background */}
      <path
        d="M20 20C20 14.4772 24.4772 10 30 10H70C75.5228 10 80 14.4772 80 20V80C80 85.5228 75.5228 90 70 90H30C24.4772 90 20 85.5228 20 80V20Z"
        fill="white"
        fillOpacity="0.05"
      />
      
      {/* Stylized Writing: GAM */}
      <text
        x="50"
        y="46"
        textAnchor="middle"
        fill="white"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '28px',
          fontWeight: '900',
          letterSpacing: '0.05em',
          filter: 'url(#logo-glow)'
        }}
      >
        GAM
      </text>
      
      {/* Stylized Writing: EDU with Amber Highlight */}
      <text
        x="50"
        y="76"
        textAnchor="middle"
        fill="#FBBF24"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '24px',
          fontWeight: '900',
          letterSpacing: '0.15em'
        }}
      >
        EDU
      </text>

      {/* Energy Sparkle */}
      <circle cx="82" cy="18" r="4" fill="#10B981" />
      <path d="M72 12L88 24" stroke="#10B981" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
