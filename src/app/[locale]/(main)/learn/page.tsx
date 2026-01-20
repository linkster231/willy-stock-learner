/**
 * Learn Page
 *
 * Shows all learning modules with progress tracking.
 * Modules unlock progressively as previous ones are completed.
 */

'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/Card';
import { modules } from '@/content/modules';
import { useUserStore } from '@/stores/useUserStore';
import { cn } from '@/lib/utils';

export default function LearnPage() {
  const t = useTranslations('learn');

  // User progress from store
  const { getCurrentUser, getProgress, isModuleCompleted, isQuizPassed } = useUserStore();
  const user = getCurrentUser();
  const userProgress = getProgress();

  // Calculate progress for each module
  const moduleProgress = useMemo(() => {
    const progress: Record<string, { lessonsCompleted: number; totalLessons: number; quizPassed: boolean; completed: boolean }> = {};

    modules.forEach((mod) => {
      const totalLessons = mod.lessons.length;
      const completedLessons = userProgress
        ? mod.lessons.filter((l) => userProgress.completedLessons.includes(l.id)).length
        : 0;
      const quizPassed = user ? isQuizPassed(mod.id) : false;
      const completed = user ? isModuleCompleted(mod.id) : false;

      progress[mod.id] = {
        lessonsCompleted: completedLessons,
        totalLessons,
        quizPassed,
        completed,
      };
    });

    return progress;
  }, [userProgress, user, isQuizPassed, isModuleCompleted]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const totalModules = modules.length;
    const completedModules = Object.values(moduleProgress).filter((p) => p.completed).length;
    return { completed: completedModules, total: totalModules };
  }, [moduleProgress]);

  // Check if a module is locked (all previous modules must be completed)
  const isLocked = (moduleIndex: number): boolean => {
    if (moduleIndex === 0) return false; // First module always unlocked
    // Check if previous module's quiz is passed
    const prevModule = modules[moduleIndex - 1];
    return !moduleProgress[prevModule.id]?.quizPassed;
  };

  // Color mapping for modules
  const colors = ['blue', 'green', 'purple', 'yellow', 'red', 'indigo', 'emerald', 'teal', 'cyan'];

  const getColorClasses = (index: number, locked: boolean) => {
    if (locked) {
      return 'bg-gray-100 border-gray-200 opacity-60';
    }
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200 hover:border-blue-300',
      green: 'bg-green-50 border-green-200 hover:border-green-300',
      purple: 'bg-purple-50 border-purple-200 hover:border-purple-300',
      yellow: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300',
      red: 'bg-red-50 border-red-200 hover:border-red-300',
      indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300',
      emerald: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300',
      teal: 'bg-teal-50 border-teal-200 hover:border-teal-300',
      cyan: 'bg-cyan-50 border-cyan-200 hover:border-cyan-300',
    };
    const color = colors[index % colors.length];
    return colorMap[color] || colorMap.blue;
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
                  style={{
                    width: `${(overallProgress.completed / overallProgress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-medium">
              {overallProgress.completed}/{overallProgress.total}
            </span>
          </div>
          <p className="mt-2 text-sm text-blue-100">
            {user ? t('passScore') : t('loginToSave')}
          </p>
        </div>
      </Card>

      {/* Modules Grid */}
      <div className="space-y-4">
        {modules.map((mod, index) => {
          const locked = isLocked(index);
          const progress = moduleProgress[mod.id];
          const progressPercent =
            progress.totalLessons > 0
              ? Math.round((progress.lessonsCompleted / progress.totalLessons) * 100)
              : 0;

          // Extract module number from ID for translation key
          const moduleNum = mod.id.replace('module-', '');

          return (
            <div key={mod.id}>
              {locked ? (
                <Card
                  className={cn(
                    'border-2 cursor-not-allowed',
                    getColorClasses(index, locked)
                  )}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-2xl">
                      🔒
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-500">
                        {t(`modules.${moduleNum}.title`)}
                      </h3>
                      <p className="text-sm text-gray-400">{t('locked')}</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Link href={`/learn/${moduleNum}`}>
                  <Card
                    className={cn(
                      'border-2 transition-all hover:shadow-md',
                      getColorClasses(index, locked),
                      progress.completed && 'ring-2 ring-green-300'
                    )}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-2xl shadow-sm">
                        {mod.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {t(`modules.${moduleNum}.title`)}
                          </h3>
                          {progress.completed && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                              ✓ {t('completed')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {t(`modules.${moduleNum}.description`)}
                        </p>
                        {progressPercent > 0 && !progress.completed && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className="h-full bg-blue-500 transition-all"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">
                                {progress.lessonsCompleted}/{progress.totalLessons}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-gray-400">
                        {progress.completed ? (
                          <span className="text-2xl text-green-500">✓</span>
                        ) : (
                          <span className="text-xl">→</span>
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

      {/* Final Review Link */}
      {overallProgress.completed === overallProgress.total && overallProgress.total > 0 && (
        <div className="mt-8">
          <Link href="/learn/final-review">
            <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-2xl">
                  🏆
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {t('finalReview.title')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('finalReview.subtitle')}
                  </p>
                </div>
                <span className="text-xl text-yellow-500">→</span>
              </div>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}
