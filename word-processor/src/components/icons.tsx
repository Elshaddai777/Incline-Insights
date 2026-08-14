import type { SVGProps } from "react";

function Svg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export const BoldIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M6 4h7a3.5 3.5 0 0 1 0 7H6z" />
    <path d="M6 11h8a3.5 3.5 0 0 1 0 7H6z" />
  </Svg>
);

export const ItalicIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M11 4h6M5 20h6M14 4 8 20" strokeLinecap="round" />
  </Svg>
);

export const UnderlineIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M6 3v7a6 6 0 0 0 12 0V3" />
    <path d="M4 21h16" />
  </Svg>
);

export const StrikeIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M5 12h14" />
    <path d="M16.5 7c-.6-1.6-2.1-2.5-4-2.5-2.4 0-4.2 1.2-4.2 3 0 1.6 1.2 2.3 3 2.7" />
    <path d="M8 17c.6 1.5 2.2 2.5 4.2 2.5 2.3 0 4.2-1 4.2-3 0-1.1-.6-1.9-1.8-2.4" />
  </Svg>
);

export const AlignLeftIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M4 6h16M4 12h10M4 18h13" />
  </Svg>
);

export const AlignCenterIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M4 6h16M7 12h10M5.5 18h13" />
  </Svg>
);

export const AlignRightIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M4 6h16M10 12h10M7 18h13" />
  </Svg>
);

export const AlignJustifyIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Svg>
);

export const BulletListIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <circle cx="5" cy="6" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="5" cy="18" r="1.2" fill="currentColor" stroke="none" />
    <path d="M9.5 6h10M9.5 12h10M9.5 18h10" />
  </Svg>
);

export const OrderedListIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M9.5 6h10M9.5 12h10M9.5 18h10" />
    <path d="M4.5 5v3M4.5 5h1M4.5 8h1" strokeWidth="1.4" />
    <path d="M4 15h1.5v1.5H4V15zM4 16.5h1.5V18H4v-1.5z" strokeWidth="1.2" />
  </Svg>
);

export const QuoteIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M7 7c-2 0-3.2 1.4-3.2 3.6 0 1.9 1.1 3 2.6 3 1.3 0 2.2-.9 2.2-2.2 0-1.1-.7-1.9-1.8-1.9h-.4C6.6 8 7.5 7 9 7" />
    <path d="M16 7c-2 0-3.2 1.4-3.2 3.6 0 1.9 1.1 3 2.6 3 1.3 0 2.2-.9 2.2-2.2 0-1.1-.7-1.9-1.8-1.9h-.4C15.6 8 16.5 7 18 7" />
  </Svg>
);

export const LinkIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M9.5 14.5 14.5 9.5" />
    <path d="M11 6.5 12.6 5A3.7 3.7 0 0 1 18 10.4L16.5 12" />
    <path d="M13 17.5 11.4 19A3.7 3.7 0 0 1 6 13.6L7.5 12" />
  </Svg>
);

export const ImageIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
    <circle cx="8.5" cy="10" r="1.4" />
    <path d="m5 17 4.5-4.5a1.5 1.5 0 0 1 2.1 0L15 16m2-2.5 1.5-1.5a1.5 1.5 0 0 1 2.1 0L21 13" />
  </Svg>
);

export const TableIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="1.2" />
    <path d="M3.5 10h17M3.5 15h17M10 4.5v15" />
  </Svg>
);

export const UndoIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M7 10H4V6" />
    <path d="M4.5 10.5A7.5 7.5 0 1 1 6 16" />
  </Svg>
);

export const RedoIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M17 10h3V6" />
    <path d="M19.5 10.5A7.5 7.5 0 1 0 18 16" />
  </Svg>
);

export const ChevronDownIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg width="12" height="12" {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const HighlightIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="m9 11 4 4" />
    <path d="M14.5 5.5 19 10l-7.5 7.5-6-1.5-1.5-6z" />
    <path d="M4 21h5" />
  </Svg>
);

export const ClearFormatIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}>
    <path d="M6 4h13M9.5 4l1.5 16M14.5 4 13 20M4 20h9" />
  </Svg>
);
