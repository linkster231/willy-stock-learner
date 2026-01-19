'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-4 text-6xl">😕</div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Something went wrong
        </h2>
        <p className="mb-6 text-gray-600">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
