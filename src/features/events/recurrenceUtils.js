// src/features/events/recurrenceUtils.js

/**
 * Check if a given date matches the recurrence rule of an event.
 * @param {Date} date - The date to test (user's selected date).
 * @param {Object} recurrence - The recurrence object from Firestore.
 * @param {string} recurrence.type - "monthly" (for now, can extend to "weekly" later).
 * @param {number} recurrence.dayOfWeek - 0=Sunday ... 6=Saturday.
 * @param {number} recurrence.weekOfMonth - 1=first, 2=second, 3=third, 4=fourth, -1=last.
 * @param {string} eventStartDate - The base date of the event (YYYY-MM-DD).
 * @returns {boolean}
 */
export function matchesRecurrence(date, recurrence, eventStartDate) {
  if (!recurrence || recurrence.type !== 'monthly') return false;

  const targetYear = date.getFullYear();
  const targetMonth = date.getMonth(); // 0-11

  // Find all days in target month that match the weekday
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const matchingDays = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(targetYear, targetMonth, d);
    if (dt.getDay() === recurrence.dayOfWeek) {
      matchingDays.push(d);
    }
  }

  let targetDay;
  if (recurrence.weekOfMonth === -1) {
    targetDay = matchingDays[matchingDays.length - 1];
  } else {
    const idx = recurrence.weekOfMonth - 1;
    targetDay = matchingDays[idx];
  }
  if (!targetDay) return false;

  // Ensure the target date is on or after the event's start date
  const start = new Date(eventStartDate);
  const candidate = new Date(targetYear, targetMonth, targetDay);
  return candidate >= start && date.toDateString() === candidate.toDateString();
}