import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { addDoc, collection, getDocs, orderBy, query as firestoreQuery, serverTimestamp } from 'firebase/firestore';
import {
  BedDouble,
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  CreditCard,
  Home,
  MapPin,
  Phone,
  Search,
  Users,
  X,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import { auth, db } from '../../shared/config/firebase';
import { useUserProfile } from '../../shared/context/UserContext';
import { CAMP_LOCATIONS } from '../navigation/data/locations';

const ROOM_TYPES = [
  { id: 'standard', label: 'Standard Room', price: 18000, note: 'Comfortable room for short stays' },
  { id: 'family', label: 'Family Suite', price: 32000, note: 'Larger space for families' },
  { id: 'executive', label: 'Executive Suite', price: 45000, note: 'Premium comfort and priority support' },
];

const BASE_CAPACITY = { standard: 4, family: 2, executive: 1 };
const ACTIVE_BOOKING_STATUSES = ['pending_confirmation', 'pending_payment', 'confirmed', 'checked_in'];
const DEVELOPER_EMAIL = 'serialquest@gmail.com';

function fallbackPhone(index) {
  return ['08067592352', '08058047900', '09161934554', '09022024174'][index % 4];
}

function money(value) {
  return `N${Number(value || 0).toLocaleString('en-NG')}`;
}

function stayNights(checkIn, checkOut) {
  const start = Date.parse(checkIn);
  const end = Date.parse(checkOut);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 1;
  return Math.max(1, Math.round((end - start) / 86400000));
}

function getCapacity(accommodation) {
  const name = String(accommodation?.name || '').toLowerCase();
  if (name.includes('vip') || name.includes('executive')) return { standard: 2, family: 2, executive: 3 };
  if (name.includes('family')) return { standard: 3, family: 4, executive: 1 };
  return BASE_CAPACITY;
}

function bookingRoomId(booking) {
  const label = String(booking.roomType || '').toLowerCase();
  if (booking.roomTypeId) return booking.roomTypeId;
  if (label.includes('family')) return 'family';
  if (label.includes('executive')) return 'executive';
  return 'standard';
}

function bookingOverlaps(booking, checkIn, checkOut) {
  const bookingStart = Date.parse(booking.checkIn);
  const bookingEnd = Date.parse(booking.checkOut);
  const start = Date.parse(checkIn);
  const end = Date.parse(checkOut);

  if (!Number.isFinite(bookingStart) || !Number.isFinite(bookingEnd)) return false;
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingEnd >= today.getTime();
  }

  return bookingStart < end && start < bookingEnd;
}

function getAvailability(accommodation, bookings, checkIn, checkOut) {
  const capacity = getCapacity(accommodation);
  const activeBookings = bookings.filter((booking) => (
    booking.accommodationId === accommodation?.id
    && ACTIVE_BOOKING_STATUSES.includes(String(booking.status || '').toLowerCase())
    && bookingOverlaps(booking, checkIn, checkOut)
  ));

  return Object.fromEntries(Object.entries(capacity).map(([roomId, count]) => {
    const booked = activeBookings.filter((booking) => bookingRoomId(booking) === roomId).length;
    return [roomId, Math.max(0, count - booked)];
  }));
}

function bookingEmailBody(payload) {
  return [
    'New CityFlow accommodation booking',
    '',
    `Reference: ${payload.bookingCode}`,
    `Accommodation: ${payload.accommodationName}`,
    `Room: ${payload.roomType}`,
    `Dates: ${payload.checkIn} - ${payload.checkOut}`,
    `Nights: ${payload.nights}`,
    `Guests: ${payload.guests}`,
    `Amount: ${money(payload.amount)}`,
    '',
    `Guest: ${payload.userName}`,
    `Email: ${payload.email || 'Not provided'}`,
    `Phone: ${payload.phone || 'Not provided'}`,
    `Accommodation contact: ${payload.accommodationPhone || 'Not provided'}`,
    '',
    `Special requests: ${payload.notes || 'None'}`,
  ].join('\n');
}

async function queueDeveloperEmail(bookingId, payload) {
  const subject = `CityFlow stay booking ${payload.bookingCode}`;
  const text = bookingEmailBody(payload);
  await addDoc(collection(db, 'mail'), {
    to: [DEVELOPER_EMAIL],
    message: {
      subject,
      text,
      html: text.replace(/\n/g, '<br />'),
    },
    bookingId,
    source: 'accommodationBooking',
    status: 'queued',
    createdAt: serverTimestamp(),
  });
}

export default function StayScreen({ navigation }) {
  const { user } = useUserProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingAccommodationId, setBookingAccommodationId] = useState(null);
  const [roomType, setRoomType] = useState('standard');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  const accommodations = useMemo(
    () => CAMP_LOCATIONS
      .filter((item) => item.category === 'accommodation')
      .map((item, index) => ({ ...item, phone: item.phone || fallbackPhone(index) })),
    []
  );

  const filtered = accommodations.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    return !q || [item.name, item.description, item.subcategory, item.address]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
  });

  const selected = accommodations.find((item) => item.id === bookingAccommodationId);
  const selectedRoom = ROOM_TYPES.find((item) => item.id === roomType) || ROOM_TYPES[0];
  const nights = stayNights(checkIn, checkOut);
  const serviceFee = 1500;
  const total = selectedRoom.price * nights + serviceFee;
  const availability = selected ? getAvailability(selected, bookings, checkIn, checkOut) : {};
  const selectedAvailable = availability[roomType] ?? 0;

  useEffect(() => {
    const firebaseUser = auth?.currentUser;
    const profileName = user?.displayName || [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
    setGuestName((current) => current || profileName || firebaseUser?.displayName || '');
    setGuestEmail((current) => current || user?.email || firebaseUser?.email || '');
    setGuestPhone((current) => current || user?.phone || user?.phoneNumber || firebaseUser?.phoneNumber || '');
  }, [user]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoadingAvailability(true);
    try {
      const snap = await getDocs(firestoreQuery(collection(db, 'accommodationBookings'), orderBy('createdAt', 'desc')));
      setBookings(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (err) {
      console.warn('Could not load accommodation availability:', err?.code || err?.message);
    } finally {
      setLoadingAvailability(false);
    }
  }

  async function callAccommodation(phone) {
    const cleaned = String(phone || '').replace(/\s+/g, '');
    if (!cleaned) {
      Alert.alert('No phone number', 'This accommodation does not have a contact number yet.');
      return;
    }
    await Linking.openURL(`tel:${cleaned}`);
  }

  async function handleBooking() {
    if (!selected || !checkIn.trim() || !checkOut.trim() || !guestName.trim() || !guestPhone.trim()) {
      Alert.alert('Booking details needed', 'Please choose accommodation, dates, name, and phone number.');
      return;
    }
    if (selectedAvailable <= 0) {
      Alert.alert('Room not available', 'This accommodation and room type is taken for those dates. Please choose another option.');
      return;
    }

    setBooking(true);
    const firebaseUser = auth?.currentUser;
    const email = guestEmail.trim() || user?.email || firebaseUser?.email || '';
    const name = guestName.trim() || user?.displayName || [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || email || 'Guest';

    try {
      const payload = {
        accommodationId: selected.id,
        accommodationName: selected.name,
        accommodationPhone: selected.phone,
        roomTypeId: selectedRoom.id,
        roomType: selectedRoom.label,
        checkIn: checkIn.trim(),
        checkOut: checkOut.trim(),
        nights,
        guests: guests.trim() || '1',
        amount: total,
        status: 'pending_confirmation',
        userId: firebaseUser?.uid || user?.uid || email || 'anonymous',
        userName: name,
        email,
        phone: guestPhone.trim(),
        notes: notes.trim(),
        bookingCode: `STAY-${Date.now().toString(36).toUpperCase()}`,
        createdAt: serverTimestamp(),
        developerEmail: DEVELOPER_EMAIL,
        developerEmailStatus: 'queued',
      };
      const ref = await addDoc(collection(db, 'accommodationBookings'), payload);
      try {
        await queueDeveloperEmail(ref.id, payload);
      } catch (mailErr) {
        await addDoc(collection(db, 'developerEmailQueue'), {
          to: DEVELOPER_EMAIL,
          subject: `CityFlow stay booking ${payload.bookingCode}`,
          body: bookingEmailBody(payload),
          bookingId: ref.id,
          source: 'accommodationBooking',
          status: 'queued',
          error: mailErr?.message || '',
          createdAt: serverTimestamp(),
        });
      }
      setConfirmed({ ...payload, id: ref.id });
      setBookings((items) => [{ ...payload, id: ref.id }, ...items]);
    } catch (err) {
      Alert.alert('Booking failed', err?.message || 'Please try again.');
    } finally {
      setBooking(false);
    }
  }

  if (confirmed) {
    return (
      <View style={s.root}>
        <Header navigation={navigation} />
        <View style={s.confirmed}>
          <View style={s.confirmedIcon}>
            <CheckCircle size={32} color={C.green} strokeWidth={1.8} />
          </View>
          <Text style={s.confirmedTitle}>Booking Created</Text>
          <Text style={s.confirmedSub}>
            Your stay request for {confirmed.accommodationName} has been recorded and sent to the CityFlow developer queue.
          </Text>
          <View style={s.summaryBox}>
            <SummaryRow label="Room" value={confirmed.roomType} />
            <SummaryRow label="Dates" value={`${confirmed.checkIn} - ${confirmed.checkOut}`} />
            <SummaryRow label="Amount" value={money(confirmed.amount)} />
            <SummaryRow label="Guest" value={confirmed.userName} />
            <SummaryRow label="Phone" value={confirmed.phone} />
            <SummaryRow label="Reference" value={confirmed.id} />
          </View>
          <TouchableOpacity style={s.callBtn} onPress={() => callAccommodation(confirmed.accommodationPhone)} activeOpacity={0.84}>
            <Phone size={14} color="#fff" strokeWidth={2} />
            <Text style={s.callBtnText}>Call Guest House</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.anotherBtn} onPress={() => { setConfirmed(null); setBookingAccommodationId(null); }} activeOpacity={0.84}>
            <Text style={s.anotherText}>Book Another Stay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <Header navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {!selected ? (
          <>
            <View style={s.searchBar}>
              <Search size={15} color={C.ts} strokeWidth={1.8} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search guest houses..."
                placeholderTextColor={C.tm}
                style={s.searchInput}
              />
              {!!searchQuery && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={14} color={C.ts} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>

            <Text style={s.sectionLabel}>Choose accommodation</Text>
            {loadingAvailability && <Text style={s.availabilityHint}>Checking live availability...</Text>}
            <View style={s.stayList}>
              {filtered.map((item) => {
                const itemAvailability = getAvailability(item, bookings, checkIn, checkOut);
                const totalAvailable = Object.values(itemAvailability).reduce((sum, value) => sum + value, 0);
                const isAvailable = totalAvailable > 0;
                return (
                  <TouchableOpacity key={item.id} onPress={() => setBookingAccommodationId(item.id)} style={s.stayCard} activeOpacity={0.84}>
                    <View style={s.stayIcon}>
                      <Home size={18} color="#2A7FAB" strokeWidth={1.8} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.stayName}>{item.name}</Text>
                      <Text style={s.stayDesc}>{item.description}</Text>
                      <View style={[s.availabilityPill, isAvailable ? s.availablePill : s.takenPill]}>
                        <Text style={[s.availabilityText, { color: isAvailable ? C.green : C.red }]}>
                          {isAvailable ? `${totalAvailable} room(s) available` : 'Taken / not available'}
                        </Text>
                      </View>
                      <View style={s.stayMeta}>
                        <MapPin size={10} color={C.gold} strokeWidth={2} />
                        <Text style={s.stayMetaText}>{item.shortName || item.subcategory || 'Redemption City'}</Text>
                      </View>
                      <View style={s.cardFooter}>
                        <TouchableOpacity onPress={() => callAccommodation(item.phone)} style={s.inlinePhone} activeOpacity={0.75}>
                          <Phone size={11} color="#49BDEB" strokeWidth={2} />
                          <Text style={s.inlinePhoneText}>{item.phone}</Text>
                        </TouchableOpacity>
                        <Text style={s.selectRoomsText}>Select rooms</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => setBookingAccommodationId(null)} style={s.changeStayBtn} activeOpacity={0.78}>
              <ChevronLeft size={14} color={C.gold} strokeWidth={2} />
              <Text style={s.changeStayText}>Choose another accommodation</Text>
            </TouchableOpacity>

            <View style={[s.stayCard, s.stayCardActive, { marginBottom: 16 }]}>
              <View style={[s.stayIcon, s.stayIconActive]}>
                <Home size={18} color={C.gold} strokeWidth={1.8} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.stayName}>{selected.name}</Text>
                <Text style={s.stayDesc}>{selected.description}</Text>
                <TouchableOpacity onPress={() => callAccommodation(selected.phone)} style={s.inlinePhone} activeOpacity={0.75}>
                  <Phone size={11} color="#49BDEB" strokeWidth={2} />
                  <Text style={s.inlinePhoneText}>{selected.phone}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={s.sectionLabel}>Select room</Text>
            {ROOM_TYPES.map((room) => {
              const active = roomType === room.id;
              const roomAvailable = availability[room.id] ?? 0;
              const taken = roomAvailable <= 0;
              return (
                <TouchableOpacity key={room.id} onPress={() => setRoomType(room.id)} style={[s.roomCard, active && s.roomCardActive, taken && s.roomCardTaken]} activeOpacity={0.84}>
                  <BedDouble size={18} color={active ? C.purpleL : C.ts} strokeWidth={1.8} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.roomTitle}>{room.label}</Text>
                    <Text style={s.roomNote}>{taken ? 'Taken for selected dates' : `${roomAvailable} available - ${room.note}`}</Text>
                  </View>
                  <Text style={s.roomPrice}>{money(room.price)}</Text>
                </TouchableOpacity>
              );
            })}

            <Text style={s.sectionLabel}>Stay details</Text>
            <View style={s.formCard}>
              <InputRow Icon={CalendarDays} label="Check-in" value={checkIn} onChangeText={setCheckIn} placeholder="2026-06-11" />
              <InputRow Icon={CalendarDays} label="Check-out" value={checkOut} onChangeText={setCheckOut} placeholder="2026-06-12" />
              <InputRow Icon={Users} label="Guests" value={guests} onChangeText={setGuests} placeholder="1" keyboardType="number-pad" />
              <InputRow Icon={Users} label="Full name" value={guestName} onChangeText={setGuestName} placeholder="Guest name" />
              <InputRow Icon={Phone} label="Phone" value={guestPhone} onChangeText={setGuestPhone} placeholder="080..." keyboardType="phone-pad" />
              <InputRow Icon={Home} label="Email" value={guestEmail} onChangeText={setGuestEmail} placeholder="optional@email.com" keyboardType="email-address" autoCapitalize="none" />
              <InputRow Icon={CreditCard} label="Requests" value={notes} onChangeText={setNotes} placeholder="Optional note" multiline />
            </View>

            <View style={s.paymentCard}>
              <View>
                <Text style={s.paymentLabel}>Estimated total</Text>
                <Text style={s.paymentAmount}>{money(total)}</Text>
                <Text style={s.paymentSub}>{nights} night(s) + service fee</Text>
              </View>
              <CreditCard size={24} color={C.gold} strokeWidth={1.7} />
            </View>

            <TouchableOpacity onPress={handleBooking} activeOpacity={0.86} style={{ marginBottom: 18 }} disabled={selectedAvailable <= 0 || booking}>
              <LinearGradient colors={selectedAvailable <= 0 ? ['rgba(212,79,79,0.38)', 'rgba(212,79,79,0.28)'] : ['#7128CE', '#5A18A8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.bookBtn}>
                {booking ? <ActivityIndicator color="#fff" /> : <Text style={s.bookText}>{selectedAvailable <= 0 ? 'Not Available' : `Book ${money(total)}`}</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Header({ navigation }) {
  return (
    <View style={s.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.75}>
        <ChevronLeft size={18} color={C.tp} strokeWidth={2} />
      </TouchableOpacity>
      <View>
        <Text style={s.title}>Stay</Text>
        <Text style={s.sub}>Guest houses & accommodation</Text>
      </View>
    </View>
  );
}

function InputRow({ Icon, label, ...props }) {
  return (
    <View style={s.inputRow}>
      <Icon size={15} color={C.gold} strokeWidth={1.8} />
      <View style={{ flex: 1 }}>
        <Text style={s.inputLabel}>{label}</Text>
        <TextInput {...props} placeholderTextColor={C.tm} style={s.input} />
      </View>
    </View>
  );
}

function SummaryRow({ label, value }) {
  return (
    <View style={s.summaryRow}>
      <Text style={s.summaryLabel}>{label}</Text>
      <Text style={s.summaryValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 18, paddingTop: 48, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 21, fontWeight: '800', color: C.tp },
  sub: { fontSize: 11, color: C.ts, marginTop: 2 },
  scroll: { padding: 18, paddingTop: 4, paddingBottom: 28 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 15, paddingHorizontal: 14, paddingVertical: 11, marginBottom: 16 },
  searchInput: { flex: 1, color: C.tp, fontSize: 13, padding: 0 },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase', color: C.tm, marginBottom: 10, marginTop: 4 },
  stayList: { gap: 10, marginBottom: 16 },
  stayCard: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 18, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b },
  stayCardActive: { backgroundColor: 'rgba(42,127,171,0.11)', borderColor: 'rgba(42,127,171,0.36)' },
  stayIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(42,127,171,0.12)', borderWidth: 1, borderColor: 'rgba(42,127,171,0.26)', alignItems: 'center', justifyContent: 'center' },
  stayIconActive: { backgroundColor: 'rgba(196,141,56,0.13)', borderColor: 'rgba(196,141,56,0.32)' },
  stayName: { fontSize: 13.5, fontWeight: '800', color: C.tp, marginBottom: 3 },
  stayDesc: { fontSize: 11.5, color: C.ts, lineHeight: 17, marginBottom: 7 },
  availabilityHint: { fontSize: 11, color: C.gold, marginTop: -4, marginBottom: 9 },
  availabilityPill: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12, borderWidth: 1, marginBottom: 7 },
  availablePill: { backgroundColor: 'rgba(61,170,106,0.12)', borderColor: 'rgba(61,170,106,0.28)' },
  takenPill: { backgroundColor: 'rgba(212,79,79,0.12)', borderColor: 'rgba(212,79,79,0.28)' },
  availabilityText: { fontSize: 10, fontWeight: '800' },
  stayMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  stayMetaText: { fontSize: 10.5, color: C.gold, fontWeight: '700', marginLeft: 4 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  inlinePhone: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 8, borderRadius: 11, backgroundColor: 'rgba(73,189,235,0.1)', borderWidth: 1, borderColor: 'rgba(73,189,235,0.24)' },
  inlinePhoneText: { color: '#49BDEB', fontSize: 11, fontWeight: '700' },
  selectRoomsText: { color: C.gold, fontSize: 11, fontWeight: '900' },
  changeStayBtn: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 8, paddingHorizontal: 11, borderRadius: 13, backgroundColor: 'rgba(196,141,56,0.1)', borderWidth: 1, borderColor: 'rgba(196,141,56,0.25)', marginBottom: 12 },
  changeStayText: { color: C.gold, fontSize: 11.5, fontWeight: '800' },
  roomCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, marginBottom: 9 },
  roomCardActive: { backgroundColor: 'rgba(113,40,206,0.12)', borderColor: 'rgba(148,88,224,0.42)' },
  roomCardTaken: { opacity: 0.62, borderColor: 'rgba(212,79,79,0.22)' },
  roomTitle: { fontSize: 13, color: C.tp, fontWeight: '800' },
  roomNote: { fontSize: 10.5, color: C.ts, marginTop: 2 },
  roomPrice: { fontSize: 13, color: C.gold, fontWeight: '900' },
  formCard: { backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 18, padding: 14, marginBottom: 14, gap: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  inputLabel: { fontSize: 10, color: C.tm, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
  input: { color: C.tp, fontSize: 13, fontWeight: '700', padding: 0, minHeight: 22 },
  paymentCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(196,141,56,0.09)', borderWidth: 1, borderColor: 'rgba(196,141,56,0.28)', borderRadius: 18, padding: 15, marginBottom: 14 },
  paymentLabel: { fontSize: 10, color: C.tm, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  paymentAmount: { fontSize: 22, color: C.tp, fontWeight: '900', marginTop: 2 },
  paymentSub: { fontSize: 11, color: C.ts, marginTop: 2 },
  bookBtn: { minHeight: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  bookText: { fontSize: 14, color: '#fff', fontWeight: '800' },
  confirmed: { margin: 22, marginTop: 24, borderRadius: 24, padding: 24, alignItems: 'center', backgroundColor: 'rgba(61,170,106,0.08)', borderWidth: 1, borderColor: 'rgba(61,170,106,0.25)' },
  confirmedIcon: { width: 62, height: 62, borderRadius: 31, backgroundColor: 'rgba(61,170,106,0.14)', borderWidth: 1, borderColor: 'rgba(61,170,106,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  confirmedTitle: { fontSize: 18, color: C.tp, fontWeight: '900', marginBottom: 7 },
  confirmedSub: { fontSize: 12.5, color: C.ts, lineHeight: 19, textAlign: 'center', marginBottom: 16 },
  summaryBox: { alignSelf: 'stretch', borderRadius: 16, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, padding: 12, marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 6 },
  summaryLabel: { fontSize: 11, color: C.ts },
  summaryValue: { flex: 1, textAlign: 'right', fontSize: 11, color: C.tp, fontWeight: '700' },
  callBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: 'stretch', paddingVertical: 13, borderRadius: 15, backgroundColor: C.purple, marginBottom: 10 },
  callBtnText: { fontSize: 13, color: '#fff', fontWeight: '800' },
  anotherBtn: { paddingVertical: 12, paddingHorizontal: 22, borderRadius: 14, backgroundColor: C.surfHi, borderWidth: 1, borderColor: C.b },
  anotherText: { color: C.tp, fontSize: 12.5, fontWeight: '800' },
});
