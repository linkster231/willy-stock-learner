/**
 * Modal Component
 *
 * A dialog/modal overlay for confirmations, forms, and alerts.
 * Handles focus trapping and escape key closing.
 */

'use client';

import { Fragment, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal description */
  description?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Show close button in header */
  showCloseButton?: boolean;
  /** Size of the modal */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Modal dialog component.
 *
 * @example
 * <Modal
 *   isOpen={showConfirm}
 *   onClose={() => setShowConfirm(false)}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure you want to proceed?</p>
 *   <div className="mt-4 flex gap-2">
 *     <Button onClick={handleConfirm}>Yes</Button>
 *     <Button variant="secondary" onClick={() => setShowConfirm(false)}>No</Button>
 *   </div>
 * </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  size = 'md',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap - focus the content when opened
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isOpen]);

  // Handle overlay click (close on click outside)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Size classes for the modal
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  if (!isOpen) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className={cn(
          'fixed inset-0 z-50',
          'flex items-center justify-center p-4',
          'bg-black/50 backdrop-blur-sm',
          // Animation
          'animate-in fade-in duration-200'
        )}
        aria-modal="true"
        role="dialog"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {/* Modal content */}
        <div
          ref={contentRef}
          tabIndex={-1}
          className={cn(
            'w-full rounded-xl bg-white shadow-xl',
            'animate-in zoom-in-95 duration-200',
            'max-h-[90vh] flex flex-col',
            sizeClasses[size]
          )}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between border-b border-gray-200 p-4 flex-shrink-0">
              <div>
                {title && (
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold text-gray-900"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id="modal-description"
                    className="mt-1 text-sm text-gray-500"
                  >
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={cn(
                    'ml-4 rounded-lg p-2 text-gray-400',
                    'hover:bg-gray-100 hover:text-gray-600',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500'
                  )}
                  aria-label="Close modal"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body - scrollable */}
          <div className="p-4 overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </Fragment>
  );
}

/**
 * Confirmation Modal - Pre-built modal for yes/no confirmations
 */
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={isDestructive ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
