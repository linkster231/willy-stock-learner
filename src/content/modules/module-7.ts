/**
 * Module 7: Taxes for NJ Investors
 *
 * Understanding capital gains taxes, New Jersey specific tax rules,
 * and tax-advantaged accounts like 401(k) and IRA.
 */

import { Module } from '@/types/content';

export const module7: Module = {
  id: 'module-7',
  titleKey: 'learn.modules.7.title',
  descriptionKey: 'learn.modules.7.description',
  icon: '📋',
  lessons: [
    {
      id: 'lesson-7-1',
      titleKey: 'learn.modules.7.lessons.1.title',
      contentKey: 'learn.modules.7.lessons.1.content',
      videoUrl: 'https://www.youtube.com/watch?v=TgYbvVbMEpc',
      duration: 15,
      keyPoints: [
        'learn.modules.7.lessons.1.point1',
        'learn.modules.7.lessons.1.point2',
        'learn.modules.7.lessons.1.point3',
        'learn.modules.7.lessons.1.point4',
      ],
    },
    {
      id: 'lesson-7-2',
      titleKey: 'learn.modules.7.lessons.2.title',
      contentKey: 'learn.modules.7.lessons.2.content',
      videoUrl: 'https://www.youtube.com/watch?v=bZ3BFDP9gK0',
      duration: 12,
      keyPoints: [
        'learn.modules.7.lessons.2.point1',
        'learn.modules.7.lessons.2.point2',
        'learn.modules.7.lessons.2.point3',
      ],
    },
    {
      id: 'lesson-7-3',
      titleKey: 'learn.modules.7.lessons.3.title',
      contentKey: 'learn.modules.7.lessons.3.content',
      videoUrl: 'https://www.youtube.com/watch?v=7sTTL0V50Xk',
      duration: 14,
      keyPoints: [
        'learn.modules.7.lessons.3.point1',
        'learn.modules.7.lessons.3.point2',
        'learn.modules.7.lessons.3.point3',
        'learn.modules.7.lessons.3.point4',
      ],
    },
    {
      id: 'lesson-7-4',
      titleKey: 'learn.modules.7.lessons.4.title',
      contentKey: 'learn.modules.7.lessons.4.content',
      videoUrl: 'https://www.youtube.com/watch?v=eDqHunq0dBM',
      duration: 18,
      keyPoints: [
        'learn.modules.7.lessons.4.point1',
        'learn.modules.7.lessons.4.point2',
        'learn.modules.7.lessons.4.point3',
        'learn.modules.7.lessons.4.point4',
      ],
    },
    {
      id: 'lesson-7-5',
      titleKey: 'learn.modules.7.lessons.5.title',
      contentKey: 'learn.modules.7.lessons.5.content',
      videoUrl: 'https://www.youtube.com/watch?v=7gcWfGbN3Xc',
      duration: 10,
      keyPoints: [
        'learn.modules.7.lessons.5.point1',
        'learn.modules.7.lessons.5.point2',
        'learn.modules.7.lessons.5.point3',
      ],
    },
  ],
  prerequisites: ['module-1', 'module-2'],
  estimatedHours: 1.5,
};

export default module7;
