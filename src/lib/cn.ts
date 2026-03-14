import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const MY_FONT = 'font-["Noto_Sans_Myanmar","Inter",sans-serif] leading-[1.55]';
