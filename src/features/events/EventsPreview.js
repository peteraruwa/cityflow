import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react-native";
import SectionHeader from "../../shared/components/SectionHeader";
import { C } from "../../shared/constants/theme";
import { EVENTS } from "./eventsData";

export default function EventsPreview({ onSeeAllPress, onEventPress }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollInterval = useRef(null);

  useEffect(() => {
    autoScrollInterval.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % EVENTS.length);
    }, 5000);
    return () => clearInterval(autoScrollInterval.current);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % EVENTS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + EVENTS.length) % EVENTS.length);
  const event = EVENTS[currentIndex];

  return (
    <View style={styles.section}>
      <SectionHeader title="Upcoming Events" action="See All" onAction={onSeeAllPress} />
      <LinearGradient
        colors={["rgba(113,40,206,0.12)", "rgba(10,2,24,0.9)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <TouchableOpacity style={styles.cardContent} onPress={() => onEventPress(event.id)} activeOpacity={0.85}>
          <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
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
            <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.navRow}>
          <TouchableOpacity style={styles.prevBtn} onPress={prev} activeOpacity={0.8}>
            <ChevronLeft size={14} color="#EBE3D6" strokeWidth={2} />
            <Text style={styles.prevTxt}> Prev</Text>
          </TouchableOpacity>
          <View style={styles.dots}>
            {EVENTS.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setCurrentIndex(i)}>
                <View style={[styles.dot, i === currentIndex && styles.dotActive]} />
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
  card: { borderRadius: 24, borderWidth: 1, borderColor: "rgba(113,40,206,0.3)", padding: 18, marginTop: 8 },
  cardContent: { gap: 10 },
  eventTitle: { fontSize: 16, fontWeight: "600", color: "#EBE3D6", marginBottom: 6 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { fontSize: 13, color: "#8C7DA0", flex: 1 },
  navRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.06)" },
  prevBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.04)" },
  prevTxt: { fontSize: 12, fontWeight: "600", color: "#EBE3D6" },
  dots: { flexDirection: "row", gap: 6, alignItems: "center" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#504460" },
  dotActive: { backgroundColor: "#C48D38" },
  nextBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  nextTxt: { fontSize: 12, fontWeight: "600", color: "#fff" },
});
