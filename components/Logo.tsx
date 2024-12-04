export function Logo() {
    return (
      <svg viewBox="0 0 100 100" className="h-8 w-8">
        <circle cx="50" cy="50" r="45" fill="url(#gradient)" />
        <path
          d="M35 65V35L65 50L35 65Z"
          fill="white"
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#d946ef" />
          </defs>
      </svg>
    );
  }