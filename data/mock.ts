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

export type CharityPost = {
  id: string;
  charityId: string;
  charityName: string;
  category: string;
  accent: string;
  softAccent: string;
  emoji: string;
  title: string;
  body: string;
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

export type FriendUser = {
  id: string;
  name: string;
  color: string;
  hasPfp: boolean;
};

export type FriendSparkEntry = {
  id: string;
  charityName: string;
  charityAccent: string;
  friends: FriendUser[];
  totalCount: number;
  time: string;
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

export const charityPosts: CharityPost[] = [
  {
    id: 'cp-1',
    charityId: 'charity-1',
    charityName: 'Neighborhood Pantry Fund',
    category: 'Food access',
    accent: '#2E8B77',
    softAccent: '#DDF2EB',
    emoji: '🥗',
    title: '14 new families joined our weekly drop this month.',
    body: 'Community fridges near Kadikoy are running low on fresh produce. We need help keeping shelves stocked for families who depend on them every single week.',
    supporters: '2.4k',
  },
  {
    id: 'cp-2',
    charityId: 'charity-2',
    charityName: 'Blue Shore Cleanup',
    category: 'Environment',
    accent: '#3B82B8',
    softAccent: '#DCEFFA',
    emoji: '🌊',
    title: 'Saturday cleanup needs 12 more volunteers.',
    body: 'We removed 400kg of plastic from city coastlines last season. This Saturday we\'re back at the Bostanci shore — bring gloves, bring a friend.',
    supporters: '980',
  },
  {
    id: 'cp-3',
    charityId: 'charity-3',
    charityName: 'Open Room Books',
    category: 'Education',
    accent: '#C86B4A',
    softAccent: '#F8E5DD',
    emoji: '📚',
    title: 'Shelf 12 opens next week. One more push needed.',
    body: 'We\'re 91% funded for our 12th reading shelf inside a youth shelter. Every spark helps us get books into the hands of kids who need a quiet corner.',
    supporters: '740',
  },
  {
    id: 'cp-4',
    charityId: 'charity-4',
    charityName: 'Warm Hands Mutual Aid',
    category: 'Mutual Aid',
    accent: '#8B5E2E',
    softAccent: '#F5E9D9',
    emoji: '🤝',
    title: 'Winter kits going out this week.',
    body: 'Blankets, socks, and warm food packages are packed and ready. We\'re distributing across three districts this weekend. Attention helps us reach more ground.',
    supporters: '1.1k',
  },
  {
    id: 'cp-5',
    charityId: 'charity-5',
    charityName: 'Safe Roof Housing',
    category: 'Housing',
    accent: '#6B4CA8',
    softAccent: '#EDE5F8',
    emoji: '🏠',
    title: '40 people in transitional housing. 8 more are waiting.',
    body: 'Our transitional shelter is at full capacity. We\'re working to open a second site. Local awareness can unlock the government funding we need to get there faster.',
    supporters: '620',
  },
  {
    id: 'cp-6',
    charityId: 'charity-6',
    charityName: 'Park Clinic Collective',
    category: 'Health',
    accent: '#2E7D4F',
    softAccent: '#D9F0E4',
    emoji: '💚',
    title: 'Free clinic, every Saturday, rain or shine.',
    body: 'Volunteer doctors run a free clinic at the park each weekend. Help us spread the word so the people who need care can find us — no documents, no cost.',
    supporters: '430',
  },
  {
    id: 'cp-7',
    charityId: 'charity-7',
    charityName: '2000 Native Trees',
    category: 'Environment',
    accent: '#3D7A3A',
    softAccent: '#DAF0D9',
    emoji: '🌳',
    title: '1,847 trees planted. 153 to go before spring.',
    body: 'Every native tree we plant lowers city heat and improves air quality for thousands of people. We\'re so close to our goal — help us finish what we started.',
    supporters: '1.8k',
  },
];

export const friendSparks: FriendSparkEntry[] = [
  {
    id: 'fs-1',
    charityName: 'Blue Shore Cleanup',
    charityAccent: '#3B82B8',
    friends: [
      { id: 'f1', name: 'Mina', color: '#2E8B77', hasPfp: false },
      { id: 'f2', name: 'Can', color: '#3B82B8', hasPfp: false },
      { id: 'f3', name: 'Lara', color: '#C86B4A', hasPfp: false },
      { id: 'f4', name: 'Ayse', color: '#8B5E2E', hasPfp: false },
      { id: 'f5', name: 'Berk', color: '#6B4CA8', hasPfp: false },
      { id: 'f6', name: 'Deniz', color: '#2E7D4F', hasPfp: false },
    ],
    totalCount: 14,
    time: '12m',
  },
  {
    id: 'fs-2',
    charityName: 'Neighborhood Pantry Fund',
    charityAccent: '#2E8B77',
    friends: [
      { id: 'f2', name: 'Can', color: '#3B82B8', hasPfp: false },
      { id: 'f4', name: 'Ayse', color: '#8B5E2E', hasPfp: false },
      { id: 'f6', name: 'Deniz', color: '#2E7D4F', hasPfp: false },
    ],
    totalCount: 5,
    time: '1h',
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
