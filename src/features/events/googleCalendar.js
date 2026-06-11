import { Linking } from 'react-native';

function parseTimeRange(date, time) {
  const [startRaw, endRaw] = String(time || '').split('-').map((v) => v.trim());
  const parseOne = (raw, fallbackHour) => {
    const match = String(raw || '').match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return { hour: fallbackHour, minute: 0 };
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const period = match[3]?.toUpperCase();
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return { hour, minute };
  };
  const [year, month, day] = date.split('-').map(Number);
  const start = parseOne(startRaw, 8);
  const end = parseOne(endRaw, start.hour + 2);
  return {
    startDate: new Date(year, month - 1, day, start.hour, start.minute),
    endDate: new Date(year, month - 1, day, end.hour, end.minute),
  };
}

function googleDate(value) {
  return value.toISOString().replace(/[-:]|\.\d{3}/g, '');
}

export function getGoogleCalendarUrl(event) {
  const { startDate, endDate } = parseTimeRange(event.date, event.time);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${googleDate(startDate)}/${googleDate(endDate)}`,
    details: event.description || '',
    location: event.location || event.venue || 'Redemption City',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export async function openGoogleCalendar(event) {
  const url = getGoogleCalendarUrl(event);
  const supported = await Linking.canOpenURL(url);
  if (supported) await Linking.openURL(url);
  return url;
}
