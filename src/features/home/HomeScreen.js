// src/features/home/HomeScreen.js
// ============================================================
// IMPORTS
// ============================================================
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Linking,
  Modal,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import {
  MapPin,
  Search,
  Bell,
  Navigation,
  Building2,
  Clock,
  Leaf,
  Coffee,
  BookOpen,
  Radio,
  AlertCircle,
  Bot,
  Send,
  ChevronRight,
  Star,
  Siren,
  Utensils,
} from "lucide-react-native";

// Shared
import { C } from "../../shared/constants/theme";
import SectionHeader from "../../shared/components/SectionHeader";
import PulsingDot from "../../shared/components/PulsingDot";
import { TODAYS_OPEN_HEAVEN } from "../../shared/data/devotional";
import { getActions } from "../../shared/data/actions";

// Features
import QuoteOfTheDay from "../quote-day/QuoteOfTheDay";
import WeatherWidget from "../weather-widget/WeatherWidget";
import PictureOfTheDay from "../picture-day/PictureOfTheDay";
import OpenHeavenDevotional from "../devotional/OpenHeavenDevotional";
import NotificationsPanel from "../notifications/NotificationsPanel";
import EventsPreview from "../events/EventsPreview";
import FindAChurchSection from "../find-a-church/FindAChurchSection";

// Firebase
import { auth } from "../../shared/config/firebase";

// ─── Constants ────────────────────────────────────────────────────────────────
const IOS_TOP = Platform.OS === "ios" ? 52 : (StatusBar.currentHeight ?? 28);
const GOLD = "#C48D38";
const PURPLE = "#7128CE";
const PURPLE_L = "#8B5CF6";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT_PRI = "#EBE3D6";
const TEXT_SEC = "#8C7DA0";
const TEXT_MUT = "#504460";
const BG = "#08011A";

// ─── Layout tokens ────────────────────────────────────────────────────────────
const H_PAD = 18;       // horizontal page padding
const SECTION_MB = 22;  // margin-bottom between sections
const CARD_RADIUS = 22; // default card border-radius
const CARD_PAD = 18;    // default card internal padding
const ICON_SIZE = 38;   // standard icon container size
const ICON_RADIUS = 12; // standard icon container border-radius

// ============================================================
// COMPONENT
// ============================================================
export default function HomeScreen() {
  const navigation = useNavigation();
  const liveDot = useRef(new Animated.Value(1)).current;

  const [notificationsUnread, setNotificationsUnread] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const ACTIONS = getActions(navigation);

  // ── Animate live dot ──────────────────────────────────────
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(liveDot, { toValue: 0.25, duration: 800, useNativeDriver: false }),
        Animated.timing(liveDot, { toValue: 1, duration: 800, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // ── Demo unread dot ───────────────────────────────────────
  useEffect(() => { setNotificationsUnread(true); }, []);

  // ── Firebase user name ────────────────────────────────────
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const name = user.displayName;
      if (name) {
        setUserName(name.split(" ")[0]);
      } else if (user.email) {
        setUserName(user.email.split("@")[0]);
      }
    }
  }, []);

  // ── Helpers ───────────────────────────────────────────────
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  // ──────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* ── App Header ───────────────────────────────────── */}
      <View style={s.header}>
        <View>
          <Text style={s.brand}>CityFlow</Text>
          <View style={s.locRow}>
            <MapPin size={9} color={GOLD} strokeWidth={2.5} />
            <Text style={s.locTxt}> Redemption City · 110115</Text>
          </View>
        </View>
        <View style={s.headerActions}>
          <TouchableOpacity
            style={s.headerBtn}
            onPress={() => navigation.navigate("Search")}
            activeOpacity={0.7}
          >
            <Search size={15} color={TEXT_SEC} strokeWidth={1.8} />
          </TouchableOpacity>
          <TouchableOpacity
            style={s.headerBtn}
            onPress={() => setShowNotifications(true)}
            activeOpacity={0.7}
          >
            <Bell size={15} color={TEXT_SEC} strokeWidth={1.8} />
            {notificationsUnread && <View style={s.notifDot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Thin rule under header ───────────────────────── */}
      <View style={s.headerRule} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >

        {/* ── Greeting + Weather ─────────────────────────── */}
        <View style={s.greetWrap}>
          <View style={s.greetRow}>
            <View style={s.greetText}>
              <Text style={s.greetName}>{getGreeting()},</Text>
              <Text style={s.greetUser}>{userName} 👋</Text>
              <Text style={s.greetSub}>Welcome to Redemption City of God</Text>
            </View>
            <WeatherWidget />
          </View>
        </View>

        {/* ── Quote of the Day ───────────────────────────── */}
        <QuoteOfTheDay />

        {/* ── Hero Card ──────────────────────────────────── */}
        <View style={s.heroWrap}>
          <LinearGradient
            colors={["rgba(90,18,165,0.96)", "rgba(38,8,75,0.98)", "rgba(10,2,24,1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.heroCard}
          >
            <View style={s.heroTopRow}>
              <View style={s.liveChip}>
                <PulsingDot size={5} color="#F06565" />
                <Text style={s.liveTxt}> LIVE NOW</Text>
              </View>
              <View style={s.heroDivLine} />
              <Text style={s.heroDateTxt}>Today</Text>
            </View>

            <Text style={s.heroTitle}>Sunday Victory Service</Text>

            <View style={s.heroMeta}>
              <View style={s.heroMetaRow}>
                <Building2 size={11} color={GOLD} strokeWidth={1.8} />
                <Text style={s.heroMetaTxt}> Main Auditorium · Redemption City</Text>
              </View>
              <View style={s.heroMetaRow}>
                <Clock size={11} color={GOLD} strokeWidth={1.8} />
                <Text style={s.heroMetaTxt}> 8:00 AM – 11:30 AM</Text>
              </View>
            </View>

            <View style={s.heroBtns}>
              <TouchableOpacity style={s.heroBtn1} activeOpacity={0.85}>
                <Navigation size={12} color="#fff" strokeWidth={2.5} />
                <Text style={s.heroBtnTxt1}> Get Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.heroBtn2} activeOpacity={0.85}>
                <Text style={s.heroBtnTxt2}>View Details</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* ── Emergency Banner ───────────────────────────── */}
        <TouchableOpacity
          style={s.sosBanner}
          onPress={() => navigation.navigate("Emergency")}
          activeOpacity={0.85}
        >
          <View style={s.sosIcon}>
            <Siren size={18} color="#F06565" strokeWidth={1.8} />
          </View>
          <View style={s.sosInfo}>
            <Text style={s.sosTitle}>Emergency / SOS</Text>
            <View style={s.sosNumbers}>
              {[["199", "Ambulance"], ["112", "Police"], ["190", "Fire"], ["122", "Road"]].map(
                ([n, l]) => (
                  <Text key={n} style={s.sosNum}>
                    {n} <Text style={s.sosLabel}>{l} </Text>
                  </Text>
                )
              )}
            </View>
          </View>
          <PulsingDot size={7} color="#F06565" style={{ marginRight: 4 }} />
          <ChevronRight size={13} color="#F06565" strokeWidth={2} />
        </TouchableOpacity>

        {/* ── Quick Actions ──────────────────────────────── */}
        {/* "Find Your Way" card removed — navigation is already included via getActions() */}
        <View style={s.section}>
          <SectionHeader title="Quick Actions" />
          <View style={s.actionsGrid}>
            {ACTIONS.map(({ Icon, label, sub, color, onPress }, i) => (
              <TouchableOpacity
                key={i}
                style={s.actionCard}
                onPress={onPress}
                activeOpacity={0.8}
              >
                <View style={[s.actionIcon, { backgroundColor: `${color}1A`, borderColor: `${color}28` }]}>
                  <Icon size={18} color={color} strokeWidth={1.8} />
                </View>
                <Text style={s.actionLabel}>{label}</Text>
                <Text style={s.actionSub}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Upcoming Events ────────────────────────────── */}
        <EventsPreview
          onSeeAllPress={() => navigation.navigate("Events")}
          onEventPress={(eventId) => navigation.navigate("EventDetail", { eventId })}
        />

        {/* ── Updates ────────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader title="Updates" />
          <View style={s.updatesList}>
            {[
              {
                Icon: Radio,
                color: PURPLE,
                title: "Monthly Thanksgiving Service",
                body: "Join us Saturday at 6PM for a special celebration.",
                time: "2h ago",
              },
              {
                Icon: AlertCircle,
                color: "#D44F4F",
                title: "Lost: Black Wallet — Gate B",
                body: "A black leather wallet was found at Gate B.",
                time: "4h ago",
              },
              {
                Icon: Navigation,
                color: GOLD,
                title: "Camp Road Closure",
                body: "Main Camp Road closed 10AM–2PM. Use Alternative Route 2.",
                time: "1h ago",
              },
            ].map(({ Icon, color, title, body, time }, i) => (
              <View key={i} style={s.updateCard}>
                <View style={[s.updateIcon, { backgroundColor: `${color}18`, borderColor: `${color}28` }]}>
                  <Icon size={15} color={color} strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={s.updateTopRow}>
                    <Text style={s.updateTitle} numberOfLines={1}>{title}</Text>
                    <Text style={s.updateTime}>{time}</Text>
                  </View>
                  <Text style={s.updateBody} numberOfLines={2}>{body}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── City Tour ──────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title="Redemption City Tour"
            action="Explore"
            onAction={() => navigation.navigate("CityTour")}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("CityTour")}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["rgba(42,127,171,0.22)", "rgba(10,2,24,1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.tourCard}
            >
              <View style={s.tourHeader}>
                <View style={s.tourIcon}>
                  <Navigation size={17} color="#2A7FAB" strokeWidth={1.8} />
                </View>
                <View>
                  <Text style={s.tourTitle}>Guided City Tour</Text>
                  <Text style={s.tourSub}>8 stops · ~2 hours · Self-paced</Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tourStops}>
                {[
                  { Icon: Building2, name: "Main Auditorium", color: "#6B35C0" },
                  { Icon: Leaf, name: "Prayer Mountain", color: "#4A8A5A" },
                  { Icon: Coffee, name: "Camp Restaurant", color: "#C48D38" },
                  { Icon: BookOpen, name: "Bookshop", color: "#9B5E3A" },
                ].map(({ Icon, name, color }, i) => (
                  <View
                    key={i}
                    style={[s.tourStop, { backgroundColor: `${color}14`, borderColor: `${color}25` }]}
                  >
                    <Icon size={11} color={color} strokeWidth={2} />
                    <Text style={s.tourStopTxt}>{name}</Text>
                  </View>
                ))}
                <View style={[s.tourStop, { backgroundColor: C.surfHi, borderColor: C.b }]}>
                  <Text style={{ fontSize: 10.5, color: C.ts }}>+4 more</Text>
                </View>
              </ScrollView>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── Find a Church ──────────────────────────────── */}
        <FindAChurchSection navigation={navigation} />

        {/* ── Business Directory ─────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title="Business Directory"
            action="See all"
            onAction={() => navigation.navigate("BusinessDirectory")}
          />
          <TouchableOpacity
            style={s.bizFeatured}
            onPress={() => navigation.navigate("BusinessDirectory")}
            activeOpacity={0.8}
          >
            <View style={s.bizIcon}>
              <Utensils size={15} color={GOLD} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.bizName}>Camp Restaurant</Text>
              <Text style={s.bizSub}>Open · 7AM–9PM · Tap to call</Text>
            </View>
            <View style={s.ratingRow}>
              <Star size={9} color={GOLD} fill={GOLD} strokeWidth={0} />
              <Text style={s.ratingTxt}> 4.3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── CityFlow AI ────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title="CityFlow AI"
            action="Open chat"
            onAction={() => navigation.navigate("AIAssistant")}
          />
          <View style={s.aiCard}>
            <View style={s.aiHeader}>
              <View style={s.aiAvatar}>
                <Bot size={14} color={PURPLE_L} strokeWidth={2} />
              </View>
              <View>
                <Text style={s.aiName}>CityFlow AI</Text>
                <View style={s.aiStatusRow}>
                  <PulsingDot size={5} color={C.green} />
                  <Text style={s.aiStatus}> Online</Text>
                </View>
              </View>
            </View>
            <View style={s.aiMsg}>
              <View style={s.aiMsgAvatar}>
                <Bot size={11} color={PURPLE_L} strokeWidth={2} />
              </View>
              <View style={s.aiBubble}>
                <Text style={s.aiBubbleTxt}>
                  Hi! I'm your CityFlow AI. Ask me anything about Redemption City.
                </Text>
              </View>
            </View>
            <View style={s.aiChips}>
              {["Find a restaurant", "Book a CityRide", "Emergency contacts"].map((q) => (
                <TouchableOpacity
                  key={q}
                  style={s.aiChip}
                  onPress={() => navigation.navigate("AIAssistant")}
                >
                  <Text style={s.aiChipTxt}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={s.aiInputRow}
              onPress={() => navigation.navigate("AIAssistant")}
            >
              <Text style={s.aiPlaceholder}>Ask me anything about the city…</Text>
              <View style={s.aiSendBtn}>
                <Send size={12} color="#fff" strokeWidth={2} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Picture of the Day ─────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title="Picture of the Day"
            action="View Gallery"
            onAction={() => navigation.navigate("PictureGallery")}
          />
          <PictureOfTheDay navigation={navigation} />
        </View>

        {/* ── Did You Know ───────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title="Did You Know?"
            action="See all"
            onAction={() => navigation.navigate("FunFacts")}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("FunFacts")}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["rgba(113,40,206,0.18)", "rgba(10,2,24,1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.factCard}
            >
              <Text style={s.factEmoji}>🏙️</Text>
              <Text style={s.factCounter}>FACT 1 OF 8</Text>
              <Text style={s.factTxt}>
                Redemption City was officially commissioned in 1999 and now hosts over 1 million visitors annually during major conventions.
              </Text>
              <View style={s.factDots}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <View key={i} style={[s.factDot, i === 0 && { backgroundColor: GOLD }]} />
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── Quiz ───────────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title="Know Your City Quiz"
            action="Play"
            onAction={() => navigation.navigate("Quiz")}
          />
          <TouchableOpacity onPress={() => navigation.navigate("Quiz")} activeOpacity={0.85}>
            <LinearGradient
              colors={["rgba(196,141,56,0.16)", "rgba(10,2,24,1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.quizCard}
            >
              <Text style={s.quizEmoji}>🏙️</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.quizTitle}>Know Your City</Text>
                <Text style={s.quizSub}>8 questions about Redemption City.</Text>
                <View style={s.quizBadges}>
                  {[["📋", "8 Qs"], ["⏱️", "~3 min"], ["🏆", "Earn badge"]].map(([ic, lb]) => (
                    <View key={lb} style={s.quizBadge}>
                      <Text style={{ fontSize: 10 }}>{ic}</Text>
                      <Text style={s.quizBadgeTxt}> {lb}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── Open Heaven Devotional ─────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title="Open Heaven Devotional"
            action="Read Full"
            onAction={() => Linking.openURL(TODAYS_OPEN_HEAVEN.link)}
          />
          <OpenHeavenDevotional />
        </View>

      </ScrollView>

      {/* ── Notifications Modal ────────────────────────────── */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <Pressable style={s.modalOverlay} onPress={() => setShowNotifications(false)} />
        <View style={s.notificationPanel}>
          <View style={s.panelHandle} />
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        </View>
      </Modal>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: { paddingBottom: 32 },

  // ── Header ────────────────────────────────────────────────
  header: {
    paddingHorizontal: H_PAD,
    paddingTop: IOS_TOP,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: BG,
  },
  headerRule: {
    height: 1,
    marginHorizontal: H_PAD,
    backgroundColor: "rgba(255,255,255,0.055)",
    marginBottom: 4,
  },
  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: TEXT_PRI,
    letterSpacing: 3.5,
  },
  locRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  locTxt: { fontSize: 10, color: TEXT_MUT, letterSpacing: 0.3 },
  headerActions: { flexDirection: "row", gap: 8 },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: ICON_RADIUS,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: GOLD,
    borderWidth: 1.5,
    borderColor: BG,
  },

  // ── Greeting ──────────────────────────────────────────────
  greetWrap: {
    paddingHorizontal: H_PAD,
    paddingTop: 18,
    paddingBottom: 18,
  },
  greetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetText: { flex: 1, paddingRight: 12 },
  greetName: {
    fontSize: 14,
    fontWeight: "500",
    color: TEXT_SEC,
    letterSpacing: 0.2,
  },
  greetUser: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT_PRI,
    lineHeight: 30,
    letterSpacing: 0.2,
  },
  greetSub: { fontSize: 11.5, color: TEXT_MUT, marginTop: 4 },

  // ── Hero ──────────────────────────────────────────────────
  heroWrap: { paddingHorizontal: H_PAD, marginBottom: SECTION_MB },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(110,50,190,0.32)",
    padding: CARD_PAD,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  liveChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(215,55,55,0.18)",
    borderWidth: 1,
    borderColor: "rgba(225,75,75,0.28)",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  liveTxt: { fontSize: 9, fontWeight: "700", color: "#F06565", letterSpacing: 1.5 },
  heroDivLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.07)" },
  heroDateTxt: { fontSize: 10, color: TEXT_MUT },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: TEXT_PRI,
    lineHeight: 26,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  heroMeta: { gap: 5, marginBottom: 18 },
  heroMetaRow: { flexDirection: "row", alignItems: "center" },
  heroMetaTxt: { fontSize: 11.5, color: TEXT_SEC },
  heroBtns: { flexDirection: "row", gap: 10 },
  heroBtn1: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: PURPLE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBtnTxt1: { fontSize: 12.5, fontWeight: "700", color: "#fff" },
  heroBtn2: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  heroBtnTxt2: { fontSize: 12.5, fontWeight: "600", color: TEXT_PRI },

  // ── SOS Banner ────────────────────────────────────────────
  sosBanner: {
    marginHorizontal: H_PAD,
    marginBottom: SECTION_MB,
    backgroundColor: "rgba(212,79,79,0.09)",
    borderWidth: 1,
    borderColor: "rgba(212,79,79,0.28)",
    borderRadius: CARD_RADIUS,
    padding: CARD_PAD,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sosIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_RADIUS,
    backgroundColor: "rgba(212,79,79,0.18)",
    borderWidth: 1,
    borderColor: "rgba(212,79,79,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  sosInfo: { flex: 1 },
  sosTitle: { fontSize: 13, fontWeight: "700", color: "#F06565", marginBottom: 3 },
  sosNumbers: { flexDirection: "row", flexWrap: "wrap", gap: 2 },
  sosNum: { fontSize: 10, color: "rgba(240,101,101,0.7)", fontWeight: "600" },
  sosLabel: { fontWeight: "400", color: TEXT_MUT },

  // ── Sections ──────────────────────────────────────────────
  section: { paddingHorizontal: H_PAD, marginBottom: SECTION_MB },

  // ── Actions ───────────────────────────────────────────────
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 14 },
  actionCard: {
    width: "47%",
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: CARD_RADIUS,
    padding: 16,
  },
  actionIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_RADIUS,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  actionLabel: { fontSize: 13.5, fontWeight: "700", color: TEXT_PRI, marginBottom: 2 },
  actionSub: { fontSize: 11, color: TEXT_SEC },

  // ── AI ────────────────────────────────────────────────────
  aiCard: {
    marginTop: 12,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
  },
  aiHeader: {
    padding: CARD_PAD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "rgba(113,40,206,0.18)",
    borderWidth: 1,
    borderColor: "rgba(113,40,206,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  aiName: { fontSize: 12, fontWeight: "700", color: TEXT_PRI },
  aiStatusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  aiStatus: { fontSize: 9.5, color: "#3DAA6A", fontWeight: "600" },
  aiMsg: {
    padding: CARD_PAD,
    paddingBottom: 0,
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  aiMsgAvatar: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: "rgba(113,40,206,0.18)",
    borderWidth: 1,
    borderColor: "rgba(113,40,206,0.28)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  aiBubble: {
    flex: 1,
    padding: 9,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    borderTopLeftRadius: 4,
  },
  aiBubbleTxt: { fontSize: 11.5, color: TEXT_PRI, lineHeight: 17 },
  aiChips: {
    paddingHorizontal: CARD_PAD,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  aiChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
  },
  aiChipTxt: { fontSize: 10.5, color: TEXT_PRI, fontWeight: "500" },
  aiInputRow: {
    margin: CARD_PAD,
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    padding: 9,
    paddingLeft: 12,
  },
  aiPlaceholder: { flex: 1, fontSize: 11.5, color: TEXT_MUT },
  aiSendBtn: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Tour ──────────────────────────────────────────────────
  tourCard: {
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: "rgba(42,127,171,0.3)",
    padding: CARD_PAD,
    marginTop: 12,
  },
  tourHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  tourIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_RADIUS,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "rgba(42,127,171,0.18)",
    borderColor: "rgba(42,127,171,0.3)",
  },
  tourTitle: { fontSize: 13.5, fontWeight: "700", color: TEXT_PRI },
  tourSub: { fontSize: 10.5, color: TEXT_SEC },
  tourStops: { flexDirection: "row" },
  tourStop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  tourStopTxt: { fontSize: 10.5, color: TEXT_PRI, fontWeight: "500" },

  // ── Biz ───────────────────────────────────────────────────
  bizFeatured: {
    marginTop: 12,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: CARD_PAD,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bizIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_RADIUS,
    backgroundColor: "rgba(196,141,56,0.15)",
    borderWidth: 1,
    borderColor: "rgba(196,141,56,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  bizName: { fontSize: 13, fontWeight: "600", color: TEXT_PRI, marginBottom: 1 },
  bizSub: { fontSize: 10.5, color: TEXT_SEC },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingTxt: { fontSize: 10.5, color: GOLD, fontWeight: "600" },

  // ── Fact ──────────────────────────────────────────────────
  factCard: {
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: "rgba(113,40,206,0.28)",
    padding: CARD_PAD,
    alignItems: "center",
    marginTop: 12,
  },
  factEmoji: { fontSize: 38, marginBottom: 10 },
  factCounter: {
    fontSize: 8.5,
    fontWeight: "700",
    color: GOLD,
    letterSpacing: 3,
    marginBottom: 8,
  },
  factTxt: {
    fontSize: 13,
    color: TEXT_PRI,
    lineHeight: 21,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
  },
  factDots: { flexDirection: "row", gap: 5 },
  factDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: TEXT_MUT },

  // ── Quiz ──────────────────────────────────────────────────
  quizCard: {
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: "rgba(196,141,56,0.25)",
    padding: CARD_PAD,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 12,
  },
  quizEmoji: { fontSize: 44 },
  quizTitle: { fontSize: 14, fontWeight: "700", color: TEXT_PRI, marginBottom: 4 },
  quizSub: { fontSize: 11, color: TEXT_SEC, lineHeight: 16, marginBottom: 10 },
  quizBadges: { flexDirection: "row", gap: 8 },
  quizBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACE,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quizBadgeTxt: { fontSize: 9.5, color: TEXT_SEC },

  // ── Updates ───────────────────────────────────────────────
  updatesList: { gap: 9, marginTop: 14 },
  updateCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: CARD_PAD,
    flexDirection: "row",
    gap: 12,
  },
  updateIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    flexShrink: 0,
  },
  updateTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  updateTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_PRI,
    flex: 1,
    marginRight: 8,
    lineHeight: 18,
  },
  updateTime: { fontSize: 10, color: TEXT_MUT },
  updateBody: { fontSize: 11.5, color: TEXT_SEC, lineHeight: 16 },

  // ── Modal ─────────────────────────────────────────────────
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  notificationPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0F0A1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
});