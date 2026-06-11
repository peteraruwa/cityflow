import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  ChevronLeft,
  Edit3,
  Mail,
  Megaphone,
  Phone,
  Plus,
  RefreshCw,
  Shield,
  Tag,
  Trash2,
  User,
  X,
} from 'lucide-react-native';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { C } from '../../shared/constants/theme';
import { db } from '../../shared/config/firebase';

const REPORT_FILTERS = ['all', 'pending', 'claimed', 'resolved'];
const REPORT_STATUSES = ['pending', 'claimed', 'resolved'];
const NEWS_CATEGORIES = ['Announcement', 'Service', 'Traffic', 'Event', 'Emergency', 'General'];
const EMPTY_NEWS_FORM = {
  title: '',
  content: '',
  category: 'Announcement',
  urgent: false,
  link: '',
};

function normalizeDate(value) {
  if (!value) return 'Recently';
  if (typeof value?.toDate === 'function') return value.toDate().toLocaleString();
  if (value?.seconds) return new Date(value.seconds * 1000).toLocaleString();
  return String(value);
}

function reportTitle(item) {
  return item.itemName || item.item || 'Lost item';
}

function reportOwner(item) {
  return item.fullName || item.ownerName || item.userName || 'Unknown owner';
}

export default function AdminDashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('lost');
  const [reports, setReports] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [reportFilter, setReportFilter] = useState('all');
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState(EMPTY_NEWS_FORM);
  const [savingNews, setSavingNews] = useState(false);
  const [updatingReportId, setUpdatingReportId] = useState(null);

  const loadReports = useCallback(async () => {
    setLoadingReports(true);
    try {
      const snap = await getDocs(query(collection(db, 'lostAndFoundReports'), orderBy('createdAt', 'desc')));
      setReports(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (err) {
      Alert.alert('Could not load reports', err?.message || 'Please check your connection and try again.');
    } finally {
      setLoadingReports(false);
    }
  }, []);

  const loadNews = useCallback(async () => {
    setLoadingNews(true);
    try {
      const snap = await getDocs(query(collection(db, 'news'), orderBy('createdAt', 'desc')));
      setNewsItems(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (err) {
      Alert.alert('Could not load news', err?.message || 'Please check your connection and try again.');
    } finally {
      setLoadingNews(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadReports(), loadNews()]);
    setRefreshing(false);
  }, [loadNews, loadReports]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const filteredReports = useMemo(() => {
    if (reportFilter === 'all') return reports;
    return reports.filter((item) => String(item.status || 'pending').toLowerCase() === reportFilter);
  }, [reportFilter, reports]);

  async function updateReportStatus(report, status) {
    setUpdatingReportId(report.id);
    try {
      await updateDoc(doc(db, 'lostAndFoundReports', report.id), {
        status,
        updatedAt: serverTimestamp(),
      });
      setReports((items) => items.map((item) => (item.id === report.id ? { ...item, status } : item)));
      setSelectedReport((current) => (current?.id === report.id ? { ...current, status } : current));
    } catch (err) {
      Alert.alert('Status update failed', err?.message || 'Please try again.');
    } finally {
      setUpdatingReportId(null);
    }
  }

  function openNewsForm(item = null) {
    setEditingNews(item);
    setNewsForm(item ? {
      title: item.title || '',
      content: item.content || item.body || '',
      category: item.category || 'Announcement',
      urgent: !!item.urgent,
      link: item.link || '',
    } : EMPTY_NEWS_FORM);
    setNewsModalOpen(true);
  }

  async function saveNews() {
    if (!newsForm.title.trim() || !newsForm.content.trim()) {
      Alert.alert('Missing details', 'Please add a title and content before saving.');
      return;
    }

    setSavingNews(true);
    const payload = {
      title: newsForm.title.trim(),
      content: newsForm.content.trim(),
      category: newsForm.category,
      urgent: !!newsForm.urgent,
      link: newsForm.link.trim(),
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingNews) {
        await updateDoc(doc(db, 'news', editingNews.id), payload);
      } else {
        await addDoc(collection(db, 'news'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }
      setNewsModalOpen(false);
      setEditingNews(null);
      setNewsForm(EMPTY_NEWS_FORM);
      await loadNews();
    } catch (err) {
      Alert.alert('Could not save news', err?.message || 'Please try again.');
    } finally {
      setSavingNews(false);
    }
  }

  function confirmDeleteNews(item) {
    Alert.alert(
      'Delete news item?',
      `This will permanently remove "${item.title || 'this news item'}".`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'news', item.id));
              setNewsItems((items) => items.filter((news) => news.id !== item.id));
            } catch (err) {
              Alert.alert('Delete failed', err?.message || 'Please try again.');
            }
          },
        },
      ]
    );
  }

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.75}>
          <ChevronLeft size={18} color={C.tp} strokeWidth={2} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Admin Dashboard</Text>
          <Text style={s.headerSub}>Manage reports, news and announcements</Text>
        </View>
        <TouchableOpacity onPress={refreshAll} style={s.refreshBtn} activeOpacity={0.75}>
          <RefreshCw size={16} color={C.gold} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={s.tabs}>
        {[
          ['lost', 'Lost & Found'],
          ['news', 'News & Updates'],
        ].map(([id, label]) => (
          <TouchableOpacity key={id} onPress={() => setActiveTab(id)} style={[s.tab, activeTab === id && s.tabActive]} activeOpacity={0.85}>
            <Text style={[s.tabText, activeTab === id && s.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'lost' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshAll} tintColor={C.gold} />}
        >
          <View style={s.filterRow}>
            {REPORT_FILTERS.map((filter) => (
              <TouchableOpacity key={filter} onPress={() => setReportFilter(filter)} style={[s.filterChip, reportFilter === filter && s.filterChipActive]}>
                <Text style={[s.filterText, reportFilter === filter && s.filterTextActive]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {loadingReports ? (
            <Loader label="Loading reports..." />
          ) : filteredReports.length === 0 ? (
            <EmptyState title="No reports found" body="Pull down to refresh or change the filter." />
          ) : (
            filteredReports.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => setSelectedReport(item)} style={s.reportCard} activeOpacity={0.85}>
                <View style={s.cardTop}>
                  <View style={s.cardIcon}>
                    <Shield size={15} color={C.purpleL} strokeWidth={1.8} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardTitle} numberOfLines={1}>{reportTitle(item)}</Text>
                    <Text style={s.cardSub} numberOfLines={1}>{item.location || 'Location not specified'}</Text>
                  </View>
                  <StatusPill status={item.status || 'pending'} />
                </View>
                <Text style={s.cardBody} numberOfLines={2}>{item.description || 'No description provided.'}</Text>
                <View style={s.metaRow}>
                  <Text style={s.metaText}>{reportOwner(item)}</Text>
                  <Text style={s.metaText}>{normalizeDate(item.createdAt)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshAll} tintColor={C.gold} />}
        >
          <TouchableOpacity onPress={() => openNewsForm()} activeOpacity={0.86} style={s.addNewsButton}>
            <LinearGradient colors={[C.purple, '#5A18A8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.addNewsInner}>
              <Plus size={16} color="#fff" strokeWidth={2} />
              <Text style={s.addNewsText}>Add News Item</Text>
            </LinearGradient>
          </TouchableOpacity>

          {loadingNews ? (
            <Loader label="Loading news..." />
          ) : newsItems.length === 0 ? (
            <EmptyState title="No news yet" body="Create the first announcement for CityFlow users." />
          ) : (
            newsItems.map((item) => (
              <View key={item.id} style={s.newsCard}>
                <View style={s.cardTop}>
                  <View style={[s.cardIcon, item.urgent && s.urgentIcon]}>
                    <Megaphone size={15} color={item.urgent ? C.red : C.gold} strokeWidth={1.8} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardTitle} numberOfLines={1}>{item.title || 'Untitled news'}</Text>
                    <Text style={s.cardSub}>{item.category || 'General'}{item.urgent ? '  /  Urgent' : ''}</Text>
                  </View>
                </View>
                <Text style={s.cardBody} numberOfLines={3}>{item.content || item.body || 'No content.'}</Text>
                {!!item.link && <Text style={s.newsLink} numberOfLines={1}>{item.link}</Text>}
                <View style={s.newsActions}>
                  <TouchableOpacity onPress={() => openNewsForm(item)} style={s.actionBtn} activeOpacity={0.82}>
                    <Edit3 size={13} color={C.purpleL} strokeWidth={2} />
                    <Text style={s.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDeleteNews(item)} style={[s.actionBtn, s.deleteAction]} activeOpacity={0.82}>
                    <Trash2 size={13} color={C.red} strokeWidth={2} />
                    <Text style={[s.actionText, { color: C.red }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <ReportModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onStatus={updateReportStatus}
        updatingId={updatingReportId}
      />
      <NewsFormModal
        visible={newsModalOpen}
        editing={!!editingNews}
        form={newsForm}
        setForm={setNewsForm}
        saving={savingNews}
        onClose={() => setNewsModalOpen(false)}
        onSave={saveNews}
      />
    </View>
  );
}

function Loader({ label }) {
  return (
    <View style={s.loader}>
      <ActivityIndicator color={C.gold} />
      <Text style={s.loaderText}>{label}</Text>
    </View>
  );
}

function EmptyState({ title, body }) {
  return (
    <View style={s.empty}>
      <Text style={s.emptyTitle}>{title}</Text>
      <Text style={s.emptyBody}>{body}</Text>
    </View>
  );
}

function StatusPill({ status }) {
  const clean = String(status || 'pending').toLowerCase();
  const color = clean === 'resolved' ? C.green : clean === 'claimed' ? C.gold : C.purpleL;
  return (
    <View style={[s.statusPill, { backgroundColor: `${color}18`, borderColor: `${color}38` }]}>
      <Text style={[s.statusText, { color }]}>{clean}</Text>
    </View>
  );
}

function ReportModal({ report, onClose, onStatus, updatingId }) {
  if (!report) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.modalCard}>
          <View style={s.modalHead}>
            <View>
              <Text style={s.modalTitle}>{reportTitle(report)}</Text>
              <Text style={s.modalSub}>{report.location || 'Location not specified'}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <X size={16} color={C.tp} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <StatusPill status={report.status || 'pending'} />
          <Text style={s.modalBody}>{report.description || 'No description provided.'}</Text>
          <InfoLine Icon={User} label="Name" value={reportOwner(report)} />
          <InfoLine Icon={Phone} label="Phone" value={report.phoneNumber || report.ownerPhone || 'Not provided'} />
          <InfoLine Icon={Mail} label="Email" value={report.email || 'Not provided'} />
          <InfoLine Icon={Tag} label="Category" value={report.category || 'Not provided'} />
          <InfoLine Icon={Bell} label="Lost" value={[report.dateLost, report.timeLost].filter(Boolean).join(' at ') || 'Not provided'} />
          <View style={s.statusActions}>
            {REPORT_STATUSES.map((status) => {
              const busy = updatingId === report.id;
              const active = String(report.status || 'pending').toLowerCase() === status;
              return (
                <TouchableOpacity
                  key={status}
                  disabled={busy || active}
                  onPress={() => onStatus(report, status)}
                  style={[s.statusAction, active && s.statusActionActive, busy && s.disabledBtn]}
                  activeOpacity={0.82}
                >
                  {busy ? <ActivityIndicator size="small" color="#fff" /> : <Text style={[s.statusActionText, active && s.statusActionTextActive]}>{status}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function InfoLine({ Icon, label, value }) {
  return (
    <View style={s.infoLine}>
      <Icon size={14} color={C.gold} strokeWidth={1.8} />
      <View style={{ flex: 1 }}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function NewsFormModal({ visible, editing, form, setForm, saving, onClose, onSave }) {
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.modalCard}>
          <View style={s.modalHead}>
            <View>
              <Text style={s.modalTitle}>{editing ? 'Edit News' : 'Create News'}</Text>
              <Text style={s.modalSub}>Publish updates to the CityFlow news feed</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <X size={16} color={C.tp} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <Text style={s.label}>Title</Text>
          <TextInput value={form.title} onChangeText={(value) => update('title', value)} placeholder="News title" placeholderTextColor={C.tm} style={s.input} />
          <Text style={s.label}>Content</Text>
          <TextInput
            value={form.content}
            onChangeText={(value) => update('content', value)}
            placeholder="Write the announcement..."
            placeholderTextColor={C.tm}
            multiline
            style={[s.input, s.textArea]}
          />
          <Text style={s.label}>Category</Text>
          <View style={s.categoryWrap}>
            {NEWS_CATEGORIES.map((category) => (
              <TouchableOpacity key={category} onPress={() => update('category', category)} style={[s.categoryChip, form.category === category && s.categoryChipActive]}>
                <Text style={[s.categoryText, form.category === category && s.categoryTextActive]}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={s.switchRow}>
            <View>
              <Text style={s.switchTitle}>Mark as urgent</Text>
              <Text style={s.switchSub}>Highlights this announcement in the app</Text>
            </View>
            <Switch
              value={form.urgent}
              onValueChange={(value) => update('urgent', value)}
              trackColor={{ false: 'rgba(255,255,255,0.12)', true: C.purple }}
              thumbColor="#fff"
            />
          </View>
          <Text style={s.label}>Optional Link</Text>
          <TextInput value={form.link} onChangeText={(value) => update('link', value)} placeholder="https://..." placeholderTextColor={C.tm} style={s.input} autoCapitalize="none" />
          <TouchableOpacity onPress={onSave} disabled={saving} activeOpacity={0.86}>
            <LinearGradient colors={[C.purple, '#5A18A8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.saveBtn, saving && s.disabledBtn]}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={s.saveText}>{editing ? 'Save Changes' : 'Publish News'}</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 18, paddingTop: 48, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, alignItems: 'center', justifyContent: 'center' },
  refreshBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(196,141,56,0.1)', borderWidth: 1, borderColor: 'rgba(196,141,56,0.28)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: C.tp },
  headerSub: { fontSize: 11, color: C.ts, marginTop: 2 },
  tabs: { flexDirection: 'row', marginHorizontal: 18, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 15, padding: 3 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: C.purple },
  tabText: { fontSize: 12, fontWeight: '700', color: C.ts },
  tabTextActive: { color: '#fff' },
  scroll: { padding: 18, paddingTop: 14, paddingBottom: 32 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  filterChip: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b },
  filterChipActive: { backgroundColor: 'rgba(113,40,206,0.16)', borderColor: 'rgba(148,88,224,0.48)' },
  filterText: { fontSize: 11, fontWeight: '700', color: C.ts, textTransform: 'capitalize' },
  filterTextActive: { color: C.purpleL },
  reportCard: { backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 18, padding: 15, marginBottom: 11 },
  newsCard: { backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 18, padding: 15, marginBottom: 11 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 11 },
  cardIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: 'rgba(113,40,206,0.12)', borderWidth: 1, borderColor: 'rgba(148,88,224,0.25)', alignItems: 'center', justifyContent: 'center' },
  urgentIcon: { backgroundColor: 'rgba(212,79,79,0.12)', borderColor: 'rgba(212,79,79,0.25)' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: C.tp },
  cardSub: { fontSize: 10.5, color: C.ts, marginTop: 2 },
  cardBody: { fontSize: 12, color: C.ts, lineHeight: 18, marginBottom: 11 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  metaText: { flex: 1, fontSize: 10.5, color: C.tm },
  statusPill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  statusText: { fontSize: 9.5, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
  loader: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, gap: 10 },
  loaderText: { fontSize: 12, color: C.ts },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 22, borderRadius: 18, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: C.tp, marginBottom: 6 },
  emptyBody: { fontSize: 12, color: C.ts, textAlign: 'center', lineHeight: 18 },
  addNewsButton: { marginBottom: 14 },
  addNewsInner: { borderRadius: 16, paddingVertical: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  addNewsText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  newsLink: { fontSize: 11, color: C.gold, marginBottom: 11 },
  newsActions: { flexDirection: 'row', gap: 9 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 13, backgroundColor: 'rgba(148,88,224,0.1)', borderWidth: 1, borderColor: 'rgba(148,88,224,0.25)', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 },
  deleteAction: { backgroundColor: 'rgba(212,79,79,0.08)', borderColor: 'rgba(212,79,79,0.22)' },
  actionText: { fontSize: 12, fontWeight: '700', color: C.purpleL },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'center', padding: 18 },
  modalCard: { maxHeight: '88%', backgroundColor: '#100426', borderWidth: 1, borderColor: C.bHi, borderRadius: 22, padding: 18 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: C.tp },
  modalSub: { fontSize: 11, color: C.ts, marginTop: 2 },
  closeBtn: { width: 32, height: 32, borderRadius: 11, backgroundColor: C.surfHi, borderWidth: 1, borderColor: C.b, alignItems: 'center', justifyContent: 'center' },
  modalBody: { fontSize: 12.5, color: C.ts, lineHeight: 20, marginTop: 12, marginBottom: 14 },
  infoLine: { flexDirection: 'row', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.b },
  infoLabel: { fontSize: 10, color: C.tm, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
  infoValue: { fontSize: 12.5, color: C.tp, marginTop: 2 },
  statusActions: { flexDirection: 'row', gap: 8, marginTop: 16 },
  statusAction: { flex: 1, paddingVertical: 10, borderRadius: 13, borderWidth: 1, borderColor: C.bHi, backgroundColor: C.surf },
  statusActionActive: { backgroundColor: C.purple, borderColor: C.purple },
  statusActionText: { textAlign: 'center', color: C.ts, fontSize: 11, fontWeight: '800', textTransform: 'capitalize' },
  statusActionTextActive: { color: '#fff' },
  label: { fontSize: 10, fontWeight: '800', color: C.tm, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 7, marginTop: 4 },
  input: { width: '100%', paddingVertical: 11, paddingHorizontal: 13, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: C.b, borderRadius: 13, fontSize: 12.5, color: C.tp, marginBottom: 12 },
  textArea: { minHeight: 105, textAlignVertical: 'top' },
  categoryWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 13 },
  categoryChip: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 18, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b },
  categoryChipActive: { backgroundColor: 'rgba(196,141,56,0.16)', borderColor: 'rgba(196,141,56,0.4)' },
  categoryText: { fontSize: 11, fontWeight: '700', color: C.ts },
  categoryTextActive: { color: C.gold },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 12, paddingHorizontal: 13, borderRadius: 14, borderWidth: 1, borderColor: C.b, backgroundColor: C.surf, marginBottom: 12 },
  switchTitle: { fontSize: 13, fontWeight: '800', color: C.tp },
  switchSub: { fontSize: 10.5, color: C.ts, marginTop: 2 },
  saveBtn: { borderRadius: 15, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  saveText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  disabledBtn: { opacity: 0.55 },
});
