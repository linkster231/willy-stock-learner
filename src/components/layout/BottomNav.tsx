/**
 * Bottom Navigation Component
 *
 * Mobile-friendly navigation bar fixed at the bottom of the screen.
 * Shows icons and labels for main app sections.
 * Only visible on mobile/tablet (hidden on desktop where Header nav is used).
 */

'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * Navigation item configuration
 */
interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Bottom navigation bar for mobile devices.
 * Fixed to bottom of screen with 5 main navigation items.
 */
export function BottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  // Navigation items matching the header
  const navItems: NavItem[] = [
    { href: '/', labelKey: 'home', icon: HomeIcon },
    { href: '/learn', labelKey: 'learn', icon: BookIcon },
    { href: '/calculators', labelKey: 'calculators', icon: CalculatorIcon },
    { href: '/paper-trading', labelKey: 'trading', icon: ChartIcon },
    { href: '/glossary', labelKey: 'glossary', icon: BookmarkIcon },
  ];

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'border-t border-gray-200 bg-white',
        'md:hidden', // Hide on desktop
        'safe-area-inset-bottom' // Handle notch/home indicator
      )}
    >
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center',
                'min-h-[48px] min-w-[48px] px-2 py-1', // 48px touch target
                'rounded-lg transition-colors',
                active
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <item.icon
                className={cn(
                  'h-6 w-6',
                  active ? 'text-blue-600' : 'text-gray-500'
                )}
              />
              <span
                className={cn(
                  'mt-1 text-xs',
                  active ? 'font-medium' : 'font-normal'
                )}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Icon components (matching Header icons for consistency)
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
      />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
  );
}
