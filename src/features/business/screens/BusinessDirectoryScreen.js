// src/features/business/screens/BusinessDirectoryScreen.js
import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Modal,
  Linking,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  Phone,
  Clock,
  MapPin,
  User,
  X,
  Utensils,
  BedDouble,
  BookOpen,
  HeartPulse,
  ShoppingCart,
  Car,
  Scissors,
  Shirt,
  Dumbbell,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { BUSINESSES, TOTAL_BUSINESSES } from '../data/businesses';
import { C } from '../../../shared/constants/theme';

// ─── Overrides: remove all brown, replace with purple ────────────────────────
const BUSINESSES_CLEAN = BUSINESSES.map((cat) => ({
  ...cat,
  color: cat.color === '#C48D38' ? '#7128CE' : cat.color,
}));

// ─── Icon map ────────────────────────────────────────────────────────────────
const ICON_MAP = {
  Utensils,
  BedDouble,
  BookOpen,
  HeartPulse,
  ShoppingCart,
  Car,
  Scissors,
  Shirt,
  Dumbbell,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const renderStars = (rating) => {
  const num = parseFloat(rating);
  const full = Math.floor(num);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

// ─── Glass Card Component ────────────────────────────────────────────────────
const GlassCard = ({ children, color, style }) => (
  <LinearGradient
    colors={[`${color}1A`, `${color}08`]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.glassCard, style]}
  >
    <View style={styles.glassInner}>{children}</View>
  </LinearGradient>
);

// ─── Category pill ────────────────────────────────────────────────────────────
const CategoryPill = ({ cat, isActive, onPress }) => {
  const Icon = ICON_MAP[cat.icon] || Utensils;
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        isActive
          ? { backgroundColor: cat.color, borderColor: cat.color }
          : { backgroundColor: C.surf, borderColor: C.b },
      ]}
      onPress={() => onPress(cat.id)}
      activeOpacity={0.75}
    >
      <Icon size={13} color={isActive ? '#fff' : C.ts} strokeWidth={2.2} />
      <Text style={[styles.pillLabel, { color: isActive ? '#fff' : C.tp }]}>
        {cat.cat}
      </Text>
      <View style={[styles.pillBadge, { backgroundColor: isActive ? 'rgba(255,255,255,0.28)' : C.b }]}>
        <Text style={[styles.pillBadgeText, { color: isActive ? '#fff' : C.ts }]}>
          {cat.items.length}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Business card (glassy) ──────────────────────────────────────────────────
const BusinessCard = ({ item, accentColor, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.85}>
    <GlassCard color={accentColor} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.ratingBadge}>
          <Text style={[styles.ratingStars, { color: accentColor }]}>★</Text>
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <View style={styles.cardMeta}>
        <MapPin size={11} color={C.ts} strokeWidth={2} />
        <Text style={styles.cardMetaText} numberOfLines={1}>{item.zone}</Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.cardMeta}>
          <Clock size={11} color={C.ts} strokeWidth={2} />
          <Text style={styles.cardMetaText}>{item.hours}</Text>
        </View>
        <TouchableOpacity
          style={[styles.callChip, { backgroundColor: accentColor + '18', borderColor: accentColor + '55' }]}
          onPress={() => Linking.openURL(`tel:${item.phone.replace(/\s/g, '')}`)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Phone size={11} color={accentColor} strokeWidth={2.5} />
          <Text style={[styles.callChipText, { color: accentColor }]}>Call</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  </TouchableOpacity>
);

// ─── Detail sheet rows ───────────────────────────────────────────────────────
const SheetRow = ({ icon, label, value, color }) => (
  <View style={styles.sheetRow}>
    <View style={[styles.sheetRowIcon, { backgroundColor: `${color}22`, borderColor: `${color}44` }]}>
      {icon}
    </View>
    <View style={styles.sheetRowText}>
      <Text style={styles.sheetRowLabel}>{label}</Text>
      <Text style={styles.sheetRowValue}>{value}</Text>
    </View>
  </View>
);

// Full-width call button row
const PhoneRow = ({ icon, label, value, color }) => (
  <View style={styles.phoneSection}>
    <View style={styles.phoneInfoRow}>
      <View style={[styles.sheetRowIcon, { backgroundColor: `${color}22`, borderColor: `${color}44` }]}>
        {icon}
      </View>
      <View style={styles.sheetRowText}>
        <Text style={styles.sheetRowLabel}>{label}</Text>
        <Text style={styles.sheetRowValue}>{value}</Text>
      </View>
    </View>
    <TouchableOpacity
      style={[styles.phoneCallButton, { backgroundColor: color }]}
      onPress={() => Linking.openURL(`tel:${value.replace(/\s/g, '')}`)}
      activeOpacity={0.8}
    >
      <Phone size={16} color="#fff" strokeWidth={2.5} />
      <Text style={styles.phoneCallText}>Call Now</Text>
    </TouchableOpacity>
  </View>
);

const DetailSheet = ({ visible, item, accentColor, onClose }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 300,
      useNativeDriver: true,
      damping: 20,
      stiffness: 180,
    }).start();
  }, [visible]);

  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.sheetHandle} />
        <TouchableOpacity style={styles.sheetClose} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <X size={18} color={C.ts} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={[styles.sheetStrip, { backgroundColor: accentColor }]} />
        <Text style={styles.sheetName}>{item.name}</Text>
        <View style={styles.sheetRatingRow}>
          <Text style={[styles.sheetStars, { color: accentColor }]}>{renderStars(item.rating)}</Text>
          <Text style={styles.sheetRatingNum}>{item.rating}</Text>
        </View>
        <View style={styles.sheetDetails}>
          <SheetRow icon={<User size={15} color={accentColor} strokeWidth={2} />} label="Owner" value={item.owner} color={accentColor} />
          <SheetRow icon={<MapPin size={15} color={accentColor} strokeWidth={2} />} label="Location" value={item.zone} color={accentColor} />
          <SheetRow icon={<Clock size={15} color={accentColor} strokeWidth={2} />} label="Hours" value={item.hours} color={accentColor} />
          <PhoneRow icon={<Phone size={15} color={accentColor} strokeWidth={2} />} label="Phone" value={item.phone} color={accentColor} />
        </View>
      </Animated.View>
    </Modal>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function BusinessDirectoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeCatId, setActiveCatId] = useState(BUSINESSES_CLEAN[0].id);
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const activeCategory = useMemo(
    () => BUSINESSES_CLEAN.find((b) => b.id === activeCatId),
    [activeCatId]
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return activeCategory.items;
    const q = query.toLowerCase();
    return activeCategory.items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.zone.toLowerCase().includes(q) ||
        i.owner.toLowerCase().includes(q)
    );
  }, [activeCategory, query]);

  const handleCardPress = useCallback((item) => {
    setSelectedItem(item);
    setSheetVisible(true);
  }, []);

  const handleCatPress = useCallback((id) => {
    setActiveCatId(id);
    setQuery('');
  }, []);

  const renderCard = useCallback(
    ({ item }) => (
      <BusinessCard item={item} accentColor={activeCategory.color} onPress={handleCardPress} />
    ),
    [activeCategory.color, handleCardPress]
  );

  const keyExtractor = useCallback((item) => item.phone, []);

  const ActiveIcon = ICON_MAP[activeCategory.icon] || Utensils;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={22} color={C.tp} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Business Directory</Text>
          <Text style={styles.headerSub}>Redemption City · {TOTAL_BUSINESSES} listings</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Category pills ── */}
      <View style={styles.pillsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScroll}
        >
          {BUSINESSES_CLEAN.map((cat) => (
            <CategoryPill
              key={cat.id}
              cat={cat}
              isActive={cat.id === activeCatId}
              onPress={handleCatPress}
            />
          ))}
        </ScrollView>
      </View>

      {/* ── Active category bar ── */}
      <LinearGradient
        colors={[C.surf, C.bg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.activeCatBar}
      >
        <View style={[styles.activeCatIconWrap, { backgroundColor: activeCategory.color }]}>
          <ActiveIcon size={13} color="#fff" strokeWidth={2} />
        </View>
        <Text style={styles.activeCatName}>{activeCategory.cat}</Text>
        <Text style={[styles.activeCatCount, { color: activeCategory.color }]}>
          {filteredItems.length} {filteredItems.length === 1 ? 'listing' : 'listings'}
        </Text>
      </LinearGradient>

      {/* ── Search ── */}
      <View style={styles.searchWrap}>
        <Search size={14} color={C.ts} strokeWidth={2} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeCategory.cat.toLowerCase()}…`}
          placeholderTextColor={C.tm}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
          selectionColor={C.purple}
        />
        {query.length > 0 && Platform.OS === 'android' && (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={14} color={C.ts} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Listings ── */}
      <FlatList
        data={filteredItems}
        renderItem={renderCard}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Search size={28} color={C.tm} strokeWidth={1.5} />
            <Text style={styles.emptyText}>No results for "{query}"</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* ── Detail sheet ── */}
      <DetailSheet
        visible={sheetVisible}
        item={selectedItem}
        accentColor={activeCategory.color}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.b,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.surf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.tp,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    color: C.ts,
    marginTop: 1,
    fontWeight: '500',
  },

  // Pills
  pillsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: C.b,
    backgroundColor: C.bg,
  },
  pillsScroll: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    flexDirection: 'row',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  pillBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  pillBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // Active category bar
  activeCatBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.b,
    gap: 8,
  },
  activeCatIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCatName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: C.tp,
    letterSpacing: -0.2,
  },
  activeCatCount: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surf,
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: C.b,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: C.tp,
    padding: 0,
  },

  // List
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 24,
  },

  // Glass Card
  glassCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.b,
    overflow: 'hidden',
  },
  glassInner: {
    padding: 12,
  },
  card: {},
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 6,
  },
  cardName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: C.tp,
    letterSpacing: -0.2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingStars: { fontSize: 11 },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.ts,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  cardMetaText: {
    fontSize: 11,
    color: C.ts,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  callChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  callChipText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 13,
    color: C.ts,
    textAlign: 'center',
  },

  // Sheet overlay — fully opaque
  sheetOverlay: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Sheet — fully opaque background
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.surfHi,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.b,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.tm,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.b,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetStrip: {
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
    width: 48,
  },
  sheetName: {
    fontSize: 18,
    fontWeight: '800',
    color: C.tp,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  sheetRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  sheetStars: {
    fontSize: 15,
    letterSpacing: 1,
  },
  sheetRatingNum: {
    fontSize: 13,
    fontWeight: '700',
    color: C.ts,
  },
  sheetDetails: {
    gap: 14,
    marginBottom: 24,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sheetRowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  sheetRowText: {
    flex: 1,
    justifyContent: 'center',
  },
  sheetRowLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: C.ts,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sheetRowValue: {
    fontSize: 14,
    color: C.tp,
    fontWeight: '500',
    marginTop: 1,
  },

  // Phone section — info row + full-width button stacked
  phoneSection: {
    gap: 12,
  },
  phoneInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phoneCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    width: '100%',
  },
  phoneCallText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});