/**
 * Module 9: Reading Charts & Candlesticks
 *
 * Introduction to reading stock charts and understanding candlestick patterns.
 * Visual basics only - no technical analysis at this stage.
 */

import { Module } from '@/types/content';

export const module9: Module = {
  id: 'module-9',
  titleKey: 'learn.modules.9.title',
  descriptionKey: 'learn.modules.9.description',
  icon: '📊',
  lessons: [
    {
      id: 'lesson-9-1',
      titleKey: 'learn.modules.9.lessons.1.title',
      contentKey: 'learn.modules.9.lessons.1.content',
      videoUrl: 'https://www.youtube.com/watch?v=xrVlD6p1HMw',
      duration: 12,
      keyPoints: [
        'learn.modules.9.lessons.1.point1',
        'learn.modules.9.lessons.1.point2',
        'learn.modules.9.lessons.1.point3',
        'learn.modules.9.lessons.1.point4',
      ],
    },
    {
      id: 'lesson-9-2',
      titleKey: 'learn.modules.9.lessons.2.title',
      contentKey: 'learn.modules.9.lessons.2.content',
      videoUrl: 'https://www.youtube.com/watch?v=EQ3RSolMG8I',
      duration: 15,
      keyPoints: [
        'learn.modules.9.lessons.2.point1',
        'learn.modules.9.lessons.2.point2',
        'learn.modules.9.lessons.2.point3',
        'learn.modules.9.lessons.2.point4',
      ],
    },
    {
      id: 'lesson-9-3',
      titleKey: 'learn.modules.9.lessons.3.title',
      contentKey: 'learn.modules.9.lessons.3.content',
      videoUrl: 'https://www.youtube.com/watch?v=lXqFy5VxHq8',
      duration: 14,
      keyPoints: [
        'learn.modules.9.lessons.3.point1',
        'learn.modules.9.lessons.3.point2',
        'learn.modules.9.lessons.3.point3',
        'learn.modules.9.lessons.3.point4',
      ],
    },
    {
      id: 'lesson-9-4',
      titleKey: 'learn.modules.9.lessons.4.title',
      contentKey: 'learn.modules.9.lessons.4.content',
      videoUrl: 'https://www.youtube.com/watch?v=0Qz0TXE9o2U',
      duration: 12,
      keyPoints: [
        'learn.modules.9.lessons.4.point1',
        'learn.modules.9.lessons.4.point2',
        'learn.modules.9.lessons.4.point3',
        'learn.modules.9.lessons.4.point4',
      ],
    },
  ],
  prerequisites: ['module-1'],
  estimatedHours: 1.5,
};

export default module9;
