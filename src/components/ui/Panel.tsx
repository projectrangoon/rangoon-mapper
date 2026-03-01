import type { PropsWithChildren } from 'react';

interface PanelProps extends PropsWithChildren {
  className?: string;
}

export default function Panel({ className, children }: PanelProps) {
  return <section className={["panel", className].filter(Boolean).join(' ')}>{children}</section>;
}
