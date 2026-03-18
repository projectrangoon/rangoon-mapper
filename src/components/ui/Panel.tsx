import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

interface PanelProps extends PropsWithChildren {
  className?: string;
}

const panelClass =
  'relative isolate rounded-[26px] bg-[radial-gradient(circle_at_top_right,var(--halftone-dot)_0_1px,transparent_1px),linear-gradient(180deg,var(--surface-float),var(--panel-bg))] bg-[length:14px_14px,auto] p-[1.1rem] backdrop-blur-[18px] shadow-[inset_0_1px_0_color-mix(in_srgb,white_12%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--ink)_7%,transparent),0_20px_50px_rgba(0,0,0,0.22)]';

export default function Panel({ className, children }: PanelProps) {
  return <section className={cn(panelClass, className)}>{children}</section>;
}
