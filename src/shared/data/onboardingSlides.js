import { MapPin, Compass, ShieldAlert, Globe } from 'lucide-react-native';
import { C } from '../constants/theme';

export const ONBOARDING_SLIDES = [
  {
    id: 'welcome',
    title: 'Welcome to CityFlow',
    description: 'Your official guide to Redemption City — the vibrant RCCG Camp where faith, community, and city life meet.',
    imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=700&h=700&fit=crop',
    Icon: MapPin,
    iconColor: C.purpleL,
    gradientColors: ['rgba(113,40,206,0.35)', 'rgba(148,88,224,0.12)'],
    emoji: '🏙️',
  },
  {
    id: 'explore',
    title: 'Explore & Discover',
    description: 'Enjoy virtual city tours, find local churches and worship centres, and browse hundreds of businesses across Redemption City.',
    imageUrl: 'https://images.unsplash.com/photo-1511818966892-d5d671e672a2?w=700&h=700&fit=crop',
    Icon: Compass,
    iconColor: C.gold,
    gradientColors: ['rgba(196,141,56,0.30)', 'rgba(196,141,56,0.08)'],
    emoji: '🗺️',
  },
  {
    id: 'safety',
    title: 'Safety First',
    description: 'One-tap emergency SOS connects you to ambulance, police, and fire services instantly. Plus lost & found reporting and quick-dial contacts.',
    imageUrl: 'https://images.unsplash.com/photo-1582319581297-872bbac7c08e?w=700&h=700&fit=crop',
    Icon: ShieldAlert,
    iconColor: '#D44F4F',
    gradientColors: ['rgba(212,79,79,0.28)', 'rgba(212,79,79,0.06)'],
    emoji: '🚨',
  },
  {
    id: 'language',
    title: 'Choose Your Language',
    description: 'CityFlow speaks your language. Select your preferred language to personalise your experience.',
    imageUrl: 'https://images.unsplash.com/photo-1453770317096-5e2b68aea0a0?w=700&h=700&fit=crop',
    Icon: Globe,
    iconColor: C.purpleL,
    gradientColors: ['rgba(113,40,206,0.35)', 'rgba(148,88,224,0.12)'],
    emoji: '🌍',
  },
];