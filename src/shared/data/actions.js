import { Navigation, Car, Building2, CalendarDays } from 'lucide-react-native';

export const getActions = (navigation) => [
  { Icon: Navigation, label: "Navigate", sub: "Find your way", color: "#7128CE" },
  { Icon: Car, label: "CityRide", sub: "Book a ride", color: "#C48D38", onPress: () => navigation.navigate("CityRide") },
  { Icon: Building2, label: "Stay", sub: "Guest houses", color: "#2A7FAB" },
  { Icon: CalendarDays, label: "Events", sub: "What's on today", color: "#4A8A5A" },
];