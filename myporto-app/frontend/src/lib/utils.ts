import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null): string {
  if (!date) return 'Sekarang';
  return new Date(date).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

export function getPortfolioUrl(username: string): string {
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'myporto.id';
  return `https://${username}.${domain}`;
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const normalized = cleaned.startsWith('0') ? `62${cleaned.slice(1)}` : cleaned;
  const text = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${normalized}${text ? `?text=${text}` : ''}`;
}
