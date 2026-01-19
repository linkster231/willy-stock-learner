/**
 * Quiz Page
 *
 * Interactive quiz for testing knowledge after completing a module.
 * Tracks answers, shows feedback, and displays final score.
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, notFound } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { QuizQuestion, QuizResults, ProgressBar } from '@/components/learning';
import { getModuleById } from '@/content/modules';
import { getQuizByModuleId } from '@/content/quizzes';
import { cn } from '@/lib/utils';

interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>; // questionId -> selectedOptionId
  showingFeedback: boolean;
  isComplete: boolean;
}

export default function QuizPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const moduleId = `module-${params.moduleId}`;

  // Get module and quiz data
  const module = getModuleById(moduleId);
  const quiz = getQuizByModuleId(moduleId);

  if (!module || !quiz) {
    notFound();
  }

  // Quiz state
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    showingFeedback: false,
    isComplete: false,
  });

  // Current question
  const currentQuestion = quiz.questions[state.currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  // Calculate number of correct answers
  const correctAnswers = useMemo(() => {
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (state.answers[q.id] === q.correctOptionId) {
        correct++;
      }
    });
    return correct;
  }, [state.answers, quiz.questions]);

  // Calculate score percentage
  const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);

  // Check if passed
  const passed = scorePercent >= quiz.passingScore;

  // Handle answer selection
  const handleAnswer = (optionId: string) => {
    if (state.showingFeedback) return;

    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: optionId,
      },
      showingFeedback: true,
    }));
  };

  // Handle next question
  const handleNext = () => {
    if (state.currentQuestionIndex < totalQuestions - 1) {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showingFeedback: false,
      }));
    } else {
      // Quiz complete
      setState((prev) => ({
        ...prev,
        isComplete: true,
      }));
    }
  };

  // Restart quiz
  const handleRestart = () => {
    setState({
      currentQuestionIndex: 0,
      answers: {},
      showingFeedback: false,
      isComplete: false,
    });
  };

  // Show results
  if (state.isComplete) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Back Link */}
        <Link
          href={`/learn/${params.moduleId}`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          ← {t('common.back')}
        </Link>

        <QuizResults
          score={correctAnswers}
          totalQuestions={totalQuestions}
          passed={passed}
          onRetry={handleRestart}
          onContinue={() => {
            router.push('/learn');
          }}
        />
      </div>
    );
  }

  // Current answer state
  const selectedAnswer = state.answers[currentQuestion.id];
  const isCorrect = selectedAnswer === currentQuestion.correctOptionId;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      {/* Back Link */}
      <Link
        href={`/learn/${params.moduleId}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        ← {t('common.back')}
      </Link>

      {/* Quiz Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{module.icon}</span>
          <h1 className="text-xl font-bold text-gray-900">
            {t(module.titleKey)} - {t('learn.quiz.title')}
          </h1>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {t('learn.quiz.question')} {state.currentQuestionIndex + 1} / {totalQuestions}
            </span>
            <span className="text-gray-500">
              {t('learn.quiz.passScore')}: {quiz.passingScore}%
            </span>
          </div>
          <ProgressBar
            progress={((state.currentQuestionIndex + 1) / totalQuestions) * 100}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <div className="p-6">
          {/* Question */}
          <h2 className="mb-6 text-lg font-medium text-gray-900">
            {t(currentQuestion.questionKey)}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrectOption = option.id === currentQuestion.correctOptionId;
              const showCorrect = state.showingFeedback && isCorrectOption;
              const showWrong = state.showingFeedback && isSelected && !isCorrectOption;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleAnswer(option.id)}
                  disabled={state.showingFeedback}
                  className={cn(
                    'w-full rounded-lg border-2 p-4 text-left transition-all',
                    !state.showingFeedback &&
                      'hover:border-blue-300 hover:bg-blue-50',
                    isSelected && !state.showingFeedback && 'border-blue-500 bg-blue-50',
                    showCorrect && 'border-green-500 bg-green-50',
                    showWrong && 'border-red-500 bg-red-50',
                    state.showingFeedback && !showCorrect && !showWrong && 'opacity-60'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Option Letter */}
                    <span
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full font-semibold',
                        showCorrect && 'bg-green-500 text-white',
                        showWrong && 'bg-red-500 text-white',
                        !showCorrect && !showWrong && 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {showCorrect ? '✓' : showWrong ? '✗' : option.id.toUpperCase()}
                    </span>
                    {/* Option Text */}
                    <span
                      className={cn(
                        'font-medium',
                        showCorrect && 'text-green-700',
                        showWrong && 'text-red-700',
                        !showCorrect && !showWrong && 'text-gray-700'
                      )}
                    >
                      {t(option.labelKey)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {state.showingFeedback && (
            <div
              className={cn(
                'mt-6 rounded-lg p-4',
                isCorrect ? 'bg-green-50' : 'bg-amber-50'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">
                  {isCorrect ? '🎉' : '💡'}
                </span>
                <div>
                  <p
                    className={cn(
                      'font-semibold',
                      isCorrect ? 'text-green-700' : 'text-amber-700'
                    )}
                  >
                    {isCorrect ? t('learn.quiz.correct') : t('learn.quiz.incorrect')}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {t(currentQuestion.explanationKey)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Next Button */}
      {state.showingFeedback && (
        <Button variant="primary" fullWidth onClick={handleNext}>
          {state.currentQuestionIndex < totalQuestions - 1
            ? t('learn.quiz.next')
            : t('learn.quiz.seeResults')}
        </Button>
      )}

      {/* Tip */}
      {!state.showingFeedback && (
        <p className="mt-4 text-center text-sm text-gray-500">
          {t('learn.quiz.selectAnswer')}
        </p>
      )}
    </div>
  );
}
