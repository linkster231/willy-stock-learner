/**
 * Language Toggle Component
 *
 * Allows users to switch between English and Spanish.
 * Uses next-intl for locale switching.
 */

'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  /** Optional class name for custom styling */
  className?: string;
}

/**
 * Language toggle button that switches between English and Spanish.
 * Shows flag icons for easy visual recognition.
 *
 * @example
 * <LanguageToggle />
 */
export function LanguageToggle({ className }: LanguageToggleProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Handle language switch
  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'es' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2',
        'text-sm font-medium text-gray-700',
        'hover:bg-gray-100 active:bg-gray-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        'transition-colors',
        className
      )}
      aria-label={`Switch to ${locale === 'en' ? 'Spanish' : 'English'}`}
    >
      {/* Current language flag and label */}
      <span className="text-lg" aria-hidden="true">
        {locale === 'en' ? '🇺🇸' : '🇩🇴'}
      </span>
      <span className="hidden sm:inline">
        {locale === 'en' ? 'EN' : 'ES'}
      </span>

      {/* Switch indicator */}
      <svg
        className="h-4 w-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    </button>
  );
}

/**
 * Compact language toggle for mobile navigation.
 * Shows only the flag icon.
 */
export function LanguageToggleCompact({ className }: LanguageToggleProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'es' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full',
        'text-xl',
        'hover:bg-gray-100 active:bg-gray-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      aria-label={`Switch to ${locale === 'en' ? 'Spanish' : 'English'}`}
    >
      {locale === 'en' ? '🇺🇸' : '🇩🇴'}
    </button>
  );
}
