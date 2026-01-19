/**
 * Learn Page
 *
 * Shows all learning modules with progress tracking.
 * Modules unlock progressively as previous ones are completed.
 */

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

/**
 * Module data - will be replaced with actual content imports
 */
const modules = [
  { id: '1', icon: '📈', color: 'blue' },
  { id: '2', icon: '🚀', color: 'green' },
  { id: '3', icon: '⚠️', color: 'yellow' },
  { id: '4', icon: '🧠', color: 'purple' },
  { id: '5', icon: '🕵️', color: 'red' },
  { id: '6', icon: '🏛️', color: 'indigo' },
  { id: '7', icon: '💰', color: 'emerald' },
  { id: '8', icon: '📱', color: 'teal' },
];

// Simulated progress (will come from Supabase later)
const userProgress: Record<string, { completed: boolean; quizPassed: boolean; progress: number }> = {
  '1': { completed: false, quizPassed: false, progress: 0 },
  '2': { completed: false, quizPassed: false, progress: 0 },
  '3': { completed: false, quizPassed: false, progress: 0 },
  '4': { completed: false, quizPassed: false, progress: 0 },
  '5': { completed: false, quizPassed: false, progress: 0 },
  '6': { completed: false, quizPassed: false, progress: 0 },
  '7': { completed: false, quizPassed: false, progress: 0 },
  '8': { completed: false, quizPassed: false, progress: 0 },
};

export default function LearnPage() {
  const t = useTranslations('learn');

  // Check if a module is locked (previous module not completed)
  const isLocked = (moduleId: string): boolean => {
    const id = parseInt(moduleId, 10);
    if (id === 1) return false; // First module always unlocked
    const prevId = String(id - 1);
    return !userProgress[prevId]?.quizPassed;
  };

  const getColorClasses = (color: string, locked: boolean) => {
    if (locked) {
      return 'bg-gray-100 border-gray-200 opacity-60';
    }
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200 hover:border-blue-300',
      green: 'bg-green-50 border-green-200 hover:border-green-300',
      yellow: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300',
      purple: 'bg-purple-50 border-purple-200 hover:border-purple-300',
      red: 'bg-red-50 border-red-200 hover:border-red-300',
      indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300',
      emerald: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300',
      teal: 'bg-teal-50 border-teal-200 hover:border-teal-300',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="p-6">
          <h2 className="mb-2 text-lg font-semibold">{t('progress')}</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 overflow-hidden rounded-full bg-blue-400">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: '0%' }}
                />
              </div>
            </div>
            <span className="text-sm font-medium">0/8</span>
          </div>
          <p className="mt-2 text-sm text-blue-100">{t('passScore')}</p>
        </div>
      </Card>

      {/* Modules Grid */}
      <div className="space-y-4">
        {modules.map((module) => {
          const locked = isLocked(module.id);
          const progress = userProgress[module.id];

          return (
            <div key={module.id}>
              {locked ? (
                <Card
                  className={cn(
                    'border-2 cursor-not-allowed',
                    getColorClasses(module.color, locked)
                  )}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-2xl">
                      🔒
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-500">
                        {t(`modules.${module.id}.title`)}
                      </h3>
                      <p className="text-sm text-gray-400">{t('locked')}</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Link href={`/learn/${module.id}`}>
                  <Card
                    className={cn(
                      'border-2 transition-all hover:shadow-md',
                      getColorClasses(module.color, locked)
                    )}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-lg text-2xl',
                          `bg-${module.color}-100`
                        )}
                      >
                        {module.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {t(`modules.${module.id}.title`)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {t(`modules.${module.id}.description`)}
                        </p>
                        {progress?.progress > 0 && (
                          <div className="mt-2">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full bg-blue-500"
                                style={{ width: `${progress.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-gray-400">
                        {progress?.completed ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span>→</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
