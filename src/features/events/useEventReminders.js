// src/features/events/useEventReminders.js
import { Platform } from 'react-native';

// Local notifications – only import on native (not web)
let Notifications;
try {
  Notifications = require('expo-notifications');
  // Configure the handler once (only on native)
  if (Notifications) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }
} catch (e) {
  console.warn('expo-notifications not available, reminders disabled');
}

// Helper: convert "6:00 PM" or "18:00" to 24‑hour format
function parseTimeTo24Hour(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return { hour: 12, minute: 0 };
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return { hour, minute };
}

export async function scheduleEventReminders(event, reminderSettings) {
  // If notifications module is not available, silently ignore
  if (!Notifications || Platform.OS === 'web') return;

  const { date, time, title, id } = event;
  const [year, month, day] = date.split('-');
  const { hour, minute } = parseTimeTo24Hour(time);
  const eventDate = new Date(year, month - 1, day, hour, minute);

  // Cancel existing notifications
  await Notifications.cancelScheduledNotificationAsync(`${id}_day_before`).catch(() => {});
  await Notifications.cancelScheduledNotificationAsync(`${id}_day_of`).catch(() => {});

  if (reminderSettings.reminderDayBefore) {
    const dayBefore = new Date(eventDate);
    dayBefore.setDate(dayBefore.getDate() - 1);
    dayBefore.setHours(9, 0, 0);
    if (dayBefore > new Date()) {
      await Notifications.scheduleNotificationAsync({
        identifier: `${id}_day_before`,
        content: {
          title: 'Event Reminder',
          body: `Tomorrow: ${title}`,
          data: { eventId: id },
        },
        trigger: { date: dayBefore },
      }).catch(e => console.warn('Failed to schedule day-before reminder', e));
    }
  }

  if (reminderSettings.reminderDayOf) {
    const dayOf = new Date(eventDate);
    dayOf.setHours(dayOf.getHours() - 1);
    if (dayOf > new Date()) {
      await Notifications.scheduleNotificationAsync({
        identifier: `${id}_day_of`,
        content: {
          title: 'Event Starting Soon',
          body: `${title} starts in 1 hour!`,
          data: { eventId: id },
        },
        trigger: { date: dayOf },
      }).catch(e => console.warn('Failed to schedule day-of reminder', e));
    }
  }
}