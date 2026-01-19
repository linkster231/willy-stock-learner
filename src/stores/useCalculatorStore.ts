/**
 * Calculator Presets Store
 *
 * Manages saved calculator presets for quick loading.
 * Persists to localStorage for offline access.
 *
 * Features:
 * - Save presets for any calculator type
 * - Load presets with one click
 * - Delete unwanted presets
 * - Built-in example presets
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Maximum user-created presets (built-in presets don't count)
const MAX_USER_PRESETS = 50;

// =============================================================================
// TYPES
// =============================================================================

/**
 * Calculator types that support presets
 */
export type CalculatorType =
  | 'compound-interest'
  | 'dca'
  | 'dividend'
  | 'future-value'
  | 'position-size'
  | 'profit-loss'
  | 'rule-72'
  | 'tax';

/**
 * A saved preset with calculator values
 */
export interface CalculatorPreset {
  /** Unique identifier */
  id: string;
  /** User-friendly name */
  name: string;
  /** Calculator type */
  calculatorType: CalculatorType;
  /** Saved input values */
  values: Record<string, number | string>;
  /** When this preset was created */
  createdAt: number;
  /** Whether this is a built-in example preset */
  isBuiltIn?: boolean;
}

/**
 * Store state
 */
interface CalculatorState {
  /** All saved presets */
  presets: CalculatorPreset[];
  /** Last used preset by calculator type */
  lastUsed: Record<CalculatorType, string | null>;
}

/**
 * Store actions
 */
interface CalculatorActions {
  /** Save a new preset (returns id or null if at limit) */
  savePreset: (
    name: string,
    calculatorType: CalculatorType,
    values: Record<string, number | string>
  ) => string | null;
  /** Delete a preset */
  deletePreset: (id: string) => void;
  /** Update a preset's values */
  updatePreset: (id: string, values: Record<string, number | string>) => void;
  /** Get presets for a specific calculator */
  getPresetsForCalculator: (calculatorType: CalculatorType) => CalculatorPreset[];
  /** Get a specific preset by ID */
  getPreset: (id: string) => CalculatorPreset | undefined;
  /** Mark a preset as last used */
  setLastUsed: (calculatorType: CalculatorType, presetId: string | null) => void;
  /** Get last used preset for a calculator */
  getLastUsed: (calculatorType: CalculatorType) => CalculatorPreset | undefined;
}

// =============================================================================
// BUILT-IN PRESETS
// =============================================================================

const BUILT_IN_PRESETS: CalculatorPreset[] = [
  // Compound Interest Examples
  {
    id: 'builtin-ci-college',
    name: 'College Fund (18 years)',
    calculatorType: 'compound-interest',
    values: {
      principal: 5000,
      rate: 7,
      years: 18,
      frequency: '12',
    },
    createdAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'builtin-ci-retirement',
    name: 'Retirement (30 years)',
    calculatorType: 'compound-interest',
    values: {
      principal: 10000,
      rate: 8,
      years: 30,
      frequency: '12',
    },
    createdAt: 0,
    isBuiltIn: true,
  },
  // DCA Examples
  {
    id: 'builtin-dca-weekly',
    name: 'Weekly $50',
    calculatorType: 'dca',
    values: {
      investmentAmount: 50,
      frequency: 'weekly',
      years: 5,
      expectedReturn: 8,
    },
    createdAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'builtin-dca-monthly',
    name: 'Monthly $200',
    calculatorType: 'dca',
    values: {
      investmentAmount: 200,
      frequency: 'monthly',
      years: 10,
      expectedReturn: 8,
    },
    createdAt: 0,
    isBuiltIn: true,
  },
  // Rule of 72 Examples
  {
    id: 'builtin-rule72-sp500',
    name: 'S&P 500 Average (10%)',
    calculatorType: 'rule-72',
    values: {
      rate: 10,
    },
    createdAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'builtin-rule72-savings',
    name: 'Savings Account (2%)',
    calculatorType: 'rule-72',
    values: {
      rate: 2,
    },
    createdAt: 0,
    isBuiltIn: true,
  },
  // Dividend Examples
  {
    id: 'builtin-div-income',
    name: 'Dividend Income',
    calculatorType: 'dividend',
    values: {
      investment: 10000,
      dividendYield: 3,
      reinvest: 'yes',
      years: 10,
    },
    createdAt: 0,
    isBuiltIn: true,
  },
  // Position Size Examples
  {
    id: 'builtin-pos-conservative',
    name: 'Conservative (1% risk)',
    calculatorType: 'position-size',
    values: {
      accountSize: 10000,
      riskPercent: 1,
      entryPrice: 50,
      stopLoss: 45,
    },
    createdAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'builtin-pos-moderate',
    name: 'Moderate (2% risk)',
    calculatorType: 'position-size',
    values: {
      accountSize: 10000,
      riskPercent: 2,
      entryPrice: 100,
      stopLoss: 90,
    },
    createdAt: 0,
    isBuiltIn: true,
  },
];

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `preset-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: CalculatorState = {
  presets: [...BUILT_IN_PRESETS],
  lastUsed: {
    'compound-interest': null,
    dca: null,
    dividend: null,
    'future-value': null,
    'position-size': null,
    'profit-loss': null,
    'rule-72': null,
    tax: null,
  },
};

// =============================================================================
// STORE
// =============================================================================

export const useCalculatorStore = create<CalculatorState & CalculatorActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      savePreset: (name, calculatorType, values) => {
        const state = get();
        const userPresets = state.presets.filter((p) => !p.isBuiltIn);

        if (userPresets.length >= MAX_USER_PRESETS) {
          return null; // At limit
        }

        const id = generateId();
        const preset: CalculatorPreset = {
          id,
          name,
          calculatorType,
          values,
          createdAt: Date.now(),
          isBuiltIn: false,
        };

        set((state) => ({
          presets: [...state.presets, preset],
          lastUsed: {
            ...state.lastUsed,
            [calculatorType]: id,
          },
        }));

        return id;
      },

      deletePreset: (id) => {
        set((state) => ({
          presets: state.presets.filter((p) => p.id !== id || p.isBuiltIn),
        }));
      },

      updatePreset: (id, values) => {
        set((state) => ({
          presets: state.presets.map((p) =>
            p.id === id && !p.isBuiltIn ? { ...p, values } : p
          ),
        }));
      },

      getPresetsForCalculator: (calculatorType) => {
        return get().presets.filter((p) => p.calculatorType === calculatorType);
      },

      getPreset: (id) => {
        return get().presets.find((p) => p.id === id);
      },

      setLastUsed: (calculatorType, presetId) => {
        set((state) => ({
          lastUsed: {
            ...state.lastUsed,
            [calculatorType]: presetId,
          },
        }));
      },

      getLastUsed: (calculatorType) => {
        const lastId = get().lastUsed[calculatorType];
        if (!lastId) return undefined;
        return get().presets.find((p) => p.id === lastId);
      },
    }),
    {
      name: 'willy-calculator-presets',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      // Merge built-in presets with saved presets
      merge: (persistedState, currentState) => {
        const persisted = persistedState as CalculatorState;
        const builtInIds = BUILT_IN_PRESETS.map((p) => p.id);

        // Filter out old built-in presets and add current ones
        const userPresets = persisted.presets?.filter(
          (p) => !p.isBuiltIn && !builtInIds.includes(p.id)
        ) || [];

        return {
          ...currentState,
          presets: [...BUILT_IN_PRESETS, ...userPresets],
          lastUsed: persisted.lastUsed || currentState.lastUsed,
        };
      },
    }
  )
);

// =============================================================================
// SELECTORS
// =============================================================================

/** Select all presets */
export const selectPresets = (state: CalculatorState) => state.presets;

/** Select preset count */
export const selectPresetCount = (state: CalculatorState) => state.presets.length;
