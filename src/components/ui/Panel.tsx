import { cva } from 'class-variance-authority';
import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

interface PanelProps extends PropsWithChildren {
  className?: string;
}

const panelVariants = cva(
  'relative isolate mt-3 rounded-[22px] bg-[radial-gradient(circle_at_top_right,var(--halftone-dot)_0_1px,transparent_1px),linear-gradient(180deg,color-mix(in_srgb,var(--panel-bg)_94%,white_6%),var(--panel-bg))] bg-[length:14px_14px,auto] p-[1.1rem] backdrop-blur-[10px] shadow-[0_1px_0_color-mix(in_srgb,var(--ink)_8%,transparent)]',
);

export default function Panel({ className, children }: PanelProps) {
  return <section className={cn(panelVariants(), className)}>{children}</section>;
}
