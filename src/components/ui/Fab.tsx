import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface FabProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  active?: boolean;
}

export default function Fab({ active = false, className, children, ...props }: FabProps) {
  return (
    <button
      type="button"
      className={[
        'fab',
        active ? 'fab-active' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
