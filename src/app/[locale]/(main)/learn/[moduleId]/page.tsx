/**
 * Module Detail Page
 *
 * Shows all lessons within a module with progress tracking.
 * Allows users to complete lessons and access the quiz when done.
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { LessonCard, ProgressBar } from '@/components/learning';
import { getModuleById } from '@/content/modules';
import { hasQuiz } from '@/content/quizzes';
import { cn } from '@/lib/utils';

/**
 * Extract YouTube video ID from URL
 */
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/
  );
  return match ? match[1] : null;
}

export default function ModulePage() {
  const t = useTranslations();
  const params = useParams();
  const moduleId = `module-${params.moduleId}`;

  // Get module data
  const module = getModuleById(moduleId);

  if (!module) {
    notFound();
  }

  // Local state for progress (will be replaced with Supabase later)
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  // Calculate progress
  const progress = useMemo(() => {
    if (module.lessons.length === 0) return 0;
    return Math.round((completedLessons.length / module.lessons.length) * 100);
  }, [completedLessons, module.lessons.length]);

  // Check if all lessons completed
  const allLessonsCompleted = completedLessons.length === module.lessons.length;

  // Get current lesson
  const currentLesson = currentLessonId
    ? module.lessons.find((l) => l.id === currentLessonId)
    : null;

  // Handle marking lesson complete
  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons((prev) => [...prev, lessonId]);
    }
  };

  // Handle opening a lesson
  const openLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setShowVideo(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Back Link */}
      <Link
        href="/learn"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        ← {t('common.back')}
      </Link>

      {/* Module Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{module.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t(module.titleKey)}
            </h1>
            <p className="text-gray-600">{t(module.descriptionKey)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('learn.progress')}</span>
            <span className="font-medium">
              {completedLessons.length}/{module.lessons.length} {t('learn.lessons')}
            </span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>

      {/* Estimated Time */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          ~{module.estimatedHours} {t('learn.hours')}
        </span>
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        {module.lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isNext =
            !isCompleted &&
            (index === 0 ||
              completedLessons.includes(module.lessons[index - 1].id));

          return (
            <Card
              key={lesson.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isCompleted && 'bg-green-50 border-green-200',
                isNext && 'border-blue-300 ring-2 ring-blue-100'
              )}
              onClick={() => openLesson(lesson.id)}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Lesson Number/Status */}
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full font-semibold',
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>

                {/* Lesson Info */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {t(lesson.titleKey)}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                    <span>{lesson.duration} min</span>
                    {lesson.videoUrl && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                        Video
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-gray-400">→</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quiz Button */}
      {hasQuiz(moduleId) && (
        <div className="mt-8">
          <Card
            className={cn(
              'border-2',
              allLessonsCompleted
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
            )}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {t('learn.quiz.title')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {allLessonsCompleted
                        ? t('learn.quiz.ready')
                        : t('learn.quiz.completeLessons')}
                    </p>
                  </div>
                </div>
                {allLessonsCompleted ? (
                  <Link href={`/learn/${params.moduleId}/quiz`}>
                    <Button variant="primary">{t('learn.quiz.start')}</Button>
                  </Link>
                ) : (
                  <Button variant="secondary" disabled>
                    🔒 {t('learn.locked')}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Lesson Modal */}
      <Modal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        title={currentLesson ? t(currentLesson.titleKey) : ''}
        size="lg"
      >
        {currentLesson && (
          <div className="space-y-4">
            {/* Video Player */}
            {currentLesson.videoUrl && (
              <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(
                    currentLesson.videoUrl
                  )}?rel=0`}
                  title={t(currentLesson.titleKey)}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Lesson Content */}
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600">{t(currentLesson.contentKey)}</p>
            </div>

            {/* Key Points */}
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 font-semibold text-blue-900">
                {t('learn.keyPoints')}
              </h4>
              <ul className="space-y-2">
                {currentLesson.keyPoints.map((pointKey, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-blue-800">
                    <span className="mt-1 text-blue-500">•</span>
                    <span>{t(pointKey)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowVideo(false)}
              >
                {t('common.close')}
              </Button>
              {!completedLessons.includes(currentLesson.id) && (
                <Button
                  variant="success"
                  fullWidth
                  onClick={() => {
                    markLessonComplete(currentLesson.id);
                    setShowVideo(false);
                  }}
                >
                  ✓ {t('learn.markComplete')}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
