/**
 * Utility Functions
 *
 * Common helper functions used throughout the app.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind CSS merge.
 * Use this instead of plain clsx to handle Tailwind class conflicts.
 *
 * @example
 * cn('px-4 py-2', 'px-6') // Returns 'py-2 px-6' (px-6 wins)
 * cn('text-red-500', isActive && 'text-blue-500')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as US currency.
 *
 * @example
 * formatCurrency(1234.56) // Returns "$1,234.56"
 * formatCurrency(-500) // Returns "-$500.00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a number as a percentage.
 *
 * @example
 * formatPercent(0.0825) // Returns "8.25%"
 * formatPercent(-0.05) // Returns "-5.00%"
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a large number with abbreviations (K, M, B).
 *
 * @example
 * formatCompactNumber(1500) // Returns "1.5K"
 * formatCompactNumber(2500000) // Returns "2.5M"
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Formats a number with commas for readability.
 *
 * @example
 * formatNumber(1234567.89) // Returns "1,234,567.89"
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Delays execution for a specified number of milliseconds.
 * Useful for simulating loading states in development.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clamps a number between a minimum and maximum value.
 *
 * @example
 * clamp(150, 0, 100) // Returns 100
 * clamp(-10, 0, 100) // Returns 0
 * clamp(50, 0, 100) // Returns 50
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @example
 * roundTo(3.14159, 2) // Returns 3.14
 * roundTo(3.145, 2) // Returns 3.15
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Checks if a string is a valid email address.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generates a unique ID (not cryptographically secure, for UI purposes only).
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Debounces a function to prevent it from being called too frequently.
 * Useful for search inputs and other rapid user interactions.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

/**
 * Creates a URL-friendly slug from a string.
 *
 * @example
 * slugify("Hello World!") // Returns "hello-world"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .trim();
}
