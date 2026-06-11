import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertCircle, Bell, Bot, CalendarDays, Navigation, Radio } from 'lucide-react-native';
import { EVENTS } from '../events/eventsData';

export const NEWS_ITEMS = [
  {
    id: 'thanksgiving-service-news',
    type: 'news',
    icon: 'Radio',
    color: '#7128CE',
    title: 'Monthly Thanksgiving Service',
    body: 'Join us Saturday at 6PM for a special celebration of praise and worship.',
    detail: 'The Monthly Thanksgiving Service brings residents, visitors, families, workers, and guests together for praise, prayer, testimony, and thanksgiving. Arrive early and follow usher directions around the Main Auditorium.',
    time: '2h ago',
    unread: true,
  },
  {
    id: 'lost-wallet-gate-b',
    type: 'news',
    icon: 'AlertCircle',
    color: '#D44F4F',
    title: 'Lost: Black Wallet - Gate B',
    body: 'A black leather wallet was found at Gate B. Contact the security desk to claim.',
    detail: 'A black leather wallet was recovered around Gate B and logged with security. The owner should visit the security desk with identifying details before collection.',
    time: '4h ago',
    unread: true,
    tab: 'LostFound',
  },
  {
    id: 'holy-ghost-reminder',
    type: 'event',
    eventId: 'holy-ghost-service',
    icon: 'CalendarDays',
    color: '#2A7FAB',
    title: 'Reminder: Holy Ghost Service',
    body: 'Starts in 3 hours at the Main Auditorium. Tap to get directions.',
    detail: 'Holy Ghost Service is coming up. Follow the event to receive phone reminders and in-app alerts before it starts.',
    time: '5h ago',
    unread: true,
  },
  {
    id: 'camp-road-closure',
    type: 'news',
    icon: 'Navigation',
    color: '#C48D38',
    title: 'Camp Road Closure',
    body: 'Main Camp Road closed 10AM-2PM for event. Please use Alternative Route 2.',
    detail: 'Main Camp Road will be closed from 10AM to 2PM for event traffic management. Drivers should use Alternative Route 2 and follow marshal instructions.',
    time: '6h ago',
  },
  {
    id: 'cityflow-ai-tip',
    type: 'news',
    icon: 'Bot',
    color: '#9458E0',
    title: 'CityFlow AI tip',
    body: 'You can now ask me for directions to any location inside the city.',
    detail: 'CityFlow AI can help with directions, emergency contacts, rides, restaurants, events, and general Redemption City guidance.',
    time: '1d ago',
  },
];

export const NOTIFICATION_ICONS = { AlertCircle, Bell, Bot, CalendarDays, Navigation, Radio };
export const FOLLOWED_EVENTS_KEY = 'cityflow_followed_events';

export async function getFollowedEventIds() {
  try {
    const raw = await AsyncStorage.getItem(FOLLOWED_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function setEventFollowed(eventId, followed) {
  const ids = await getFollowedEventIds();
  const next = followed
    ? Array.from(new Set([...ids, eventId]))
    : ids.filter((id) => id !== eventId);
  await AsyncStorage.setItem(FOLLOWED_EVENTS_KEY, JSON.stringify(next));
  return next;
}

export function buildFollowedEventNotifications(followedIds) {
  return EVENTS.filter((event) => followedIds.includes(event.id)).flatMap((event) => ([
    {
      id: `${event.id}-day-before`,
      type: 'event',
      eventId: event.id,
      icon: 'Bell',
      color: event.color || '#C48D38',
      title: `Tomorrow: ${event.title}`,
      body: `${event.title} is scheduled for ${event.time} at ${event.venue || event.location}.`,
      detail: `Reminder set for one day before ${event.title}. Open the event details to update calendar or reminder settings.`,
      time: '1d before',
      unread: true,
    },
    {
      id: `${event.id}-day-of`,
      type: 'event',
      eventId: event.id,
      icon: 'CalendarDays',
      color: event.color || '#2A7FAB',
      title: `Today: ${event.title}`,
      body: `${event.title} starts at ${event.time}.`,
      detail: `Reminder set for the day of ${event.title}. Please arrive early and follow directions around ${event.venue || event.location}.`,
      time: 'Today',
      unread: true,
    },
  ]));
}

export function getNotificationById(id, followedIds = []) {
  return [...NEWS_ITEMS, ...buildFollowedEventNotifications(followedIds)].find((item) => item.id === id) || NEWS_ITEMS[0];
}
