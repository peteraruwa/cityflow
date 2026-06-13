import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ImageBackground,
  Linking,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  Building2,
  CalendarDays,
  Camera,
  Car,
  ChevronRight,
  Clock,
  Cloud,
  CloudRain,
  Coffee,
  Droplets,
  Eye,
  FileText,
  Gift,
  Leaf,
  MapPin,
  Navigation,
  Quote,
  Radio,
  Search,
  Send,
  Siren,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  Thermometer,
  Trophy,
  Utensils,
  Wind,
  X,
} from "lucide-react-native";
import { C } from "../../shared/constants/theme";
import { usePrefs } from "../../shared/context/PrefsContext";
import { useUserProfile } from "../../shared/context/UserContext";
import { translateText } from "../../shared/i18n/runtimeTranslator";
import { allQuotes } from "../../shared/data/quotes";
import { getPictureSource } from "../picture-day/data/gallery";
import usePictureOfTheDay from "../picture-day/usePictureOfTheDay";
import { db } from "../../shared/config/firebase";
import NewsFeed from './components/NewsFeed';
// Import the real WeatherWidget component
import WeatherWidget from '../../features/weather-widget/WeatherWidget';

const TICKER_ITEMS = [
  "Sunday Victory Service - live now at the Main Auditorium",
  "Main Camp Road closed 10AM-2PM - use Alternative Route 2",
  "Monthly Thanksgiving Service - Saturday, 6:00 PM",
  "Holy Ghost Service - Friday, 6:00 PM",
  "Lost & Found: black wallet recovered at Gate B - contact security",
];

const EVENTS = [
  { id: "victory-service", day: "SUN", date: "16", tag: "LIVE", title: "Sunday Victory Service", time: "8:00 AM", venue: "Main Auditorium", color: "#D44F4F", live: true },
  { id: "thanksgiving-service", day: "SAT", date: "22", tag: "SPECIAL", title: "Monthly Thanksgiving Service", time: "6:00 PM", venue: "Main Auditorium", color: "#C48D38" },
  { id: "holy-ghost-service", day: "FRI", date: "28", tag: "SERVICE", title: "Holy Ghost Service", time: "6:00 PM", venue: "Prayer Ground", color: "#7128CE" },
  { id: "youth-fellowship", day: "SUN", date: "30", tag: "YOUTH", title: "Youth Fellowship", time: "4:00 PM", venue: "Youth Centre", color: "#2A7FAB" },
];

const FUN_FACTS = [
  {
    icon: "🏙️",
    fact: "Redemption City was officially commissioned in 1999 and now hosts over 1 million visitors annually during major conventions.",
  },
];

const DEVOTIONAL = {
  date: "Today",
  topic: "The Power of Praise",
  text: "Praise is the highest form of prayer. When you praise God in the midst of your circumstances, you invite His presence and power into your situation...",
  verse: "Let everything that has breath praise the Lord.",
  ref: "Psalm 150:6",
  reading: "Psalm 150",
};

const OPEN_HEAVENS_LINKS = {
  website: "https://eopenheavens.com",
  android: "https://play.google.com/store/apps/details?id=com.open_heavens",
  ios: "https://apps.apple.com/us/app/open-heavens-devotional/id6471082691",
};

const ACTIONS = [
  { Icon: Navigation, label: "Navigate", sub: "Live city map", color: "#7128CE", route: "Navigation" },
  { Icon: Car, label: "CityRide", sub: "Book a ride", color: "#C48D38", tab: "CityRide" },
  { Icon: Building2, label: "Stay", sub: "Guest houses", color: "#2A7FAB", route: "Stay" },
  { Icon: CalendarDays, label: "Events", sub: "What's on today", color: "#4A8A5A", route: "Events" },
];

function birthdayParts(value) {
  if (!value) return null;
  const text = typeof value === 'string' ? value : value?.toDate?.()?.toISOString?.() || '';
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (!match) return null;
  return { month: Number(match[2]), day: Number(match[3]) };
}

function isBirthdayToday(user) {
  const parts = birthdayParts(user?.dob || user?.dateOfBirth || user?.birthDate || user?.birthday);
  if (!parts) return false;
  const today = new Date();
  return parts.month === today.getMonth() + 1 && parts.day === today.getDate();
}



export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { language } = usePrefs();
  const { user } = useUserProfile();
  const [showWeather, setShowWeather] = useState(false);
  const [showDevotional, setShowDevotional] = useState(false);
  const tr = (value) => translateText(value, language);
  const firstName = user?.firstName || "Guest";
  const showBirthdayBanner = isBirthdayToday(user);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const goTab = (name) => navigation.getParent()?.navigate(name);
  const goRoute = (name, params) => navigation.navigate(name, params);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={s.header}>
        <View>
          <Text style={s.brand}>CityFlow</Text>
          <View style={s.locRow}>
            <MapPin size={10} color={C.gold} strokeWidth={2.5} />
            <Text style={s.locTxt}>{tr("Redemption City")} · 110115</Text>
          </View>
        </View>
        <View style={s.headerActions}>
          <TouchableOpacity style={s.headerBtn} onPress={() => goRoute("Search")} activeOpacity={0.78}>
            <Search size={16} color={C.tp} strokeWidth={1.8} />
          </TouchableOpacity>
          <TouchableOpacity style={s.headerBtn} onPress={() => goRoute("Notifications")} activeOpacity={0.78}>
            <Bell size={16} color={C.tp} strokeWidth={1.8} />
            <View style={s.notifDot} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={s.headerRule} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <NewsTicker tr={tr} active={isFocused} onTap={() => goRoute("Notifications")} />

        <View style={s.greetingRow}>
          <View style={s.greetingText}>
            <Text style={s.greetingName}>{tr(getGreeting())},</Text>
            <Text style={s.greetingUser}>{tr(firstName)} {"\uD83D\uDC4B"}</Text>
            <Text style={s.greetingSub}>{tr("Welcome to Redemption City of God")}</Text>
          </View>
          {/* Updated to use the real WeatherWidget component */}
          <WeatherWidget />
        </View>

        {showBirthdayBanner && <BirthdayBanner tr={tr} firstName={firstName} />}

        <QuoteOfTheDay tr={tr} />

        <HeroCard tr={tr} onDirections={() => goRoute("Navigation", { initialDest: "NEW ARENA Auditorium" })} onDetails={() => goRoute("EventDetail", { eventId: "victory-service" })} />

        <SosBanner tr={tr} onPress={() => goRoute("Emergency")} />

        <View style={s.section}>
          <SectionHeader tr={tr} title="Quick Actions" action={null} />
          <View style={s.actionsGrid}>
            {ACTIONS.map(({ Icon, label, sub, color, route, tab }) => (
              <TouchableOpacity
                key={label}
                style={s.actionCard}
                onPress={() => (tab ? goTab(tab) : goRoute(route))}
                activeOpacity={0.82}
              >
                <View style={[s.actionIcon, { backgroundColor: `${color}1A`, borderColor: `${color}28` }]}>
                  <Icon size={18} color={color} strokeWidth={1.8} />
                </View>
                <Text style={s.actionLabel}>{tr(label)}</Text>
                <Text style={s.actionSub}>{tr(sub)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <EventsPreview tr={tr} onSeeAll={() => goRoute("Events")} onEventPress={(eventId) => goRoute("EventDetail", { eventId })} />

        <NewsFeed
          tr={tr}
          onLostFoundPress={() => navigation.getParent()?.navigate("LostFound")}
          onNewsPress={(newsItem) => goRoute("NewsDetail", { newsId: newsItem.id })}
        />

        <CityTourCard tr={tr} onPress={() => goRoute("CityTour")} />

        <FindChurchCard tr={tr} onPress={() => goRoute("FindAChurch")} />

        <BusinessCard tr={tr} onPress={() => goRoute("BusinessDirectory")} />

        <AiCard tr={tr} onPress={() => goRoute("AIAssistant")} />

        <PictureCard tr={tr} onPress={(picture) => goRoute("PictureGallery", { overridePicture: picture })} />

        <FactCard tr={tr} onPress={() => goRoute("FunFacts")} />

        <QuizCard tr={tr} onPress={() => goRoute("Quiz")} />

        <DevotionalCard tr={tr} onOpen={() => setShowDevotional(true)} />

        <View style={{ height: 8 }} />
      </ScrollView>

      {/* WeatherModal is no longer needed since WeatherWidget has its own modal */}
      {/* Keep the OpenHeavensModal */}
      <OpenHeavensModal tr={tr} visible={showDevotional} onClose={() => setShowDevotional(false)} />
    </View>
  );
}

// ... rest of the helper functions remain the same ...

async function openExternalUrl(url, fallbackUrl = OPEN_HEAVENS_LINKS.website) {
  try {
    await Linking.openURL(url);
  } catch (error) {
    if (fallbackUrl && fallbackUrl !== url) {
      await Linking.openURL(fallbackUrl).catch(() => { });
    }
  }
}

function SectionHeader({ tr, title, action = "See all", onAction }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{tr(title)}</Text>
      {action && (
        <TouchableOpacity onPress={onAction} style={s.sectionAction} activeOpacity={0.75}>
          <Text style={s.sectionActionText}>{tr(action)}</Text>
          <ChevronRight size={12} color={C.gold} strokeWidth={2.5} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function NewsTicker({ tr, active, onTap }) {
  const x = useRef(new Animated.Value(0)).current;
  const loopRef = useRef(null);
  const [loopWidth, setLoopWidth] = useState(0);
  const [tickerItems, setTickerItems] = useState(TICKER_ITEMS);

  useEffect(() => {
    let mounted = true;

    async function loadTickerItems() {
      try {
        const snap = await getDocs(query(collection(db, "news"), orderBy("createdAt", "desc"), limit(20)));
        const cutoff = Date.now() - (2 * 24 * 60 * 60 * 1000);
        const liveItems = snap.docs
          .map((item) => ({ id: item.id, ...item.data() }))
          .filter((item) => item.visible !== false)
          .filter((item) => {
            const date = item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt);
            return Number.isFinite(date.getTime()) && date.getTime() >= cutoff;
          })
          .map((item) => {
            const prefix = item.category === "Lost & Found" || item.sourceType === "lost_found" ? "Lost & Found" : item.category || "News";
            return `${prefix}: ${item.title}`;
          });
        if (mounted && liveItems.length > 0) setTickerItems(liveItems);
      } catch (error) {
        console.warn("Could not load ticker news:", error?.code || error?.message);
      }
    }

    if (active) loadTickerItems();
    return () => {
      mounted = false;
    };
  }, [active]);

  useEffect(() => {
    loopRef.current?.stop();
    loopRef.current = null;
    if (!loopWidth || !active) return undefined;
    x.setValue(0);
    const loop = Animated.loop(
      Animated.timing(x, {
        toValue: -loopWidth,
        duration: 36000,
        easing: (value) => value,
        useNativeDriver: true,
      }),
    );
    loopRef.current = loop;
    loop.start();
    return () => {
      loop.stop();
      if (loopRef.current === loop) loopRef.current = null;
    };
  }, [active, loopWidth, x]);

  return (
    <TouchableOpacity onPress={onTap} style={s.ticker} activeOpacity={0.85}>
      <View style={s.tickerLabel}>
        <PulsingDot size={5} color={C.gold} />
        <Text style={s.tickerLabelText}>{tr("NEWS")}</Text>
      </View>
      <View style={s.tickerTrackWrap}>
        <Animated.View style={[s.tickerTrack, { transform: [{ translateX: x }] }]}>
          {[0, 1].map((rep) => (
            <View
              key={rep}
              style={s.tickerGroup}
              onLayout={rep === 0 ? (event) => setLoopWidth(event.nativeEvent.layout.width) : undefined}
            >
              {tickerItems.map((item, index) => (
                <View key={`${item}-${index}`} style={s.tickerItem}>
                  <Text style={s.tickerText}>{tr(item)}</Text>
                  <View style={s.tickerDot} />
                </View>
              ))}
            </View>
          ))}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

// REMOVED the old WeatherWidget and WeatherIcon functions since they're now imported
// Also REMOVED the WeatherModal component since it's now part of the WeatherWidget

function QuoteOfTheDay({ tr }) {
  const now = new Date();
  const daySeed = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000;
  const q = allQuotes[Math.floor(daySeed) % allQuotes.length];
  return (
    <View style={s.quoteWrap}>
      <LinearGradient colors={["rgba(196,141,56,0.13)", "rgba(10,2,24,1)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.quoteCard}>
        <View style={s.quoteBg}>
          <Quote size={88} color={C.gold} strokeWidth={1.5} />
        </View>
        <View style={s.quoteLabel}>
          <Sparkles size={12} color={C.gold} strokeWidth={2} />
          <Text style={s.quoteLabelText}>{tr("Quote of the Day")}</Text>
        </View>
        <Text style={s.quoteText}>"{tr(q.text)}"</Text>
        <Text style={s.quoteBy}>- {q.author}</Text>
      </LinearGradient>
    </View>
  );
}

function HeroCard({ tr, onDirections, onDetails }) {
  return (
    <View style={s.heroWrap}>
      <LinearGradient colors={["rgba(90,18,165,0.94)", "rgba(38,8,75,0.97)", "rgba(10,2,24,1)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.heroCard}>
        <View style={s.heroGlow} />
        <View style={s.heroTop}>
          <View style={s.liveChip}>
            <PulsingDot size={5} color="#F06565" />
            <Text style={s.liveText}>{tr("LIVE NOW")}</Text>
          </View>
          <View style={s.heroLine} />
          <Text style={s.todayText}>{tr("Today")}</Text>
        </View>
        <Text style={s.heroTitle}>{tr("Sunday Victory Service")}</Text>
        <View style={s.heroMeta}>
          <View style={s.metaRow}>
            <Building2 size={11} color={C.gold} strokeWidth={1.8} />
            <Text style={s.metaText}>{tr("Main Auditorium")} · {tr("Redemption City")}</Text>
          </View>
          <View style={s.metaRow}>
            <Clock size={11} color={C.gold} strokeWidth={1.8} />
            <Text style={s.metaText}>8:00 AM - 11:30 AM</Text>
          </View>
        </View>
        <View style={s.heroBtns}>
          <TouchableOpacity style={s.heroBtnPrimary} onPress={onDirections} activeOpacity={0.85}>
            <Navigation size={12} color="#fff" strokeWidth={2.5} />
            <Text style={s.heroBtnPrimaryText}>{tr("Get Directions")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.heroBtnSecondary} onPress={onDetails} activeOpacity={0.85}>
            <Text style={s.heroBtnSecondaryText}>{tr("View Details")}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

function SosBanner({ tr, onPress }) {
  return (
    <View style={s.sectionNoTop}>
      <TouchableOpacity onPress={onPress} style={s.sosBanner} activeOpacity={0.85}>
        <View style={s.sosIcon}>
          <Siren size={20} color="#F06565" strokeWidth={1.8} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.sosTitle}>{tr("Emergency / SOS")}</Text>
          <View style={s.sosNums}>
            {[["199", "Ambulance"], ["112", "Police"], ["190", "Fire"], ["122", "Road"]].map(([num, label]) => (
              <Text key={num} style={s.sosNum}>{num} <Text style={s.sosLabel}>{tr(label)}</Text> </Text>
            ))}
          </View>
        </View>
        <View style={s.sosRight}>
          <PulsingDot size={8} color="#F06565" />
          <ChevronRight size={14} color="#F06565" strokeWidth={2} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

function BirthdayBanner({ tr, firstName }) {
  const confetti = ["#FF5FA2", "#32D4FF", "#FFD166", "#7C4DFF", "#3DDB86", "#FF8A3D"];
  return (
    <View style={s.birthdayWrap}>
      <LinearGradient colors={["#FF5FA2", "#7C4DFF", "#32D4FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.birthdayCard}>
        <View style={s.birthdayGlow} />
        <View style={s.confettiRow}>
          {confetti.map((color, index) => (
            <View key={`${color}-${index}`} style={[s.confettiDot, { backgroundColor: color }]} />
          ))}
        </View>
        <View style={s.birthdayIcon}>
          <Gift size={21} color="#2B124C" strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.birthdayTitle}>{tr(`Happy Birthday, ${firstName}!`)}</Text>
          <Text style={s.birthdayText} numberOfLines={2}>{tr("CityFlow celebrates you today. May this new year bring grace, joy, and beautiful memories in Redemption City.")}</Text>
        </View>
        <View style={s.sparkleBadge}>
          <Sparkles size={18} color="#FFD166" strokeWidth={2.1} />
        </View>
      </LinearGradient>
    </View>
  );
}

function EventsPreview({ tr, onSeeAll, onEventPress }) {
  return (
    <View style={s.eventsWrap}>
      <View style={s.eventsHeaderPad}>
        <SectionHeader tr={tr} title="Upcoming Events" action="See all" onAction={onSeeAll} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.eventScroller}>
        {EVENTS.slice(0, 4).map((event) => (
          <TouchableOpacity key={event.title} onPress={() => onEventPress(event.id)} style={s.eventCard} activeOpacity={0.85}>
            <View style={[s.eventBadge, { borderColor: `${event.color}35` }]}>
              <View style={[s.eventBadgeTop, { backgroundColor: `${event.color}28` }]}>
                <Text style={s.eventBadgeDay}>{tr(event.day)}</Text>
              </View>
              <Text style={s.eventBadgeDate}>{event.date}</Text>
            </View>
            <View style={s.eventCopy}>
              <View style={s.eventTagRow}>
                <Text style={[s.eventTag, { color: event.color, backgroundColor: `${event.color}1E`, borderColor: `${event.color}30` }]}>{tr(event.tag)}</Text>
                {event.live && <PulsingDot size={5} color="#F06565" />}
              </View>
              <Text style={s.eventTitle} numberOfLines={1}>{tr(event.title)}</Text>
              <View style={s.eventMeta}>
                <Clock size={9} color={C.gold} strokeWidth={2} />
                <Text style={s.eventMetaText} numberOfLines={1}>{event.time} · {tr(event.venue)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function CityTourCard({ tr, onPress }) {
  const stops = [
    { Icon: Building2, name: "Main Auditorium", color: "#6B35C0" },
    { Icon: Leaf, name: "Prayer Mountain", color: "#4A8A5A" },
    { Icon: Coffee, name: "Camp Restaurant", color: "#C48D38" },
    { Icon: BookOpen, name: "Bookshop", color: "#9B5E3A" },
  ];
  return (
    <View style={s.section}>
      <SectionHeader tr={tr} title="Redemption City Tour" action="Explore" onAction={onPress} />
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <LinearGradient colors={["rgba(42,127,171,0.18)", "rgba(10,2,24,1)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.tourCard}>
          <View style={s.tourHeader}>
            <View style={s.tourIcon}>
              <Navigation size={17} color="#2A7FAB" strokeWidth={1.8} />
            </View>
            <View>
              <Text style={s.tourTitle}>{tr("Guided City Tour")}</Text>
              <Text style={s.tourSub}>{tr("8 stops")} · ~2 {tr("hours")} · {tr("Self-paced")}</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tourStops}>
            {stops.map(({ Icon, name, color }) => (
              <View key={name} style={[s.tourStop, { backgroundColor: `${color}14`, borderColor: `${color}25` }]}>
                <Icon size={11} color={color} strokeWidth={2} />
                <Text style={s.tourStopText}>{tr(name)}</Text>
              </View>
            ))}
            <View style={[s.tourStop, { backgroundColor: C.surfHi, borderColor: C.b }]}>
              <Text style={s.tourMore}>+4 {tr("more")}</Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function FindChurchCard({ tr, onPress }) {
  return (
    <View style={s.section}>
      <SectionHeader tr={tr} title="Find a Church" action="See all" onAction={onPress} />
      <TouchableOpacity onPress={onPress} style={s.simpleCard} activeOpacity={0.85}>
        <View style={[s.simpleIcon, { backgroundColor: "rgba(113,40,206,0.16)", borderColor: "rgba(113,40,206,0.28)" }]}>
          <Building2 size={16} color={C.purpleL} strokeWidth={1.8} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.simpleTitle}>{tr("Nearest Parish")}</Text>
          <Text style={s.simpleSub}>{tr("RCCG City of David Parish")} · 0.4km</Text>
        </View>
        <ChevronRight size={14} color={C.tm} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

function BusinessCard({ tr, onPress }) {
  return (
    <View style={s.section}>
      <SectionHeader tr={tr} title="Business Directory" action="See all" onAction={onPress} />
      <TouchableOpacity onPress={onPress} style={s.bizCard} activeOpacity={0.85}>
        <View style={s.bizIcon}>
          <Utensils size={15} color={C.gold} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.bizName}>{tr("Camp Restaurant")}</Text>
          <Text style={s.bizSub}>{tr("Open")} · 7AM-9PM · {tr("Tap to call")}</Text>
        </View>
        <View style={s.rating}>
          <Star size={9} color={C.gold} fill={C.gold} strokeWidth={0} />
          <Text style={s.ratingText}>4.3</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function AiCard({ tr, onPress }) {
  return (
    <View style={s.section}>
      <SectionHeader tr={tr} title="CityFlow AI" action="Open chat" onAction={onPress} />
      <View style={s.aiCard}>
        <View style={s.aiHeader}>
          <View style={s.aiIcon}>
            <Bot size={14} color={C.purpleL} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.aiName}>{tr("CityFlow AI")}</Text>
            <View style={s.aiOnline}>
              <PulsingDot size={5} color={C.green} />
              <Text style={s.aiOnlineText}>{tr("Online")}</Text>
            </View>
          </View>
        </View>
        <View style={s.aiBody}>
          <View style={s.aiMsg}>
            <View style={s.aiSmallIcon}>
              <Bot size={11} color={C.purpleL} strokeWidth={2} />
            </View>
            <Text style={s.aiBubble}>{tr("Hi! I'm your CityFlow AI. Ask me anything about Redemption City.")}</Text>
          </View>
          <View style={s.aiChips}>
            {["Find a restaurant", "Book a CityRide", "Emergency contacts"].map((q) => (
              <TouchableOpacity key={q} onPress={onPress} style={s.aiChip} activeOpacity={0.8}>
                <Text style={s.aiChipText}>{tr(q)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={onPress} style={s.aiInput} activeOpacity={0.85}>
            <Text style={s.aiPlaceholder}>{tr("Ask me anything about the city...")}</Text>
            <LinearGradient colors={[C.purple, "#5A18A8"]} style={s.aiSend}>
              <Send size={12} color="#fff" strokeWidth={2} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function PictureCard({ tr, onPress }) {
  const { picture: pic } = usePictureOfTheDay();
  return (
    <View style={s.section}>
      <SectionHeader tr={tr} title="Picture of the Day" action="View Gallery" onAction={() => onPress(pic)} />
      <TouchableOpacity onPress={() => onPress(pic)} activeOpacity={0.85} style={s.pictureCard}>
        <ImageBackground source={getPictureSource(pic)} resizeMode="cover" style={s.pictureImage}>
          <LinearGradient colors={["rgba(8,1,26,0)", "rgba(8,1,26,0.85)"]} locations={[0.35, 1]} style={s.pictureOverlay} />
          <View style={s.pictureCamera}>
            <Camera size={16} color="#fff" strokeWidth={1.8} />
          </View>
          <View style={s.pictureCopy}>
            <View style={s.pictureBadge}>
              <Sunrise size={10} color={C.gold} strokeWidth={2} />
              <Text style={s.pictureBadgeText}>{tr(pic.category || "Prayer Mountain")}</Text>
            </View>
            <Text style={s.pictureTitle}>{tr(pic.title)}</Text>
            <Text style={s.pictureBy}>{tr("by")} {pic.id ? "@cityflow" : "@grace.o"}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

function FactCard({ tr, onPress }) {
  return (
    <View style={s.section}>
      <SectionHeader tr={tr} title="Did You Know?" action="See all" onAction={onPress} />
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <LinearGradient colors={["rgba(113,40,206,0.15)", "rgba(10,2,24,1)"]} style={s.factCard}>
          <Text style={s.factEmoji}>{FUN_FACTS[0].icon}</Text>
          <Text style={s.factCounter}>{tr("FACT 1 OF")} 8</Text>
          <Text style={s.factText}>{tr(FUN_FACTS[0].fact)}</Text>
          <View style={s.factDots}>
            {Array.from({ length: 8 }).map((_, i) => <View key={i} style={[s.factDot, i === 0 && s.factDotActive]} />)}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function QuizCard({ tr, onPress }) {
  return (
    <View style={s.section}>
      <SectionHeader tr={tr} title="Know Your City Quiz" action="Play" onAction={onPress} />
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <LinearGradient colors={["rgba(196,141,56,0.13)", "rgba(10,2,24,1)"]} style={s.quizCard}>
          <View style={s.quizTop}>
            <View style={s.quizIcon}>
              <Trophy size={21} color={C.gold} strokeWidth={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.quizTitle}>{tr("Know Your City")}</Text>
              <Text style={s.quizSub}>{tr("Test your knowledge of Redemption City - history, places & more.")}</Text>
            </View>
            <LinearGradient colors={[C.gold, "#A87425"]} style={s.quizArrow}>
              <ArrowRight size={14} color={C.bg} strokeWidth={2.5} />
            </LinearGradient>
          </View>
          <View style={s.quizBadges}>
            {[[FileText, "8 questions"], [Clock, "~3 min"], [Star, "Earn a badge"]].map(([Icon, label]) => (
              <View key={label} style={s.quizBadge}>
                <Icon size={11} color={C.gold} strokeWidth={2} />
                <Text style={s.quizBadgeText}>{tr(label)}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function DevotionalCard({ tr, onOpen }) {
  return (
    <View style={s.section}>
      <SectionHeader tr={tr} title="Open Heaven Devotional" action="Read Full" onAction={onOpen} />
      <TouchableOpacity onPress={onOpen} activeOpacity={0.86} style={s.devotionalCard}>
        <View style={s.devotionalHead}>
          <View style={s.devotionalIcon}>
            <BookOpen size={17} color={C.purpleL} strokeWidth={1.8} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.devotionalKicker}>{tr(`${DEVOTIONAL.date}'s Devotional`)}</Text>
            <Text style={s.devotionalTitle}>{tr(DEVOTIONAL.topic)}</Text>
          </View>
        </View>
        <View style={s.devotionalBody}>
          <View style={s.verseBox}>
            <Text style={s.verseText}>"{tr(DEVOTIONAL.verse)}"</Text>
            <Text style={s.verseRef}>{DEVOTIONAL.ref}</Text>
          </View>
          <Text style={s.devotionalText}>{tr(DEVOTIONAL.text)}</Text>
          <View style={s.devotionalBottom}>
            <View style={s.readingPill}>
              <BookOpen size={12} color={C.gold} strokeWidth={2} />
              <Text style={s.readingText}>{tr("Reading")}: {DEVOTIONAL.reading}</Text>
            </View>
            <View style={s.heartBtn}>
              <ArrowRight size={15} color={C.gold} strokeWidth={2.2} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function OpenHeavensModal({ tr, visible, onClose }) {
  const storeUrl = Platform.OS === "ios" ? OPEN_HEAVENS_LINKS.ios : OPEN_HEAVENS_LINKS.android;
  const storeLabel = Platform.OS === "ios" ? "Open App Store" : "Open Play Store";

  const openWebsite = () => {
    onClose();
    openExternalUrl(OPEN_HEAVENS_LINKS.website);
  };

  const openStore = () => {
    onClose();
    openExternalUrl(storeUrl, OPEN_HEAVENS_LINKS.website);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.modalOverlay} onPress={onClose} />
      <View style={s.openHeavensSheet}>
        <View style={s.sheetHandle} />
        <View style={s.openHeavensHead}>
          <View style={s.openHeavensIcon}>
            <BookOpen size={20} color={C.purpleL} strokeWidth={1.8} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.openHeavensTitle}>{tr("Open Heaven Devotional")}</Text>
            <Text style={s.openHeavensSub}>{tr("Read today's devotional or install the official app.")}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.75}>
            <X size={15} color={C.ts} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={s.openHeavensNotice}>
          <Text style={s.openHeavensNoticeText}>
            {tr("The official Open Heavens Devotional app is available on Google Play and the Apple App Store. eOpenHeavens also provides the official download links.")}
          </Text>
        </View>

        <TouchableOpacity onPress={openWebsite} activeOpacity={0.86}>
          <LinearGradient colors={[C.purple, "#5A18A8"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.openHeavensPrimary}>
            <BookOpen size={14} color="#fff" strokeWidth={2} />
            <Text style={s.openHeavensPrimaryText}>{tr("Read on eOpenHeavens")}</Text>
            <ArrowRight size={14} color="#fff" strokeWidth={2.4} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={openStore} activeOpacity={0.86} style={s.openHeavensSecondary}>
          <Text style={s.openHeavensSecondaryText}>{tr(storeLabel)}</Text>
          <ArrowRight size={14} color={C.gold} strokeWidth={2.3} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function PulsingDot({ size = 6, color = "#F06565", style }) {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.25, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity }, style]} />;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 30 },
  header: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { fontFamily: "Cinzel, serif", fontSize: 21, fontWeight: "600", color: C.tp, letterSpacing: 1.25 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  locTxt: { fontSize: 10, color: C.ts },
  headerActions: { flexDirection: "row", gap: 10 },
  headerBtn: { width: 38, height: 38, borderRadius: 13, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, alignItems: "center", justifyContent: "center" },
  notifDot: { position: "absolute", top: 9, right: 9, width: 6, height: 6, borderRadius: 3, backgroundColor: C.gold, borderWidth: 1.5, borderColor: C.bg },
  headerRule: { height: 1, marginHorizontal: 18, marginBottom: 4, backgroundColor: "rgba(255,255,255,0.055)" },

  ticker: { flexDirection: "row", alignItems: "stretch", marginHorizontal: 18, marginTop: 10, marginBottom: 2, borderRadius: 12, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, overflow: "hidden" },
  tickerLabel: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: "rgba(196,141,56,0.13)", borderRightWidth: 1, borderRightColor: C.b },
  tickerLabelText: { fontSize: 8.5, fontWeight: "800", color: C.gold, letterSpacing: 1.1 },
  tickerTrackWrap: { flex: 1, overflow: "hidden", justifyContent: "center" },
  tickerTrack: { flexDirection: "row", alignItems: "center" },
  tickerGroup: { flexDirection: "row", alignItems: "center" },
  tickerItem: { flexDirection: "row", alignItems: "center" },
  tickerText: { fontSize: 10.5, color: C.ts, paddingHorizontal: 13 },
  tickerDot: { width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: C.gold, opacity: 0.7 },

  greetingRow: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  greetingText: { flex: 1 },
  greetingName: { fontSize: 14, fontWeight: "500", color: C.ts },
  greetingUser: { fontSize: 24, fontWeight: "800", color: C.tp, lineHeight: 29 },
  greetingSub: { fontSize: 11.5, color: C.tm, marginTop: 4 },
  birthdayWrap: { paddingHorizontal: 18, marginBottom: 22 },
  birthdayCard: { height: 78, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.32)", paddingHorizontal: 13, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 10, overflow: "hidden" },
  birthdayGlow: { position: "absolute", top: -48, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,209,102,0.38)" },
  confettiRow: { position: "absolute", left: 14, right: 14, top: 7, flexDirection: "row", justifyContent: "space-between", opacity: 0.95 },
  confettiDot: { width: 5.5, height: 5.5, borderRadius: 3, borderWidth: 1, borderColor: "rgba(255,255,255,0.45)" },
  birthdayIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#FFD166", borderWidth: 2, borderColor: "rgba(255,255,255,0.72)", alignItems: "center", justifyContent: "center" },
  birthdayTitle: { fontSize: 14, fontWeight: "900", color: "#fff", marginBottom: 2 },
  birthdayText: { fontSize: 10.4, color: "rgba(255,255,255,0.9)", lineHeight: 14, fontWeight: "600" },
  sparkleBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(43,18,76,0.34)", borderWidth: 1, borderColor: "rgba(255,255,255,0.24)", alignItems: "center", justifyContent: "center" },

  // Removed weatherChip, weatherTemp, weatherCondition styles since they're now handled by the imported widget

  quoteWrap: { paddingHorizontal: 18, marginBottom: 22 },
  quoteCard: { borderRadius: 22, borderWidth: 1, borderColor: "rgba(196,141,56,0.22)", padding: 18, overflow: "hidden" },
  quoteBg: { position: "absolute", top: -18, right: -6, opacity: 0.12 },
  quoteLabel: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  quoteLabelText: { fontSize: 9, fontWeight: "700", color: C.gold, letterSpacing: 1.6, textTransform: "uppercase" },
  quoteText: { fontSize: 15, color: C.tp, fontWeight: "600", lineHeight: 23, marginBottom: 10 },
  quoteBottom: { flexDirection: "row", alignItems: "center", gap: 8 },
  quoteBy: { flex: 1, fontSize: 11.5, color: C.gold, fontWeight: "600" },
  quoteDots: { flexDirection: "row", gap: 4 },
  quoteDot: { width: 4.5, height: 4.5, borderRadius: 3, backgroundColor: C.tm },
  quoteDotActive: { backgroundColor: C.gold },

  heroWrap: { paddingHorizontal: 18, marginBottom: 22 },
  heroCard: { borderRadius: 26, borderWidth: 1, borderColor: "rgba(110,50,190,0.3)", padding: 20, overflow: "hidden" },
  heroGlow: { position: "absolute", top: -50, right: -30, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(105,35,200,0.14)" },
  heroTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  liveChip: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(215,55,55,0.18)", borderWidth: 1, borderColor: "rgba(225,75,75,0.28)", borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3 },
  liveText: { fontSize: 9, fontWeight: "700", color: "#F06565", letterSpacing: 1.1 },
  heroLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.06)" },
  todayText: { fontSize: 10, color: C.ts },
  heroTitle: { fontSize: 19, fontWeight: "700", color: C.tp, lineHeight: 25, marginBottom: 8 },
  heroMeta: { gap: 5, marginBottom: 18 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 11.5, color: C.ts },
  heroBtns: { flexDirection: "row", gap: 10 },
  heroBtnPrimary: { flex: 1, paddingVertical: 11, borderRadius: 13, backgroundColor: C.purple, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  heroBtnPrimaryText: { fontSize: 12, fontWeight: "600", color: "#fff" },
  heroBtnSecondary: { flex: 1, paddingVertical: 11, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: C.b, alignItems: "center", justifyContent: "center" },
  heroBtnSecondaryText: { fontSize: 12, fontWeight: "600", color: C.tp },

  section: { paddingHorizontal: 18, marginBottom: 22 },
  sectionNoTop: { paddingHorizontal: 18, marginBottom: 22 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: C.tp },
  sectionAction: { flexDirection: "row", alignItems: "center", gap: 2 },
  sectionActionText: { fontSize: 11, color: C.gold, fontWeight: "500" },

  sosBanner: { backgroundColor: "rgba(212,79,79,0.1)", borderWidth: 1, borderColor: "rgba(212,79,79,0.32)", borderRadius: 20, padding: 14, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  sosIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: "rgba(212,79,79,0.18)", borderWidth: 1, borderColor: "rgba(212,79,79,0.3)", alignItems: "center", justifyContent: "center" },
  sosTitle: { fontSize: 13.5, fontWeight: "700", color: "#F06565", marginBottom: 3 },
  sosNums: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  sosNum: { fontSize: 10, color: "rgba(240,101,101,0.75)", fontWeight: "600" },
  sosLabel: { color: C.tm, fontWeight: "400" },
  sosRight: { alignItems: "center", gap: 6 },

  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 14 },
  actionCard: { width: "47%", backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 20, padding: 14, paddingVertical: 16 },
  actionIcon: { width: 38, height: 38, borderRadius: 12, marginBottom: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 14, fontWeight: "600", color: C.tp, marginBottom: 2 },
  actionSub: { fontSize: 11, color: C.ts },

  eventsWrap: { marginBottom: 22 },
  eventsHeaderPad: { paddingHorizontal: 18, marginBottom: 12 },
  eventScroller: { paddingHorizontal: 18, gap: 12 },
  eventCard: { width: 208, flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 18, padding: 13, paddingHorizontal: 14 },
  eventBadge: { width: 46, borderRadius: 12, overflow: "hidden", borderWidth: 1 },
  eventBadgeTop: { paddingVertical: 3, alignItems: "center" },
  eventBadgeDay: { fontSize: 8.5, fontWeight: "700", color: C.tp, letterSpacing: 0.9 },
  eventBadgeDate: { fontSize: 17, fontWeight: "800", color: C.tp, paddingVertical: 4, textAlign: "center" },
  eventCopy: { flex: 1, minWidth: 0 },
  eventTagRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 },
  eventTag: { fontSize: 8.5, fontWeight: "700", borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, letterSpacing: 0.4 },
  eventTitle: { fontSize: 13, fontWeight: "700", color: C.tp, marginBottom: 4 },
  eventMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
  eventMetaText: { fontSize: 10, color: C.ts, flex: 1 },

  newsList: { gap: 10, marginTop: 14 },
  newsCard: { backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 18, padding: 14, paddingHorizontal: 15, flexDirection: "row", gap: 12 },
  newsIcon: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  newsTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  newsTitle: { flex: 1, fontSize: 13, fontWeight: "600", color: C.tp, marginRight: 8 },
  newsTime: { fontSize: 10, color: C.tm },
  newsBody: { fontSize: 11.5, color: C.ts, lineHeight: 18 },
  newsLink: { fontSize: 11, color: C.gold, fontWeight: "500", marginTop: 5 },

  tourCard: { marginTop: 12, borderWidth: 1, borderColor: "rgba(42,127,171,0.3)", borderRadius: 22, padding: 16, paddingVertical: 18 },
  tourHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  tourIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "rgba(42,127,171,0.18)", borderWidth: 1, borderColor: "rgba(42,127,171,0.3)", alignItems: "center", justifyContent: "center" },
  tourTitle: { fontSize: 13.5, fontWeight: "700", color: C.tp },
  tourSub: { fontSize: 10.5, color: C.ts },
  tourStops: { gap: 8 },
  tourStop: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  tourStopText: { fontSize: 10.5, color: C.tp, fontWeight: "500" },
  tourMore: { fontSize: 10.5, color: C.ts },

  simpleCard: { marginTop: 12, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 16, padding: 13, flexDirection: "row", alignItems: "center", gap: 10 },
  simpleIcon: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  simpleTitle: { fontSize: 12.5, fontWeight: "600", color: C.tp },
  simpleSub: { fontSize: 10.5, color: C.ts, marginTop: 1 },

  bizCard: { marginTop: 12, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 16, padding: 12, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  bizIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: "rgba(196,141,56,0.15)", borderWidth: 1, borderColor: "rgba(196,141,56,0.25)", alignItems: "center", justifyContent: "center" },
  bizName: { fontSize: 12.5, fontWeight: "600", color: C.tp, marginBottom: 1 },
  bizSub: { fontSize: 10.5, color: C.ts },
  rating: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 10.5, color: C.gold, fontWeight: "600" },

  aiCard: { marginTop: 12, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 22, overflow: "hidden" },
  aiHeader: { padding: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: C.b, flexDirection: "row", alignItems: "center", gap: 10 },
  aiIcon: { width: 30, height: 30, borderRadius: 9, backgroundColor: "rgba(113,40,206,0.18)", borderWidth: 1, borderColor: "rgba(113,40,206,0.28)", alignItems: "center", justifyContent: "center" },
  aiName: { fontSize: 12, fontWeight: "700", color: C.tp },
  aiOnline: { flexDirection: "row", alignItems: "center", gap: 4 },
  aiOnlineText: { fontSize: 9.5, color: C.green, fontWeight: "600" },
  aiBody: { padding: 12, paddingHorizontal: 14 },
  aiMsg: { flexDirection: "row", gap: 8, marginBottom: 10 },
  aiSmallIcon: { width: 24, height: 24, borderRadius: 7, backgroundColor: "rgba(113,40,206,0.18)", borderWidth: 1, borderColor: "rgba(113,40,206,0.28)", alignItems: "center", justifyContent: "center", marginTop: 2 },
  aiBubble: { maxWidth: "80%", padding: 9, paddingHorizontal: 12, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: C.b, borderTopLeftRadius: 4, borderTopRightRadius: 14, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, fontSize: 11.5, color: C.tp, lineHeight: 18 },
  aiChips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  aiChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, borderWidth: 1, borderColor: C.b, backgroundColor: C.surfHi },
  aiChipText: { fontSize: 10.5, color: C.tp, fontWeight: "500" },
  aiInput: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: C.b, borderRadius: 13, padding: 9, paddingLeft: 12 },
  aiPlaceholder: { flex: 1, fontSize: 11.5, color: C.tm },
  aiSend: { width: 28, height: 28, borderRadius: 9, alignItems: "center", justifyContent: "center" },

  pictureCard: { marginTop: 12, borderRadius: 22, borderWidth: 1, borderColor: C.b, overflow: "hidden", height: 188 },
  pictureImage: { flex: 1 },
  pictureOverlay: { ...StyleSheet.absoluteFillObject },
  pictureCamera: { position: "absolute", top: 12, right: 12, opacity: 0.55 },
  pictureCopy: { position: "absolute", left: 14, right: 14, bottom: 13 },
  pictureBadge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(8,1,26,0.55)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3, marginBottom: 8 },
  pictureBadgeText: { fontSize: 9.5, color: "#fff", fontWeight: "600" },
  pictureTitle: { fontSize: 15, fontWeight: "700", color: "#fff", marginBottom: 2 },
  pictureBy: { fontSize: 10.5, color: "rgba(255,255,255,0.7)" },

  factCard: { marginTop: 12, borderWidth: 1, borderColor: "rgba(113,40,206,0.28)", borderRadius: 22, padding: 20, paddingHorizontal: 18, alignItems: "center", overflow: "hidden" },
  factEmoji: { fontSize: 36, marginBottom: 10 },
  factCounter: { fontSize: 8.5, fontWeight: "700", color: C.gold, letterSpacing: 1.8, marginBottom: 8 },
  factText: { fontSize: 12.5, color: C.tp, lineHeight: 21, fontWeight: "500", textAlign: "center", marginBottom: 16 },
  factDots: { flexDirection: "row", gap: 5 },
  factDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.tm },
  factDotActive: { backgroundColor: C.gold },

  quizCard: { marginTop: 12, borderWidth: 1, borderColor: "rgba(196,141,56,0.25)", borderRadius: 22, padding: 16, paddingVertical: 17, overflow: "hidden" },
  quizTop: { flexDirection: "row", alignItems: "center", gap: 13, marginBottom: 14 },
  quizIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: "rgba(196,141,56,0.16)", borderWidth: 1, borderColor: "rgba(196,141,56,0.32)", alignItems: "center", justifyContent: "center" },
  quizTitle: { fontSize: 14.5, fontWeight: "700", color: C.tp },
  quizSub: { fontSize: 11, color: C.ts, marginTop: 3, lineHeight: 17 },
  quizArrow: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  quizBadges: { flexDirection: "row", gap: 8 },
  quizBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.surfHi, borderWidth: 1, borderColor: C.b, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 6 },
  quizBadgeText: { fontSize: 10, color: C.tp, fontWeight: "500" },

  devotionalCard: { marginTop: 12, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 22, overflow: "hidden" },
  devotionalHead: { paddingHorizontal: 16, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: C.b, flexDirection: "row", alignItems: "center", gap: 11 },
  devotionalIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "rgba(113,40,206,0.18)", borderWidth: 1, borderColor: "rgba(113,40,206,0.28)", alignItems: "center", justifyContent: "center" },
  devotionalKicker: { fontSize: 8.5, fontWeight: "700", color: C.gold, letterSpacing: 1.36, textTransform: "uppercase" },
  devotionalTitle: { fontSize: 14.5, fontWeight: "700", color: C.tp, marginTop: 2 },
  devotionalBody: { paddingHorizontal: 16, paddingVertical: 14 },
  verseBox: { backgroundColor: "rgba(196,141,56,0.08)", borderWidth: 1, borderColor: "rgba(196,141,56,0.2)", borderRadius: 13, paddingHorizontal: 13, paddingVertical: 11, marginBottom: 12 },
  verseText: { fontSize: 12, color: C.tp, fontStyle: "italic", lineHeight: 19, marginBottom: 5 },
  verseRef: { fontSize: 10.5, color: C.gold, fontWeight: "600" },
  devotionalText: { fontSize: 12, color: C.ts, lineHeight: 20, marginBottom: 13 },
  devotionalBottom: { flexDirection: "row", alignItems: "center", gap: 8 },
  readingPill: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.surfHi, borderWidth: 1, borderColor: C.b, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 9 },
  readingText: { fontSize: 11, color: C.tp, fontWeight: "500" },
  heartBtn: { width: 38, height: 38, borderRadius: 11, backgroundColor: C.surfHi, borderWidth: 1, borderColor: C.b, alignItems: "center", justifyContent: "center" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(2,0,8,0.62)" },
  openHeavensSheet: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#0F0A1E", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderBottomWidth: 0, borderColor: C.bHi, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 30 },
  openHeavensHead: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  openHeavensIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(113,40,206,0.18)", borderWidth: 1, borderColor: "rgba(113,40,206,0.3)", alignItems: "center", justifyContent: "center" },
  openHeavensTitle: { fontSize: 16, fontWeight: "800", color: C.tp },
  openHeavensSub: { fontSize: 11.5, color: C.ts, lineHeight: 17, marginTop: 3 },
  openHeavensNotice: { backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
  openHeavensNoticeText: { fontSize: 12, lineHeight: 19, color: C.ts },
  openHeavensPrimary: { height: 48, borderRadius: 15, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, marginBottom: 9 },
  openHeavensPrimaryText: { fontSize: 13, fontWeight: "800", color: "#fff" },
  openHeavensSecondary: { height: 46, borderRadius: 15, borderWidth: 1, borderColor: "rgba(196,141,56,0.28)", backgroundColor: "rgba(196,141,56,0.08)", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  openHeavensSecondaryText: { fontSize: 12.5, fontWeight: "800", color: C.gold },
  sheet: { position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "78%", backgroundColor: "#0F0A1E", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderBottomWidth: 0, borderColor: C.bHi, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 28 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.18)", alignSelf: "center", marginBottom: 14 },
  sheetTitle: { fontSize: 16, fontWeight: "700", color: C.tp, marginBottom: 12 },
  sheetRow: { backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 14, padding: 12, marginBottom: 9 },
  sheetText: { fontSize: 12, color: C.ts, lineHeight: 18 },
  weatherModalHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  weatherLocationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: -10 },
  weatherUpdated: { fontSize: 10.5, color: C.ts },
  closeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, alignItems: "center", justifyContent: "center" },
  weatherCurrent: { borderRadius: 20, borderWidth: 1, borderColor: "rgba(196,141,56,0.22)", paddingHorizontal: 16, paddingVertical: 18, flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 14 },
  weatherBigTemp: { fontSize: 36, fontWeight: "800", color: C.tp, lineHeight: 36 },
  weatherDesc: { fontSize: 11.5, color: C.ts, marginTop: 5 },
  weatherFeels: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.surfHi, borderWidth: 1, borderColor: C.b, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, alignSelf: "flex-start" },
  weatherFeelsText: { fontSize: 10, color: C.tp, fontWeight: "500" },
  weatherStats: { flexDirection: "row", gap: 9, marginBottom: 14 },
  weatherStat: { flex: 1, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 14, paddingHorizontal: 8, paddingVertical: 11, alignItems: "center" },
  weatherStatValue: { fontSize: 12.5, fontWeight: "700", color: C.tp, marginTop: 6 },
  weatherStatLabel: { fontSize: 9, color: C.tm, marginTop: 2 },
  weatherSectionLabel: { fontSize: 10.5, fontWeight: "700", color: C.ts, letterSpacing: 0.84, textTransform: "uppercase", marginBottom: 9 },
  weatherHourly: { gap: 8, marginBottom: 16 },
  weatherHour: { width: 54, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 14, paddingVertical: 10, alignItems: "center", gap: 7 },
  weatherHourActive: { backgroundColor: "rgba(113,40,206,0.12)", borderColor: "rgba(113,40,206,0.3)" },
  weatherHourTime: { fontSize: 9.5, color: C.ts, fontWeight: "500" },
  weatherHourTimeActive: { color: C.tp, fontWeight: "700" },
  weatherHourTemp: { fontSize: 11.5, fontWeight: "700", color: C.tp },
  weatherDays: { gap: 8 },
  weatherDay: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11 },
  weatherDayName: { flex: 1, fontSize: 12.5, fontWeight: "600", color: C.tp },
  weatherDayHi: { width: 30, textAlign: "right", fontSize: 12, fontWeight: "700", color: C.tp },
  weatherDayLo: { width: 26, textAlign: "right", fontSize: 12, color: C.tm },
});
