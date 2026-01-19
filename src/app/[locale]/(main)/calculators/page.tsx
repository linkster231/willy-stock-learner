/**
 * Calculators Index Page
 *
 * Lists all available financial calculators with descriptions.
 */

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

/**
 * Calculator card data
 */
const calculators = [
  {
    href: '/calculators/portfolio',
    key: 'portfolio',
    icon: '📊',
    color: 'bg-gradient-to-br from-blue-50 to-green-50 border-blue-300 hover:border-blue-400',
    featured: true,
  },
  {
    href: '/calculators/compound-interest',
    key: 'compoundInterest',
    icon: '📈',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
  },
  {
    href: '/calculators/profit-loss',
    key: 'profitLoss',
    icon: '💰',
    color: 'bg-green-50 border-green-200 hover:border-green-300',
  },
  {
    href: '/calculators/tax',
    key: 'tax',
    icon: '🧾',
    color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300',
  },
  {
    href: '/calculators/dividend',
    key: 'dividend',
    icon: '💵',
    color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300',
  },
  {
    href: '/calculators/dca',
    key: 'dca',
    icon: '📊',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-300',
  },
  {
    href: '/calculators/position-size',
    key: 'positionSize',
    icon: '🎯',
    color: 'bg-red-50 border-red-200 hover:border-red-300',
  },
  {
    href: '/calculators/rule-72',
    key: 'rule72',
    icon: '⏱️',
    color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300',
  },
  {
    href: '/calculators/future-value',
    key: 'futureValue',
    icon: '🔮',
    color: 'bg-pink-50 border-pink-200 hover:border-pink-300',
  },
];

export default function CalculatorsPage() {
  const t = useTranslations('calculators');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-2 text-lg text-gray-600">{t('description')}</p>
      </div>

      {/* Calculator Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {calculators.map((calc) => (
          <Link key={calc.key} href={calc.href} className="block">
            <Card
              className={`h-full border-2 transition-all hover:shadow-md ${calc.color}`}
            >
              <CardHeader>
                <div className="mb-3 text-4xl">{calc.icon}</div>
                <CardTitle className="text-lg">{t(`${calc.key}.title`)}</CardTitle>
                <CardDescription className="text-sm">
                  {t(`${calc.key}.description`)}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Tips Section */}
      <div className="mt-12">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="p-6">
            <h2 className="mb-3 text-xl font-semibold">💡 Calculator Tips</h2>
            <ul className="space-y-2 text-blue-100">
              <li>
                • <strong>Compound Interest:</strong> See how your money grows
                exponentially over time
              </li>
              <li>
                • <strong>Position Size:</strong> Never risk more than 2% of your
                account on a single trade
              </li>
              <li>
                • <strong>Rule of 72:</strong> Quick way to estimate how long to
                double your money
              </li>
              <li>
                • <strong>Tax Calculator:</strong> Remember, NJ taxes all gains as
                ordinary income!
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
