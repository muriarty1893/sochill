export type FeedPost = {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  time: string;
  body: string;
  mood: string;
  cause?: string;
  causeAccent?: string;
  reactions: {
    label: string;
    count: number;
  }[];
  replies: number;
};

export type Charity = {
  id: string;
  name: string;
  category: string;
  mission: string;
  accent: string;
  softAccent: string;
  supporters: string;
};

export type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  detail: string;
  time: string;
  accent: string;
};

export const posts: FeedPost[] = [
  {
    id: 'post-1',
    author: 'Mina',
    handle: '@minabean',
    avatar: 'MI',
    time: '8m',
    body: 'Found a tiny community fridge near Kadikoy and dropped off fruit after class. Good kind of tired.',
    mood: 'small win',
    cause: 'Neighborhood Pantry Fund',
    causeAccent: '#2E8B77',
    reactions: [
      { label: 'warm', count: 42 },
      { label: 'boost', count: 12 },
    ],
    replies: 8,
  },
  {
    id: 'post-2',
    author: 'Can',
    handle: '@canwashere',
    avatar: 'CA',
    time: '21m',
    body: 'Public reminder: the beach cleanup crew is meeting Saturday morning. I am bringing coffee and bad jokes.',
    mood: 'outside',
    cause: 'Blue Shore Cleanup',
    causeAccent: '#3B82B8',
    reactions: [
      { label: 'in', count: 18 },
      { label: 'share', count: 6 },
    ],
    replies: 5,
  },
  {
    id: 'post-3',
    author: 'Lara',
    handle: '@laralately',
    avatar: 'LA',
    time: '46m',
    body: 'Making soup, answering messages, trying to be a person with a working laundry schedule.',
    mood: 'so chill',
    reactions: [
      { label: 'same', count: 67 },
      { label: 'soft', count: 20 },
    ],
    replies: 14,
  },
];

export const charities: Charity[] = [
  {
    id: 'charity-1',
    name: 'Neighborhood Pantry Fund',
    category: 'Food access',
    mission: 'Keeps shared community fridges stocked with fresh groceries and pantry basics.',
    accent: '#2E8B77',
    softAccent: '#DDF2EB',
    supporters: '2.4k',
  },
  {
    id: 'charity-2',
    name: 'Blue Shore Cleanup',
    category: 'Environment',
    mission: 'Funds local cleanup days, reusable gear, and water testing along city coastlines.',
    accent: '#3B82B8',
    softAccent: '#DCEFFA',
    supporters: '980',
  },
  {
    id: 'charity-3',
    name: 'Open Room Books',
    category: 'Education',
    mission: 'Builds tiny reading rooms and book shelves in youth centers and shelters.',
    accent: '#C86B4A',
    softAccent: '#F8E5DD',
    supporters: '740',
  },
];

export const activity: ActivityItem[] = [
  {
    id: 'activity-1',
    actor: 'Mina',
    action: 'boosted your post',
    detail: 'The pantry fund picked up 14 new supporters.',
    time: '4m',
    accent: '#2E8B77',
  },
  {
    id: 'activity-2',
    actor: 'Blue Shore Cleanup',
    action: 'posted a spotlight',
    detail: 'Saturday cleanup needs 12 more volunteers.',
    time: '19m',
    accent: '#3B82B8',
  },
  {
    id: 'activity-3',
    actor: 'Lara',
    action: 'replied',
    detail: 'Same laundry schedule situation, honestly.',
    time: '32m',
    accent: '#C86B4A',
  },
  {
    id: 'activity-4',
    actor: 'Open Room Books',
    action: 'reached a milestone',
    detail: 'A new shelf is ready to open in the reading room.',
    time: '1h',
    accent: '#D4A21F',
  },
];
