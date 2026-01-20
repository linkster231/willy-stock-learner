/**
 * User Menu Component
 *
 * Displays current user status in the header.
 * Shows login button when not logged in, or user avatar/name when logged in.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useUserStore } from '@/stores/useUserStore';
import { AuthModal } from './AuthModal';
import { cn } from '@/lib/utils';

export function UserMenu() {
  const t = useTranslations('auth');
  const { getCurrentUser, logout, getProgress } = useUserStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = getCurrentUser();
  const progress = getProgress();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // If not logged in, show login button
  if (!user) {
    return (
      <>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2',
            'bg-blue-600 text-white font-medium text-sm',
            'hover:bg-blue-700 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          )}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="hidden sm:inline">{t('login')}</span>
        </button>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  // Calculate progress stats
  const completedModules = progress?.completedModules.length || 0;
  const completedLessons = progress?.completedLessons.length || 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2',
          'bg-gray-100 hover:bg-gray-200 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        )}
      >
        {/* Avatar circle with initial */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline text-sm font-medium text-gray-700">
          {user.username}
        </span>
        {/* Dropdown arrow */}
        <svg
          className={cn(
            'h-4 w-4 text-gray-500 transition-transform',
            isDropdownOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className={cn(
          'absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg border border-gray-200',
          'animate-in fade-in slide-in-from-top-2 duration-150 z-50'
        )}>
          {/* User info section */}
          <div className="p-4 border-b border-gray-100">
            <p className="font-semibold text-gray-900">{user.username}</p>
            <p className="text-xs text-gray-500 mt-1">
              {t('memberSince', { date: new Date(user.createdAt).toLocaleDateString() })}
            </p>
          </div>

          {/* Progress stats */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">
              {t('yourProgress')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{completedModules}</p>
                <p className="text-xs text-gray-500">{t('modulesCompleted')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{completedLessons}</p>
                <p className="text-xs text-gray-500">{t('lessonsCompleted')}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={() => {
                logout();
                setIsDropdownOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
                'text-sm text-red-600 hover:bg-red-50 transition-colors'
              )}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {t('logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
