'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTradingStore } from '@/stores/useTradingStore';
import { useGlossaryStore } from '@/stores/useGlossaryStore';
import { formatCurrency } from '@/lib/utils';

const features = [
  {
    href: '/learn',
    titleKey: 'learn',
    descriptionKey: 'learnDescription',
    icon: '📚',
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
  },
  {
    href: '/calculators',
    titleKey: 'calculators',
    descriptionKey: 'calculatorsDescription',
    icon: '🧮',
    color: 'bg-green-50 border-green-200',
    iconBg: 'bg-green-100',
  },
  {
    href: '/paper-trading',
    titleKey: 'trading',
    descriptionKey: 'tradingDescription',
    icon: '📈',
    color: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-100',
  },
  {
    href: '/glossary',
    titleKey: 'glossary',
    descriptionKey: 'glossaryDescription',
    icon: '📖',
    color: 'bg-orange-50 border-orange-200',
    iconBg: 'bg-orange-100',
  },
];

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export default function HomePage() {
  const t = useTranslations('home');
  const navT = useTranslations('nav');

  // Hydration-safe way to detect client-side rendering
  const isLoaded = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Greeting is calculated on client only to avoid hydration mismatch
  const greeting = isLoaded ? getTimeGreeting() : '';

  const cash = useTradingStore((state) => state.cash);
  const positionsList = useTradingStore((state) => state.positionsList);

  const glossaryStats = useGlossaryStore((state) => state.getStats);
  const reviewStreak = useGlossaryStore((state) => state.reviewStreak);
  const longestStreak = useGlossaryStore((state) => state.longestStreak);
  const dueCount = useGlossaryStore((state) => state.getDueCount);

  const stats = isLoaded ? glossaryStats() : { totalWords: 0, mastered: 0, learning: 0, dueToday: 0, streak: 0 };
  const currentDueCount = isLoaded ? dueCount() : 0;

  const portfolioValue = isLoaded ? cash : 100000;
  const totalReturn = isLoaded ? cash - 100000 : 0;
  const returnPercent = isLoaded ? ((cash - 100000) / 100000) * 100 : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
          {greeting && t(`greeting.${greeting}`)} {t('welcome')}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          {t('subtitle')}
        </p>
      </section>

      {reviewStreak > 0 && isLoaded && (
        <section className="mb-6">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🔥</span>
                <div>
                  <p className="text-2xl font-bold">{reviewStreak} {t('streak.days')}</p>
                  <p className="text-sm text-orange-100">{t('streak.keepItUp')}</p>
                </div>
              </div>
              {longestStreak > reviewStreak && (
                <div className="text-right">
                  <p className="text-sm text-orange-100">{t('streak.best')}</p>
                  <p className="font-bold">{longestStreak} {t('streak.days')}</p>
                </div>
              )}
            </div>
          </Card>
        </section>
      )}

      <section className="mb-8">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">{t('yourProgress')}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold">0/8</div>
                <div className="text-sm text-blue-100">{t('modulesCompleted')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {isLoaded ? formatCurrency(portfolioValue) : '$100,000'}
                </div>
                <div className="text-sm text-blue-100">{t('portfolioValue')}</div>
                {isLoaded && totalReturn !== 0 && (
                  <div className={totalReturn >= 0 ? 'text-xs text-green-300' : 'text-xs text-red-300'}>
                    {totalReturn >= 0 ? '+' : ''}{returnPercent.toFixed(1)}%
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{isLoaded ? stats.totalWords : 0}</div>
                <div className="text-sm text-blue-100">{t('wordsLearned')}</div>
                {isLoaded && stats.mastered > 0 && (
                  <div className="text-xs text-green-300">{stats.mastered} {t('mastered')}</div>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{isLoaded ? positionsList.length : 0}</div>
                <div className="text-sm text-blue-100">{t('activePositions')}</div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {currentDueCount > 0 && isLoaded && (
        <section className="mb-6">
          <Card className="border-yellow-200 bg-yellow-50">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="font-medium text-yellow-800">
                    {currentDueCount} {t('wordsDue')}
                  </p>
                  <p className="text-sm text-yellow-600">{t('reviewPrompt')}</p>
                </div>
              </div>
              <Link href="/glossary/review">
                <Button size="sm">{t('reviewNow')}</Button>
              </Link>
            </div>
          </Card>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          {t('startLearning')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href} className="block">
              <Card
                className={`h-full border transition-shadow hover:shadow-md ${feature.color}`}
              >
                <CardHeader>
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${feature.iconBg}`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">
                    {navT(feature.titleKey)}
                  </CardTitle>
                  <CardDescription>
                    {t(feature.descriptionKey)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          {t('quickTips')}
        </h2>
        <Card>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <span className="text-gray-700">{t('tip1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📊</span>
                <span className="text-gray-700">{t('tip2')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🎯</span>
                <span className="text-gray-700">{t('tip3')}</span>
              </li>
            </ul>
          </div>
        </Card>
      </section>
    </div>
  );
}
