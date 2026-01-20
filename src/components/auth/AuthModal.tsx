/**
 * Auth Modal Component
 *
 * Modal for login and signup with username + 4-digit PIN.
 * Simple, kid-friendly authentication.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/stores/useUserStore';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthMode = 'login' | 'signup';

/**
 * PIN input component with 4 separate boxes
 */
function PinInput({
  value,
  onChange,
  error,
  label,
}: {
  value: string;
  onChange: (pin: string) => void;
  error?: string;
  label?: string;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    // Only allow digits
    if (digit && !/^\d$/.test(digit)) return;

    // Build new PIN
    const newPin = value.split('');
    newPin[index] = digit;
    const pinString = newPin.join('').slice(0, 4);
    onChange(pinString);

    // Auto-focus next input
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace - go to previous input
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    onChange(pasted);
    // Focus last filled input or last input
    const focusIndex = Math.min(pasted.length, 3);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex justify-center gap-3">
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              'h-14 w-14 rounded-lg border-2 text-center text-2xl font-bold',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              !error && 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
            aria-label={`PIN digit ${index + 1}`}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const t = useTranslations('auth');
  const { createUser, login } = useUserStore();

  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPin('');
      setConfirmPin('');
      setError('');
      setMode('login');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Validate confirm PIN
        if (pin !== confirmPin) {
          setError(t('pinMismatch'));
          setIsLoading(false);
          return;
        }

        const result = createUser(username, pin);
        if (result.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(result.error || t('signupFailed'));
        }
      } else {
        const result = login(username, pin);
        if (result.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(result.error || t('loginFailed'));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setPin('');
    setConfirmPin('');
  };

  const isSubmitDisabled =
    !username.trim() ||
    pin.length !== 4 ||
    (mode === 'signup' && confirmPin.length !== 4);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? t('loginTitle') : t('signupTitle')}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <Input
          label={t('username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t('usernamePlaceholder')}
          maxLength={20}
          autoComplete="username"
          autoFocus
        />

        {/* PIN */}
        <PinInput
          label={t('pin')}
          value={pin}
          onChange={setPin}
        />

        {/* Confirm PIN (signup only) */}
        {mode === 'signup' && (
          <PinInput
            label={t('confirmPin')}
            value={confirmPin}
            onChange={setConfirmPin}
            error={pin.length === 4 && confirmPin.length === 4 && pin !== confirmPin ? t('pinMismatch') : undefined}
          />
        )}

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitDisabled}
          isLoading={isLoading}
        >
          {mode === 'login' ? t('loginButton') : t('signupButton')}
        </Button>

        {/* Switch mode link */}
        <div className="text-center text-sm text-gray-600">
          {mode === 'login' ? t('noAccount') : t('hasAccount')}{' '}
          <button
            type="button"
            onClick={switchMode}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            {mode === 'login' ? t('signupLink') : t('loginLink')}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AuthModal;
