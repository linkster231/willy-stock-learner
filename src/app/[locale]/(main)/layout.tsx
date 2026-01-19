/**
 * Main Section Layout
 *
 * Layout for authenticated/main app pages.
 * Includes navigation and consistent padding.
 */

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout wraps the main app content
  // The actual Header and BottomNav are in the locale layout
  return <>{children}</>;
}
