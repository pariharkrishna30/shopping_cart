export function BrandLogo({ name = 'eshopping' }) {
  const initials = name
    .split(' ')
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2)

  return (
    <div className="brand-logo" aria-label={`${name} logo`} role="img">
      <svg className="brand-svg" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="brandGradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6b35" />
            <stop offset="45%" stopColor="#ffb703" />
            <stop offset="100%" stopColor="#1d3557" />
          </linearGradient>
        </defs>
        <rect fill="#0f172a" height="88" rx="28" width="88" />
        <path
          d="M19 59C32 35 51 28 70 24C60 39 52 52 33 66C27 70 18 67 19 59Z"
          fill="url(#brandGradient)"
          opacity="0.96"
        />
        <circle cx="63" cy="27" fill="#fff" opacity="0.9" r="6" />
        <text
          dominantBaseline="middle"
          fill="#ffffff"
          fontFamily="Georgia, serif"
          fontSize="22"
          fontWeight="700"
          textAnchor="middle"
          x="34"
          y="31"
        >
          {initials}
        </text>
      </svg>
    </div>
  )
}
