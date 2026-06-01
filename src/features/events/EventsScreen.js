// src/features/events/EventsScreen.js
import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, Calendar as CalendarIcon } from "lucide-react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../shared/config/firebase";
import EventCard from "./EventCard";
import { matchesRecurrence } from './recurrenceUtils';

// Web date picker component
const WebDatePicker = ({ value, onChange }) => (
  <input
    type="date"
    value={value.toISOString().split("T")[0]}
    onChange={(e) => onChange(new Date(e.target.value))}
    style={{
      backgroundColor: "#1A1528",
      color: "#EBE3D6",
      border: "1px solid rgba(113,40,206,0.4)",
      borderRadius: 12,
      padding: 10,
      fontSize: 16,
      width: "100%",
    }}
  />
);

export default function EventsScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const formattedDate = selectedDate.toISOString().split("T")[0];

  useEffect(() => {
    loadEvents();
  }, [selectedDate]);

  // In loadEvents function, after fetching regular events, also fetch recurring events.
  const loadEvents = async () => {
    setLoading(true);
    try {
      // 1) Get events with exact date match
      const exactQuery = query(
        collection(db, "events"),
        where("date", "==", formattedDate),
      );
      const exactSnap = await getDocs(exactQuery);
      let eventsList = exactSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 2) Get all events that have a recurrence field (and are not already exact matches)
      const recurringQuery = query(
        collection(db, "events"),
        where("recurrence", "!=", null),
      );
      const recurringSnap = await getDocs(recurringQuery);
      recurringSnap.forEach((doc) => {
        const data = doc.data();
        if (data.date !== formattedDate) {
          // avoid duplicate if exact match exists
          const selectedDateObj = new Date(formattedDate);
          const eventDateObj = new Date(data.date);
          if (matchesRecurrence(selectedDateObj, data.recurrence, data.date)) {
            eventsList.push({ id: doc.id, ...data, isRecurring: true });
          }
        }
      });

      setEvents(eventsList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#0F0A1E", "#08011A"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ChevronLeft size={24} color="#EBE3D6" />
        </TouchableOpacity>
        <Text style={styles.title}>Events</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.content}
      >
        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setShowDatePicker(true)}
          >
            <CalendarIcon size={20} color="#C48D38" />
            <Text style={styles.dateText}>{formattedDate}</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#7128CE"
            style={styles.loader}
          />
        ) : events.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No events on this day</Text>
          </View>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() =>
                navigation.navigate("EventDetail", { eventId: event.id })
              }
            />
          ))
        )}
      </ScrollView>

      {/* Date picker modal – adapts to web vs native */}
      <Modal transparent visible={showDatePicker} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {Platform.OS === "web" ? (
              <WebDatePicker value={selectedDate} onChange={onDateChange} />
            ) : (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, date) => onDateChange(date)}
              />
            )}
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#08011A" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: { padding: 8 },
  title: { fontSize: 20, fontWeight: "700", color: "#EBE3D6" },
  content: { padding: 16 },
  dateSection: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8C7DA0",
    marginBottom: 8,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  dateText: { fontSize: 16, color: "#EBE3D6" },
  loader: { marginTop: 40 },
  empty: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#8C7DA0", fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1A1528",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  closeModalBtn: { marginTop: 20, padding: 10 },
  closeModalText: { color: "#C48D38", fontSize: 16, fontWeight: "600" },
});
