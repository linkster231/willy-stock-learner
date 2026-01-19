/**
 * Module 1: What is the Stock Market?
 *
 * Introduction to the fundamentals of the stock market,
 * including what stocks are, how exchanges work, and market history.
 */

import { Module } from '@/types/content';

export const module1: Module = {
  id: 'module-1',
  titleKey: 'learn.modules.1.title',
  descriptionKey: 'learn.modules.1.description',
  icon: '📈',
  lessons: [
    {
      id: 'lesson-1-1',
      titleKey: 'learn.modules.1.lessons.1.title',
      contentKey: 'learn.modules.1.lessons.1.content',
      videoUrl: 'https://www.youtube.com/watch?v=p7HKvqRI_Bo',
      duration: 12,
      keyPoints: [
        'learn.modules.1.lessons.1.point1',
        'learn.modules.1.lessons.1.point2',
        'learn.modules.1.lessons.1.point3',
        'learn.modules.1.lessons.1.point4',
      ],
    },
    {
      id: 'lesson-1-2',
      titleKey: 'learn.modules.1.lessons.2.title',
      contentKey: 'learn.modules.1.lessons.2.content',
      videoUrl: 'https://www.youtube.com/watch?v=ZCFkWDdmXG8',
      duration: 15,
      keyPoints: [
        'learn.modules.1.lessons.2.point1',
        'learn.modules.1.lessons.2.point2',
        'learn.modules.1.lessons.2.point3',
        'learn.modules.1.lessons.2.point4',
      ],
    },
    {
      id: 'lesson-1-3',
      titleKey: 'learn.modules.1.lessons.3.title',
      contentKey: 'learn.modules.1.lessons.3.content',
      videoUrl: 'https://www.youtube.com/watch?v=F3QpgXBtDeo',
      duration: 10,
      keyPoints: [
        'learn.modules.1.lessons.3.point1',
        'learn.modules.1.lessons.3.point2',
        'learn.modules.1.lessons.3.point3',
      ],
    },
    {
      id: 'lesson-1-4',
      titleKey: 'learn.modules.1.lessons.4.title',
      contentKey: 'learn.modules.1.lessons.4.content',
      videoUrl: 'https://www.youtube.com/watch?v=Xn7KWR9EOGQ',
      duration: 18,
      keyPoints: [
        'learn.modules.1.lessons.4.point1',
        'learn.modules.1.lessons.4.point2',
        'learn.modules.1.lessons.4.point3',
        'learn.modules.1.lessons.4.point4',
      ],
    },
    {
      id: 'lesson-1-5',
      titleKey: 'learn.modules.1.lessons.5.title',
      contentKey: 'learn.modules.1.lessons.5.content',
      videoUrl: 'https://www.youtube.com/watch?v=CaWyMlxMSJk',
      duration: 10,
      keyPoints: [
        'learn.modules.1.lessons.5.point1',
        'learn.modules.1.lessons.5.point2',
        'learn.modules.1.lessons.5.point3',
      ],
    },
  ],
  prerequisites: [],
  estimatedHours: 1.5,
};

export default module1;
