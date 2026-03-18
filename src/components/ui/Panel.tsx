import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

interface PanelProps extends PropsWithChildren {
  className?: string;
}

const panelClass =
  'relative isolate rounded-[28px] bg-[color:var(--panel-bg)] p-[1.1rem] backdrop-blur-[12px] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--ink)_8%,transparent)]';

export default function Panel({ className, children }: PanelProps) {
  return <section className={cn(panelClass, className)}>{children}</section>;
}
