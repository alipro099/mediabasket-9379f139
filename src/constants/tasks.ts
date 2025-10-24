export type TaskType = 'social' | 'partner' | 'game';

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: TaskType;
  link?: string;
}

export const TASKS: Task[] = [
  {
    id: '1',
    title: 'Подписка на Instagram',
    description: 'Подпишись на Instagram Лига Ставок Медиа Баскет',
    reward: 200,
    type: 'social',
    link: 'https://instagram.com/ligastavok_mediabasket',
  },
  {
    id: '2',
    title: 'Telegram-канал Media Basket',
    description: 'Подпишись на Telegram-канал Лига Ставок Медиа Баскет',
    reward: 200,
    type: 'social',
    link: 'https://t.me/mediabasket',
  },
  {
    id: '3',
    title: 'Telegram-канал Лиги Ставок',
    description: 'Подпишись на главный Telegram-канал Лиги Ставок',
    reward: 200,
    type: 'social',
    link: 'https://t.me/ligastavok',
  },
  {
    id: '4',
    title: 'Карта Тинькофф',
    description: 'Оформи карту Тинькофф и получи бонусы',
    reward: 500,
    type: 'partner',
    link: 'https://www.tinkoff.ru/cards/',
  },
  {
    id: '5',
    title: 'Заказ в Самокат',
    description: 'Оформи первый заказ в Самокат',
    reward: 300,
    type: 'partner',
    link: 'https://samokat.ru/',
  },
  {
    id: '6',
    title: 'Первый бросок',
    description: 'Сделай первый бросок в игре',
    reward: 50,
    type: 'game',
  },
  {
    id: '7',
    title: 'Точный снайпер',
    description: 'Попади 5 раз подряд',
    reward: 100,
    type: 'game',
  },
  {
    id: '8',
    title: 'Мастер броска',
    description: 'Набери 100 очков',
    reward: 150,
    type: 'game',
  },
];
