/**
 * Preset Manager Component
 *
 * Allows users to save, load, and manage calculator presets.
 * Provides a dropdown menu with preset options.
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import {
  useCalculatorStore,
  type CalculatorType,
  type CalculatorPreset,
} from '@/stores/useCalculatorStore';

// =============================================================================
// TYPES
// =============================================================================

interface PresetManagerProps {
  /** Calculator type */
  calculatorType: CalculatorType;
  /** Current input values */
  currentValues: Record<string, number | string>;
  /** Callback when a preset is loaded */
  onLoadPreset: (values: Record<string, number | string>) => void;
  /** Optional className */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PresetManager({
  calculatorType,
  currentValues,
  onLoadPreset,
  className,
}: PresetManagerProps) {
  const t = useTranslations('calculators');

  // Store state and actions
  const allPresets = useCalculatorStore((state) => state.presets);
  const savePreset = useCalculatorStore((state) => state.savePreset);
  const deletePreset = useCalculatorStore((state) => state.deletePreset);
  const setLastUsed = useCalculatorStore((state) => state.setLastUsed);

  // Local UI state only
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Filter presets for this calculator (derived from store)
  const presets = useMemo(
    () => allPresets.filter((p) => p.calculatorType === calculatorType),
    [allPresets, calculatorType]
  );

  // Separate built-in and user presets
  const builtInPresets = useMemo(() => presets.filter((p) => p.isBuiltIn), [presets]);
  const userPresets = useMemo(() => presets.filter((p) => !p.isBuiltIn), [presets]);

  // Handle save
  const handleSave = () => {
    if (presetName.trim()) {
      savePreset(presetName.trim(), calculatorType, currentValues);
      setPresetName('');
      setShowSaveForm(false);
    }
  };

  // Handle load
  const handleLoad = (preset: CalculatorPreset) => {
    onLoadPreset(preset.values);
    setLastUsed(calculatorType, preset.id);
    setIsOpen(false);
  };

  // Handle delete
  const handleDelete = (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation();
    deletePreset(presetId);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Toggle Button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <span>📋</span>
        {t('presets.title')}
        <span className={cn('transition-transform', isOpen && 'rotate-180')}>▼</span>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg">
            {/* Header */}
            <div className="border-b border-gray-100 p-3">
              <p className="text-sm font-medium text-gray-900">{t('presets.title')}</p>
              <p className="text-xs text-gray-500">{t('presets.description')}</p>
            </div>

            {/* Built-in Presets */}
            {builtInPresets.length > 0 && (
              <div className="border-b border-gray-100 p-2">
                <p className="mb-1 px-2 text-xs font-medium text-gray-500">
                  {t('presets.examples')}
                </p>
                {builtInPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleLoad(preset)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-blue-500">★</span>
                    <span className="flex-1 truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* User Presets */}
            {userPresets.length > 0 && (
              <div className="border-b border-gray-100 p-2">
                <p className="mb-1 px-2 text-xs font-medium text-gray-500">
                  {t('presets.saved')}
                </p>
                {userPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleLoad(preset)}
                    className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-400">📄</span>
                    <span className="flex-1 truncate">{preset.name}</span>
                    <button
                      onClick={(e) => handleDelete(e, preset.id)}
                      className="hidden p-1 text-gray-400 hover:text-red-600 group-hover:block"
                      title={t('presets.delete')}
                    >
                      ✕
                    </button>
                  </button>
                ))}
              </div>
            )}

            {/* Save Form */}
            <div className="p-3">
              {showSaveForm ? (
                <div className="space-y-2">
                  <Input
                    placeholder={t('presets.namePlaceholder')}
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave();
                      if (e.key === 'Escape') setShowSaveForm(false);
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={!presetName.trim()}
                      className="flex-1"
                    >
                      {t('presets.save')}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowSaveForm(false);
                        setPresetName('');
                      }}
                    >
                      {t('presets.cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => setShowSaveForm(true)}
                  className="gap-2"
                >
                  <span>💾</span>
                  {t('presets.saveCurrent')}
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PresetManager;
