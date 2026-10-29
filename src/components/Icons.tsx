import React from 'react';

/** Small, consistent utility icons from the design system */
export const paths = {
  chevronDown: 'm6 9 6 6 6-6',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
  image: 'rect:3,3,18,18,2;circle:8,8,1.5;path:m3 17 6-6 4 4 3-3 5 5',
  expand: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6',
  compact: 'M3 9h6V3m6 0v6h6M9 21v-6H3m12 6v-6h6M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6',
  hideTray: 'rect:3,3,18,18,2;path:M3 14h18m-12 3 3 2 3-2',
  showTray: 'rect:3,3,18,18,2;path:M3 14h18m-12-4 3-3 3 3',
  next: 'M5 12h14m-6-6 6 6-6 6',
  mark: 'M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5M8 12h8m-4-4v8',
  close: 'm6 6 12 12M6 18 18 6',
  undo: 'M4 10h9a6 6 0 0 1 0 12M4 10l5-5m-5 5 5 5',
  external: 'M14 3h7v7m0-7L10 14m0-10H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-5',
  zoom: 'circle:10.5,10.5,6.5;path:m16 16 5 5',
  check: 'M20 6 9 17l-5-5',
  copy: 'rect:8,8,12,12,2;path:M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2',
  terminal: 'm4 17 6-6-6-6m8 14h8',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3',
  alert: 'M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
  trash: 'M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2',
  arrowRight: 'M5 12h14m-7-7 7 7-7 7',
  github: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
} as const;

export type IconName = keyof typeof paths;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 16, className = '', ...props }: IconProps) {
  const d = paths[name];

  if (name === 'github') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className={`shrink-0 ${className}`}
        {...props}
      >
        <path fillRule="evenodd" clipRule="evenodd" d={d} />
      </svg>
    );
  }

  if (d.includes(';')) {
    const parts = d.split(';');
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={`shrink-0 ${className}`}
        {...props}
      >
        {parts.map((p, idx) => {
          if (p.startsWith('rect:')) {
            const [x, y, w, h, rx] = p.slice(5).split(',').map(Number);
            return <rect key={idx} x={x} y={y} width={w} height={h} rx={rx} />;
          }
          if (p.startsWith('circle:')) {
            const [cx, cy, r] = p.slice(7).split(',').map(Number);
            return <circle key={idx} cx={cx} cy={cy} r={r} />;
          }
          if (p.startsWith('path:')) {
            return <path key={idx} d={p.slice(5)} />;
          }
          return null;
        })}
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d={d} />
    </svg>
  );
}
