// src/features/events/EventsPreview.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react-native";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../shared/config/firebase";
import SectionHeader from "../../shared/components/SectionHeader";
import { C } from "../../shared/constants/theme";

export default function EventsPreview({ onSeeAllPress, onEventPress }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollInterval = useRef(null);

  useEffect(() => {
    loadUpcomingEvents();
    return () => clearInterval(autoScrollInterval.current);
  }, []);

  // Auto‑scroll every 5 seconds when events are loaded
  useEffect(() => {
    if (events.length > 0) {
      autoScrollInterval.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
      }, 5000);
    }
    return () => clearInterval(autoScrollInterval.current);
  }, [events]);

  const loadUpcomingEvents = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const oneYearLater = new Date(today);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      // Fetch all events (limit to 50 to avoid huge queries)
      const eventsRef = collection(db, "events");
      const snapshot = await getDocs(eventsRef);
      const allEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Expand recurring events into occurrences within the next year
      const expanded = [];
      for (const ev of allEvents) {
        if (ev.recurrence && ev.recurrence.type === "monthly") {
          // Generate all occurrences from ev.date up to oneYearLater
          const startDate = new Date(ev.date);
          let current = new Date(startDate);
          while (current <= oneYearLater) {
            // For simplicity, we only generate the same day-of-month pattern
            // For "last Friday", we need custom logic; we'll use matchesRecurrence
            const occurrenceDate = new Date(current);
            if (matchesRecurrence(occurrenceDate, ev.recurrence, ev.date)) {
              expanded.push({
                ...ev,
                occurrenceDate: occurrenceDate.toISOString().split("T")[0],
              });
            }
            // Move to next month
            current.setMonth(current.getMonth() + 1);
          }
        } else {
          // Non‑recurring events
          expanded.push({ ...ev, occurrenceDate: ev.date });
        }
      }

      // Filter upcoming (occurrenceDate >= today) and sort
      const upcoming = expanded
        .filter((item) => new Date(item.occurrenceDate) >= today)
        .sort((a, b) => new Date(a.occurrenceDate) - new Date(b.occurrenceDate))
        .slice(0, 3);

      setEvents(
        upcoming.map((item) => ({
          ...item,
          date: item.occurrenceDate,
        })),
      );
    } catch (error) {
      console.error("Error loading upcoming events:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const next = () => setCurrentIndex((prev) => (prev + 1) % events.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);

  if (loading) {
    return (
      <View style={styles.section}>
        <SectionHeader
          title="Upcoming Events"
          action="See All"
          onAction={onSeeAllPress}
        />
        <ActivityIndicator
          size="small"
          color={C.gold}
          style={{ marginTop: 12 }}
        />
      </View>
    );
  }

  if (events.length === 0) return null;

  const event = events[currentIndex];

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Upcoming Events"
        action="See All"
        onAction={onSeeAllPress}
      />
      <LinearGradient
        colors={["rgba(113,40,206,0.12)", "rgba(10,2,24,0.9)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => onEventPress(event.id)}
          activeOpacity={0.85}
        >
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event.title}
          </Text>
          <View style={styles.detailRow}>
            <Calendar size={14} color={C.gold} />
            <Text style={styles.detailText}>{event.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={14} color={C.gold} />
            <Text style={styles.detailText}>{event.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={14} color={C.gold} />
            <Text style={styles.detailText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Navigation buttons and dots */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.prevBtn}
            onPress={prev}
            activeOpacity={0.8}
          >
            <ChevronLeft size={14} color="#EBE3D6" strokeWidth={2} />
            <Text style={styles.prevTxt}> Prev</Text>
          </TouchableOpacity>
          <View style={styles.dots}>
            {events.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setCurrentIndex(i)}>
                <View
                  style={[styles.dot, i === currentIndex && styles.dotActive]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={next} activeOpacity={0.85}>
            <LinearGradient
              colors={["#7128CE", "#5A18A8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextBtn}
            >
              <Text style={styles.nextTxt}>Next </Text>
              <ChevronRight size={14} color="#fff" strokeWidth={2} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 18, marginBottom: 22 },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(113,40,206,0.3)",
    padding: 18,
    marginTop: 8,
  },
  cardContent: { gap: 10 },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EBE3D6",
    marginBottom: 6,
  },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { fontSize: 13, color: "#8C7DA0", flex: 1 },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  prevBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  prevTxt: { fontSize: 12, fontWeight: "600", color: "#EBE3D6" },
  dots: { flexDirection: "row", gap: 6, alignItems: "center" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#504460" },
  dotActive: { backgroundColor: "#C48D38" },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nextTxt: { fontSize: 12, fontWeight: "600", color: "#fff" },
});
