/**
 * Module 2: How to Start Investing
 *
 * Practical guide to opening brokerage accounts, understanding fees,
 * and making your first investment.
 */

import { Module } from '@/types/content';

export const module2: Module = {
  id: 'module-2',
  titleKey: 'learn.modules.2.title',
  descriptionKey: 'learn.modules.2.description',
  icon: '🚀',
  lessons: [
    {
      id: 'lesson-2-1',
      titleKey: 'learn.modules.2.lessons.1.title',
      contentKey: 'learn.modules.2.lessons.1.content',
      videoUrl: 'https://www.youtube.com/watch?v=4j2emMn7UaI',
      duration: 12,
      keyPoints: [
        'learn.modules.2.lessons.1.point1',
        'learn.modules.2.lessons.1.point2',
        'learn.modules.2.lessons.1.point3',
        'learn.modules.2.lessons.1.point4',
      ],
    },
    {
      id: 'lesson-2-2',
      titleKey: 'learn.modules.2.lessons.2.title',
      contentKey: 'learn.modules.2.lessons.2.content',
      videoUrl: 'https://www.youtube.com/watch?v=qgVg4hv10YQ',
      duration: 14,
      keyPoints: [
        'learn.modules.2.lessons.2.point1',
        'learn.modules.2.lessons.2.point2',
        'learn.modules.2.lessons.2.point3',
        'learn.modules.2.lessons.2.point4',
      ],
    },
    {
      id: 'lesson-2-3',
      titleKey: 'learn.modules.2.lessons.3.title',
      contentKey: 'learn.modules.2.lessons.3.content',
      videoUrl: 'https://www.youtube.com/watch?v=gFQNPmLKj1k',
      duration: 15,
      keyPoints: [
        'learn.modules.2.lessons.3.point1',
        'learn.modules.2.lessons.3.point2',
        'learn.modules.2.lessons.3.point3',
      ],
    },
    {
      id: 'lesson-2-4',
      titleKey: 'learn.modules.2.lessons.4.title',
      contentKey: 'learn.modules.2.lessons.4.content',
      videoUrl: 'https://www.youtube.com/watch?v=Qpn6uH8EbGk',
      duration: 10,
      keyPoints: [
        'learn.modules.2.lessons.4.point1',
        'learn.modules.2.lessons.4.point2',
        'learn.modules.2.lessons.4.point3',
        'learn.modules.2.lessons.4.point4',
      ],
    },
  ],
  prerequisites: ['module-1'],
  estimatedHours: 1.5,
};

export default module2;
