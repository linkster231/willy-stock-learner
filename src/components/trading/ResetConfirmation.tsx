/**
 * Reset Confirmation Component
 *
 * A two-step confirmation flow for resetting the paper trading account.
 * Includes reset limit tracking and admin request functionality.
 *
 * Features:
 * - Step 1: Warning modal showing remaining resets
 * - Step 2: Final confirmation requiring explicit action
 * - Shows "Request Additional Reset" when limit reached
 * - Logs reset requests for admin review
 */

'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useTradingStore } from '@/stores/useTradingStore';

// =============================================================================
// TYPES
// =============================================================================

interface ResetConfirmationProps {
  /** Callback fired when reset is successfully completed */
  onResetComplete?: () => void;
  /** Additional CSS classes for the trigger button */
  className?: string;
}

type ResetStep = 'closed' | 'warning' | 'confirm' | 'no-resets' | 'request-sent';

// =============================================================================
// COMPONENT
// =============================================================================

export function ResetConfirmation({ onResetComplete, className }: ResetConfirmationProps) {
  const t = useTranslations('trading');

  // Store state and actions
  const resetPortfolio = useTradingStore((state) => state.resetPortfolio);
  const canReset = useTradingStore((state) => state.canReset);
  const getRemainingResets = useTradingStore((state) => state.getRemainingResets);
  const requestAdditionalReset = useTradingStore((state) => state.requestAdditionalReset);

  // Local state for the multi-step flow
  const [step, setStep] = useState<ResetStep>('closed');
  const [requestReason, setRequestReason] = useState('');

  // Get current reset info
  const remainingResets = getRemainingResets();
  const canResetNow = canReset();
  const isLastReset = remainingResets === 1;

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  /**
   * Open the reset flow - either warning or no-resets modal
   */
  const handleOpenReset = useCallback(() => {
    if (canResetNow) {
      setStep('warning');
    } else {
      setStep('no-resets');
    }
  }, [canResetNow]);

  /**
   * Close all modals and reset state
   */
  const handleClose = useCallback(() => {
    setStep('closed');
    setRequestReason('');
  }, []);

  /**
   * Move from warning to final confirmation step
   */
  const handleProceedToConfirm = useCallback(() => {
    setStep('confirm');
  }, []);

  /**
   * Execute the actual reset
   */
  const handleConfirmReset = useCallback(() => {
    const success = resetPortfolio();
    if (success) {
      handleClose();
      onResetComplete?.();
    }
  }, [resetPortfolio, handleClose, onResetComplete]);

  /**
   * Submit a request for additional resets
   */
  const handleRequestReset = useCallback(() => {
    requestAdditionalReset(requestReason || undefined);
    setStep('request-sent');
  }, [requestAdditionalReset, requestReason]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${className || ''}`}
        onClick={handleOpenReset}
      >
        🔄 {t('reset.button')}
        {canResetNow && (
          <span className="ml-2 text-xs text-gray-500">
            ({remainingResets} left)
          </span>
        )}
      </Button>

      {/* Step 1: Warning Modal */}
      <Modal
        isOpen={step === 'warning'}
        onClose={handleClose}
        title={t('reset.title')}
        size="sm"
      >
        <div className="space-y-4">
          {/* Warning message */}
          <p className="text-gray-600">{t('reset.confirm')}</p>

          {/* Remaining resets indicator */}
          <div
            className={`rounded-lg p-3 ${
              isLastReset
                ? 'bg-red-50 border border-red-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isLastReset ? 'text-red-700' : 'text-yellow-700'
              }`}
            >
              {isLastReset ? '⚠️ ' : ''}
              {remainingResets} {t('reset.remaining', { count: remainingResets })}
            </p>
            {isLastReset && (
              <p className="text-xs text-red-600 mt-1">{t('reset.lastReset')}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={handleClose}>
              {t('reset.cancel')}
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleProceedToConfirm}
            >
              {t('reset.continue')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Step 2: Final Confirmation Modal */}
      <Modal
        isOpen={step === 'confirm'}
        onClose={handleClose}
        title={t('reset.finalTitle')}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-center">{t('reset.finalWarning')}</p>

          {/* Large confirmation button */}
          <Button
            variant="danger"
            fullWidth
            size="lg"
            onClick={handleConfirmReset}
            className="py-4 text-base"
          >
            {t('reset.finalConfirm')}
          </Button>

          {/* Cancel link */}
          <button
            type="button"
            onClick={handleClose}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            {t('reset.cancel')}
          </button>
        </div>
      </Modal>

      {/* No Resets Available Modal */}
      <Modal
        isOpen={step === 'no-resets'}
        onClose={handleClose}
        title={t('reset.noResetsTitle')}
        size="sm"
      >
        <div className="space-y-4">
          {/* Exhausted message */}
          <div className="text-center">
            <div className="text-4xl mb-3">🚫</div>
            <p className="text-gray-600">{t('reset.noResetsLeft')}</p>
          </div>

          {/* Request additional reset form */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">
              {t('reset.requestTitle')}
            </p>
            <textarea
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder={t('reset.requestPlaceholder')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
            <Button
              variant="primary"
              fullWidth
              onClick={handleRequestReset}
            >
              {t('reset.requestButton')}
            </Button>
          </div>

          {/* Close button */}
          <Button variant="secondary" fullWidth onClick={handleClose}>
            {t('reset.close')}
          </Button>
        </div>
      </Modal>

      {/* Request Sent Confirmation Modal */}
      <Modal
        isOpen={step === 'request-sent'}
        onClose={handleClose}
        title={t('reset.requestSentTitle')}
        size="sm"
      >
        <div className="space-y-4 text-center">
          <div className="text-4xl">✅</div>
          <p className="text-gray-600">{t('reset.requestSentMessage')}</p>
          <Button variant="primary" fullWidth onClick={handleClose}>
            {t('reset.close')}
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default ResetConfirmation;
