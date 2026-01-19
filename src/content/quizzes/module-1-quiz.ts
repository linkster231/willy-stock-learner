import { Quiz } from '@/types/content';

/**
 * Module 1 Quiz: Stock Market Basics
 *
 * Topics covered:
 * - What shares represent
 * - Stock market hours
 * - Basic market terminology
 * - Why companies go public
 */
export const module1Quiz: Quiz = {
  moduleId: 'module-1',
  questions: [
    {
      id: 'q1-1',
      questionKey: 'learn.quizzes.1.q1.question',
      options: [
        { id: 'a', labelKey: 'learn.quizzes.1.q1.optionA' },
        { id: 'b', labelKey: 'learn.quizzes.1.q1.optionB' },
        { id: 'c', labelKey: 'learn.quizzes.1.q1.optionC' },
        { id: 'd', labelKey: 'learn.quizzes.1.q1.optionD' },
      ],
      correctOptionId: 'b',
      explanationKey: 'learn.quizzes.1.q1.explanation',
    },
    {
      id: 'q1-2',
      questionKey: 'learn.quizzes.1.q2.question',
      options: [
        { id: 'a', labelKey: 'learn.quizzes.1.q2.optionA' },
        { id: 'b', labelKey: 'learn.quizzes.1.q2.optionB' },
        { id: 'c', labelKey: 'learn.quizzes.1.q2.optionC' },
        { id: 'd', labelKey: 'learn.quizzes.1.q2.optionD' },
      ],
      correctOptionId: 'c',
      explanationKey: 'learn.quizzes.1.q2.explanation',
    },
    {
      id: 'q1-3',
      questionKey: 'learn.quizzes.1.q3.question',
      options: [
        { id: 'a', labelKey: 'learn.quizzes.1.q3.optionA' },
        { id: 'b', labelKey: 'learn.quizzes.1.q3.optionB' },
        { id: 'c', labelKey: 'learn.quizzes.1.q3.optionC' },
        { id: 'd', labelKey: 'learn.quizzes.1.q3.optionD' },
      ],
      correctOptionId: 'a',
      explanationKey: 'learn.quizzes.1.q3.explanation',
    },
    {
      id: 'q1-4',
      questionKey: 'learn.quizzes.1.q4.question',
      options: [
        { id: 'a', labelKey: 'learn.quizzes.1.q4.optionA' },
        { id: 'b', labelKey: 'learn.quizzes.1.q4.optionB' },
        { id: 'c', labelKey: 'learn.quizzes.1.q4.optionC' },
        { id: 'd', labelKey: 'learn.quizzes.1.q4.optionD' },
      ],
      correctOptionId: 'd',
      explanationKey: 'learn.quizzes.1.q4.explanation',
    },
    {
      id: 'q1-5',
      questionKey: 'learn.quizzes.1.q5.question',
      options: [
        { id: 'a', labelKey: 'learn.quizzes.1.q5.optionA' },
        { id: 'b', labelKey: 'learn.quizzes.1.q5.optionB' },
        { id: 'c', labelKey: 'learn.quizzes.1.q5.optionC' },
        { id: 'd', labelKey: 'learn.quizzes.1.q5.optionD' },
      ],
      correctOptionId: 'b',
      explanationKey: 'learn.quizzes.1.q5.explanation',
    },
    {
      id: 'q1-6',
      questionKey: 'learn.quizzes.1.q6.question',
      options: [
        { id: 'a', labelKey: 'learn.quizzes.1.q6.optionA' },
        { id: 'b', labelKey: 'learn.quizzes.1.q6.optionB' },
        { id: 'c', labelKey: 'learn.quizzes.1.q6.optionC' },
        { id: 'd', labelKey: 'learn.quizzes.1.q6.optionD' },
      ],
      correctOptionId: 'c',
      explanationKey: 'learn.quizzes.1.q6.explanation',
    },
  ],
  passingScore: 80,
};
