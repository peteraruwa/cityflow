import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert, Image, View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  Package, MapPin, Clock, Phone, Shield, ChevronDown, ChevronUp,
  Tag, Send, CheckCircle, User, ChevronLeft, Camera, Users,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import { FOUND_ITEMS, CATS_LOST } from '../../shared/data';
import { auth, db, storage } from '../../shared/config/firebase';
import { useUserProfile } from '../../shared/context/UserContext';
import { CAMP_LOCATIONS } from '../navigation/data/locations';

const PEND_COLOR = '#C48D38';
const CLMD_COLOR = '#3DAA6A';
const APPR_COLOR = '#9458E0';

const LOCATION_SUGGESTIONS = CAMP_LOCATIONS
  .map((location) => location.shortName || location.name)
  .filter(Boolean);
const QUICK_LOCATIONS = LOCATION_SUGGESTIONS.slice(0, 10);
const EMPTY_FORM = {
  reportKind: 'item',
  itemName: '',
  personName: '',
  age: '',
  gender: '',
  lastSeenWearing: '',
  category: '',
  description: '',
  dateLost: '',
  timeLost: '',
  locationLost: '',
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  relationship: '',
  photo: null,
};

export default function LostAndFoundScreen() {
  const navigation = useNavigation();
  const { user } = useUserProfile();
  const [subTab,     setSubTab]     = useState('found');
  const [expandedId, setExpandedId] = useState(null);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [remoteItems, setRemoteItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    let mounted = true;

    async function loadApprovedReports() {
      try {
        const snap = await getDocs(query(collection(db, 'lostAndFoundReports'), orderBy('createdAt', 'desc')));
        const approved = snap.docs
          .map((item) => ({ id: item.id, ...item.data() }))
          .filter((item) => ['approved', 'claimed', 'resolved'].includes(String(item.status || '').toLowerCase()))
          .map(mapReportToFoundItem);
        if (mounted) setRemoteItems(approved);
      } catch (err) {
        console.warn('Could not load approved lost and found reports:', err?.code || err?.message);
      }
    }

    loadApprovedReports();
    return () => {
      mounted = false;
    };
  }, []);

  const foundItems = useMemo(() => [...remoteItems, ...FOUND_ITEMS], [remoteItems]);

  function upd(field, val) {
    setSubmitError('');
    setForm(f => ({ ...f, [field]:val }));
  }

  async function pickPhoto(source = 'library') {
    try {
      const permission = source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permission needed', source === 'camera'
          ? 'Camera permission is required to take a report photo.'
          : 'Photo library permission is required to attach a report photo.');
        return;
      }

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.65 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.65 });

      if (!result.canceled && result.assets?.[0]) {
        upd('photo', result.assets[0]);
      }
    } catch (err) {
      Alert.alert('Photo unavailable', err?.message || 'Please try again.');
    }
  }

  const locationQuery = form.locationLost.trim().toLowerCase();
  const matchingLocations = locationQuery.length < 2
    ? []
    : CAMP_LOCATIONS
        .filter((location) => [location.name, location.shortName, location.description, location.category, location.subcategory, location.address]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(locationQuery)))
        .slice(0, 6);

  async function handleSubmit() {
    const isMissingPerson = form.reportKind === 'person';
    const subjectName = isMissingPerson ? form.personName.trim() : form.itemName.trim();
    if (!subjectName || !form.ownerName.trim() || !form.ownerPhone.trim()) return;
    setSubmitting(true);
    setSubmitError('');

    const firebaseUser = auth?.currentUser;
    const ownerEmail = form.ownerEmail.trim() || user?.email || firebaseUser?.email || '';
    const profileName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();

    try {
      const uploadedPhoto = form.photo
        ? await uploadReportPhoto(form.photo, firebaseUser?.uid || user?.uid || ownerEmail || 'anonymous')
        : null;
      await addDoc(collection(db, 'lostAndFoundReports'), {
        itemName: isMissingPerson ? form.personName.trim() : form.itemName.trim(),
        personName: isMissingPerson ? form.personName.trim() : '',
        age: isMissingPerson ? form.age.trim() : '',
        gender: isMissingPerson ? form.gender.trim() : '',
        lastSeenWearing: isMissingPerson ? form.lastSeenWearing.trim() : '',
        relationship: form.relationship.trim(),
        category: (form.category || 'other').trim(),
        description: form.description.trim(),
        dateLost: form.dateLost.trim(),
        timeLost: form.timeLost.trim(),
        location: form.locationLost.trim(),
        fullName: form.ownerName.trim(),
        phoneNumber: form.ownerPhone.trim(),
        email: ownerEmail,
        userId: firebaseUser?.uid || user?.uid || ownerEmail || 'anonymous',
        userName: profileName || user?.displayName || form.ownerName.trim(),
        status: 'pending',
        approvedForNews: false,
        type: isMissingPerson ? 'missing_person' : 'lost_item',
        photoUrl: uploadedPhoto?.url || '',
        photoPath: uploadedPhoto?.path || '',
        photoMeta: uploadedPhoto?.meta || null,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.warn('Lost and found report failed:', err?.code || err?.message);
      setSubmitError('We could not submit the report right now. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = {
    width:'100%', padding:12, paddingHorizontal:14,
    backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)',
    borderRadius:13, fontSize:13, color:'#EBE3D6',
  };

  return (
    <View style={s.root}>
      {/* Header with Back Button */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.75}>
          <ChevronLeft size={22} color={C.tp} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={s.headerIcon}>
          <Package size={16} color="#9458E0" strokeWidth={1.8}/>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Lost &amp; Found</Text>
          <Text style={s.headerSub}>Report or locate missing items</Text>
        </View>
      </View>

      {/* Sub-tabs */}
      <View style={s.tabBar}>
        {[['found','Found Items'],['report','Report Lost']].map(([id,lbl]) => (
          <TouchableOpacity
            key={id}
            style={[s.tabBtn, subTab===id && s.tabBtnActive]}
            onPress={() => setSubTab(id)}
            activeOpacity={0.8}
          >
            <Text style={[s.tabTxt, subTab===id && s.tabTxtActive]}>{lbl}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {subTab === 'found' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          <Text style={s.custodyTxt}>{foundItems.length} ITEMS CURRENTLY IN CUSTODY</Text>
          {foundItems.map(item => {
            const open    = expandedId === item.id;
            const status = String(item.status || 'pending').toLowerCase();
            const claimed = status === 'claimed' || status === 'resolved';
            const approved = status === 'approved';
            const statusColor = claimed ? CLMD_COLOR : approved ? APPR_COLOR : PEND_COLOR;
            return (
              <View key={item.id} style={s.itemCard}>
                <TouchableOpacity
                  style={s.itemRow}
                  onPress={() => setExpandedId(open ? null : item.id)}
                  activeOpacity={0.8}
                >
                  <View style={s.itemIcon}>
                    <Package size={16} color="#9458E0" strokeWidth={1.8}/>
                  </View>
                  <View style={{flex:1, minWidth:0}}>
                    <View style={s.itemTopRow}>
                      <Text style={s.itemName} numberOfLines={1}>{item.item}</Text>
                      <View style={[s.statusBadge, claimed ? s.statusClaimed : approved ? s.statusApproved : s.statusPending]}>
                        <Text style={[s.statusTxt, {color:statusColor}]}>
                          {claimed ? 'Claimed' : approved ? 'Approved' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                    <Text style={s.itemMeta}>{item.category}  {item.ref}</Text>
                    <View style={s.itemLocRow}>
                      <MapPin size={9} color={C.ts} strokeWidth={2}/>
                      <Text style={s.itemLoc}> {item.location}</Text>
                    </View>
                  </View>
                  {open ? <ChevronUp size={14} color={C.ts} strokeWidth={2}/> : <ChevronDown size={14} color={C.ts} strokeWidth={2}/>}
                </TouchableOpacity>
                {open && (
                  <View style={s.itemExpanded}>
                    <Text style={s.itemDesc}>{item.desc}</Text>
                    <View style={s.itemDateRow}>
                      <Clock size={10} color={C.ts} strokeWidth={2}/>
                      <Text style={s.itemDate}> {item.date}</Text>
                    </View>
                    {!claimed ? (
                      <TouchableOpacity style={s.contactSecBtn} activeOpacity={0.8}>
                        <Phone size={13} color="#9458E0" strokeWidth={2}/>
                        <Text style={s.contactSecTxt}> Contact Security · 0800-RCCG-SOS</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={s.returnedTxt}>✓ This item has been returned to its owner</Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}
          {/* Security card */}
          <View style={s.secCard}>
            <View style={s.secCardTop}>
              <Shield size={16} color="#9458E0" strokeWidth={1.8}/>
              <Text style={s.secCardTitle}> RCCG Security Department</Text>
            </View>
            {[
              [MapPin,'Gate B Command Post, Redemption City'],
              [Phone, '0800-RCCG-SOS (0800-7224-767)'],
              [Clock, 'Available 24/7 during camp programmes'],
            ].map(([Icon,txt],i) => (
              <View key={i} style={s.secRow}>
                <Icon size={11} color="#9458E0" strokeWidth={2}/>
                <Text style={s.secTxt}> {txt}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {subTab === 'report' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          {submitted ? (
            <View style={s.successCard}>
              <View style={s.successIcon}>
                <CheckCircle size={26} color="#3DAA6A" strokeWidth={1.8}/>
              </View>
              <Text style={s.successTitle}>Report Submitted</Text>
              <Text style={s.successBody}>Your lost item report has been received.{'\n'}Security will review it within 24 hours.</Text>
              <Text style={s.successRef}>Reference: <Text style={{color:C.gold,fontWeight:'600'}}>LF-2024-{Math.floor(4044+Math.random()*100)}</Text></Text>
              <TouchableOpacity style={s.reportAnotherBtn} onPress={()=>{ setSubmitted(false); setSubmitError(''); setForm(EMPTY_FORM); }}>
                <Text style={s.reportAnotherTxt}>Report Another Item</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{gap:18}}>
              {/* Item Details */}
              <View style={s.formCard}>
                <View style={s.formSectionTitle}>
                  <Tag size={14} color={C.gold} strokeWidth={1.8}/>
                  <Text style={s.formSectionTitleTxt}> Report Details</Text>
                </View>
                <Text style={s.label}>REPORT TYPE</Text>
                <View style={s.typeSwitch}>
                  {[
                    ['item', 'Lost Item', Package],
                    ['person', 'Missing Person', Users],
                  ].map(([kind, label, Icon]) => (
                    <TouchableOpacity key={kind} style={[s.typeBtn, form.reportKind===kind&&s.typeBtnActive]} onPress={()=>upd('reportKind',kind)} activeOpacity={0.8}>
                      <Icon size={13} color={form.reportKind===kind ? '#fff' : C.ts} strokeWidth={2}/>
                      <Text style={[s.typeBtnText, form.reportKind===kind&&{color:'#fff'}]}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {form.reportKind === 'person' ? (
                  <>
                    <Text style={[s.label,{marginTop:12}]}>MISSING PERSON NAME *</Text>
                    <TextInput style={inputStyle} value={form.personName} onChangeText={v=>upd('personName',v)} placeholder="e.g. David Adeyemi" placeholderTextColor={C.tm}/>
                    <View style={s.twoCol}>
                      <View style={{flex:1}}>
                        <Text style={[s.label,{marginTop:12}]}>AGE</Text>
                        <TextInput style={inputStyle} value={form.age} onChangeText={v=>upd('age',v)} placeholder="e.g. 8" placeholderTextColor={C.tm} keyboardType="number-pad"/>
                      </View>
                      <View style={{flex:1}}>
                        <Text style={[s.label,{marginTop:12}]}>GENDER</Text>
                        <TextInput style={inputStyle} value={form.gender} onChangeText={v=>upd('gender',v)} placeholder="e.g. Female" placeholderTextColor={C.tm}/>
                      </View>
                    </View>
                    <Text style={[s.label,{marginTop:12}]}>LAST SEEN WEARING</Text>
                    <TextInput style={inputStyle} value={form.lastSeenWearing} onChangeText={v=>upd('lastSeenWearing',v)} placeholder="Clothing, footwear, bag, badge..." placeholderTextColor={C.tm}/>
                  </>
                ) : (
                  <>
                    <Text style={[s.label,{marginTop:12}]}>ITEM NAME *</Text>
                    <TextInput style={inputStyle} value={form.itemName} onChangeText={v=>upd('itemName',v)} placeholder="e.g. Black Samsung Galaxy S21" placeholderTextColor={C.tm}/>
                    <Text style={[s.label,{marginTop:12}]}>CATEGORY</Text>
                    <View style={s.catPills}>
                      {CATS_LOST.map(c => (
                        <TouchableOpacity key={c} style={[s.catPill, form.category===c&&s.catPillActive]} onPress={()=>upd('category',c)} activeOpacity={0.8}>
                          <Text style={[s.catPillTxt, form.category===c&&{color:'#fff'}]}>{c}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}
                <Text style={[s.label,{marginTop:12}]}>DESCRIPTION</Text>
                <TextInput style={{...inputStyle, minHeight:80, textAlignVertical:'top'}} value={form.description} onChangeText={v=>upd('description',v)} placeholder={form.reportKind === 'person' ? "Complexion, height, language spoken, medical needs, identifying marks..." : "Colour, brand, model, unique identifiers..."} placeholderTextColor={C.tm} multiline/>
                <Text style={[s.label,{marginTop:12}]}>PHOTO</Text>
                <View style={s.photoRow}>
                  {form.photo?.uri ? (
                    <Image source={{ uri: form.photo.uri }} style={s.photoPreview} />
                  ) : (
                    <View style={s.photoEmpty}>
                      <Camera size={18} color={C.ts} strokeWidth={1.8}/>
                    </View>
                  )}
                  <View style={{flex:1, gap:7}}>
                    <TouchableOpacity style={s.photoBtn} onPress={()=>pickPhoto('camera')} activeOpacity={0.8}>
                      <Text style={s.photoBtnText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.photoBtn} onPress={()=>pickPhoto('library')} activeOpacity={0.8}>
                      <Text style={s.photoBtnText}>Choose from Gallery</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* When & Where */}
              <View style={s.formCard}>
                <View style={s.formSectionTitle}>
                  <Clock size={14} color={C.gold} strokeWidth={1.8}/>
                  <Text style={s.formSectionTitleTxt}> When &amp; Where</Text>
                </View>
                <Text style={s.label}>DATE LOST</Text>
                <TextInput style={inputStyle} value={form.dateLost} onChangeText={v=>upd('dateLost',v)} placeholder="e.g. 2026-06-11 or Dec 15, 2024" placeholderTextColor={C.tm}/>
                <Text style={[s.label,{marginTop:12}]}>TIME LOST</Text>
                <TextInput style={inputStyle} value={form.timeLost} onChangeText={v=>upd('timeLost',v)} placeholder="e.g. 6:00 PM" placeholderTextColor={C.tm}/>
                <Text style={[s.label,{marginTop:12}]}>LAST KNOWN LOCATION</Text>
                <TextInput
                  style={inputStyle}
                  value={form.locationLost}
                  onChangeText={v=>upd('locationLost',v)}
                  placeholder="Type exact place, landmark, road, row, or nearby description..."
                  placeholderTextColor={C.tm}
                  autoCapitalize="words"
                />
                <Text style={s.locationHelper}>Choose a known place below, or type any location if it is not listed.</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:8}} keyboardShouldPersistTaps="handled">
                  {QUICK_LOCATIONS.map(l => (
                    <TouchableOpacity key={l} style={[s.catPill, form.locationLost===l&&s.catPillActive, {marginRight:6}]} onPress={()=>upd('locationLost',l)} activeOpacity={0.8}>
                      <Text style={[s.catPillTxt, form.locationLost===l&&{color:'#fff'}]}>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {matchingLocations.length > 0 && (
                  <View style={s.locationMatches}>
                    {matchingLocations.map((location) => {
                      const label = location.shortName || location.name;
                      return (
                        <TouchableOpacity key={location.id} onPress={()=>upd('locationLost', label)} activeOpacity={0.78} style={s.locationMatchRow}>
                          <View style={s.locationMatchIcon}>
                            <Text style={s.locationMatchIconText}>{location.icon}</Text>
                          </View>
                          <View style={{flex:1}}>
                            <Text style={s.locationMatchName} numberOfLines={1}>{location.name}</Text>
                            <Text style={s.locationMatchSub} numberOfLines={1}>{location.description}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
              {/* Owner Info */}
              <View style={s.formCard}>
                <View style={s.formSectionTitle}>
                  <User size={14} color={C.gold} strokeWidth={1.8}/>
                  <Text style={s.formSectionTitleTxt}> Owner Information</Text>
                </View>
                {[
                  ['ownerName', 'FULL NAME *', 'e.g. Peter Adeyemi', 'default'],
                  ['ownerPhone','PHONE NUMBER *','e.g. 08012345678','phone-pad'],
                  ['ownerEmail','EMAIL (OPTIONAL)','e.g. peter@example.com','email-address'],
                  ['relationship','RELATIONSHIP / ROLE','e.g. Parent, guardian, owner, security volunteer','default'],
                ].map(([field,lbl,ph,kb]) => (
                  <View key={field} style={{marginBottom:12}}>
                    <Text style={s.label}>{lbl}</Text>
                    <TextInput style={inputStyle} value={form[field]} onChangeText={v=>upd(field,v)} placeholder={ph} placeholderTextColor={C.tm} keyboardType={kb}/>
                  </View>
                ))}
              </View>
              {/* Submit */}
              {!!submitError && <Text style={s.submitError}>{submitError}</Text>}
              <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85} style={{marginBottom:8}}>
                <LinearGradient
                  colors={(!(form.reportKind === 'person' ? form.personName : form.itemName)||!form.ownerName||!form.ownerPhone)?['rgba(113,40,206,0.3)','rgba(113,40,206,0.3)']:['#7128CE','#5A18A8']}
                  start={{x:0,y:0}} end={{x:1,y:1}}
                  style={s.submitBtn}
                >
                  {submitting
                    ? <ActivityIndicator color="#fff" size="small"/>
                    : <><Send size={14} color="#fff" strokeWidth={2}/><Text style={s.submitBtnTxt}> Submit Report</Text></>}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root:            { flex: 1, backgroundColor: '#08011A' },
  header:          { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn:         { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', alignItems: 'center', justifyContent: 'center' },
  headerIcon:      { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(113,40,206,0.15)', borderWidth: 1, borderColor: 'rgba(113,40,206,0.25)', alignItems: 'center', justifyContent: 'center' },
  headerTitle:     { fontSize: 18, fontWeight: '700', color: '#EBE3D6' },
  headerSub:       { fontSize: 11, color: '#8C7DA0' },
  tabBar:          { flexDirection: 'row', marginHorizontal: 18, marginTop: 14, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 3 },
  tabBtn:          { flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: 'center' },
  tabBtnActive:    { backgroundColor: '#7128CE' },
  tabTxt:          { fontSize: 12, fontWeight: '600', color: '#8C7DA0' },
  tabTxtActive:    { color: '#fff' },
  scroll:          { padding: 18, paddingTop: 14 },
  custodyTxt:      { fontSize: 11, color: '#8C7DA0', fontWeight: '500', marginBottom: 12 },
  itemCard:        { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', marginBottom: 12 },
  itemRow:         { padding: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  itemIcon:        { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(113,40,206,0.12)', borderWidth: 1, borderColor: 'rgba(113,40,206,0.22)', alignItems: 'center', justifyContent: 'center' },
  itemTopRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  itemName:        { fontSize: 13.5, fontWeight: '700', color: '#EBE3D6', flex: 1, marginRight: 8, lineHeight: 18 },
  statusBadge:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  statusPending:   { backgroundColor: 'rgba(196,141,56,0.15)', borderColor: 'rgba(196,141,56,0.3)' },
  statusApproved:  { backgroundColor: 'rgba(148,88,224,0.15)', borderColor: 'rgba(148,88,224,0.3)' },
  statusClaimed:   { backgroundColor: 'rgba(61,170,106,0.15)', borderColor: 'rgba(61,170,106,0.3)' },
  statusTxt:       { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  itemMeta:        { fontSize: 10, color: '#8C7DA0', marginBottom: 4 },
  itemLocRow:      { flexDirection: 'row', alignItems: 'center' },
  itemLoc:         { fontSize: 10.5, color: '#8C7DA0' },
  itemExpanded:    { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', padding: 14, paddingHorizontal: 16 },
  itemDesc:        { fontSize: 12, color: '#8C7DA0', lineHeight: 18, marginBottom: 12 },
  itemDateRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemDate:        { fontSize: 10.5, color: '#8C7DA0' },
  contactSecBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 11, borderRadius: 12, backgroundColor: 'rgba(113,40,206,0.12)', borderWidth: 1, borderColor: 'rgba(113,40,206,0.3)' },
  contactSecTxt:   { fontSize: 12, fontWeight: '600', color: '#9458E0' },
  returnedTxt:     { fontSize: 12, color: '#3DAA6A', fontWeight: '500', textAlign: 'center', paddingVertical: 8 },
  secCard:         { marginTop: 18, backgroundColor: 'rgba(113,40,206,0.08)', borderWidth: 1, borderColor: 'rgba(113,40,206,0.2)', borderRadius: 18, padding: 16 },
  secCardTop:      { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  secCardTitle:    { fontSize: 13, fontWeight: '700', color: '#EBE3D6' },
  secRow:          { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  secTxt:          { fontSize: 11.5, color: '#8C7DA0' },
  formCard:        { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 18, padding: 16 },
  formSectionTitle:{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  formSectionTitleTxt:{ fontSize: 13, fontWeight: '700', color: '#EBE3D6' },
  label:           { fontSize: 11, fontWeight: '600', color: '#8C7DA0', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 7 },
  typeSwitch:      { flexDirection: 'row', gap: 8 },
  typeBtn:         { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 13, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.04)' },
  typeBtnActive:   { backgroundColor: '#7128CE', borderColor: 'transparent' },
  typeBtnText:     { fontSize: 11.5, fontWeight: '700', color: '#8C7DA0' },
  twoCol:          { flexDirection: 'row', gap: 10 },
  catPills:        { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  catPill:         { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.04)' },
  catPillActive:   { backgroundColor: '#7128CE', borderColor: 'transparent' },
  catPillTxt:      { fontSize: 11, fontWeight: '500', color: '#8C7DA0' },
  locationHelper:  { fontSize: 10.5, color: '#8C7DA0', lineHeight: 15, marginTop: 7 },
  locationMatches: { marginTop: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.035)' },
  locationMatchRow:{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  locationMatchIcon:{ width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(113,40,206,0.12)', borderWidth: 1, borderColor: 'rgba(113,40,206,0.22)' },
  locationMatchIconText:{ fontSize: 9, color: '#EBE3D6', fontWeight: '800', letterSpacing: 0.4 },
  locationMatchName:{ fontSize: 12, color: '#EBE3D6', fontWeight: '700' },
  locationMatchSub:{ fontSize: 10.5, color: '#8C7DA0', marginTop: 1 },
  photoRow:        { flexDirection: 'row', gap: 12, alignItems: 'center' },
  photoPreview:    { width: 82, height: 82, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)' },
  photoEmpty:      { width: 82, height: 82, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center' },
  photoBtn:        { paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,88,224,0.28)', backgroundColor: 'rgba(148,88,224,0.1)', alignItems: 'center' },
  photoBtnText:    { color: '#9458E0', fontSize: 11.5, fontWeight: '800' },
  submitError:     { fontSize: 12, color: '#FFB4A8', lineHeight: 17, textAlign: 'center', marginTop: -4 },
  submitBtn:       { width: '100%', paddingVertical: 14, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  submitBtnTxt:    { fontSize: 14, fontWeight: '600', color: '#fff' },
  successCard:     { backgroundColor: 'rgba(61,170,106,0.08)', borderWidth: 1, borderColor: 'rgba(61,170,106,0.22)', borderRadius: 22, padding: 28, alignItems: 'center' },
  successIcon:     { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(61,170,106,0.15)', borderWidth: 1, borderColor: 'rgba(61,170,106,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle:    { fontSize: 17, fontWeight: '700', color: '#EBE3D6', marginBottom: 6 },
  successBody:     { fontSize: 12.5, color: '#8C7DA0', lineHeight: 19, marginBottom: 8, textAlign: 'center' },
  successRef:      { fontSize: 11, color: '#8C7DA0', marginBottom: 20 },
  reportAnotherBtn:{ paddingHorizontal: 32, paddingVertical: 11, borderRadius: 13, backgroundColor: '#7128CE' },
  reportAnotherTxt:{ fontSize: 13, fontWeight: '600', color: '#fff' },
});

function mapReportToFoundItem(item) {
  const itemName = item.itemName || item.item || 'Lost item';
  const created = item.createdAt?.toDate ? item.createdAt.toDate() : null;
  const isMissingPerson = item.type === 'missing_person';
  return {
    id: `report-${item.id}`,
    item: isMissingPerson ? `Missing Person: ${itemName}` : itemName,
    category: isMissingPerson ? 'Missing Person' : item.category || 'Other',
    desc: [
      item.description,
      isMissingPerson && item.age ? `Age: ${item.age}` : null,
      isMissingPerson && item.gender ? `Gender: ${item.gender}` : null,
      isMissingPerson && item.lastSeenWearing ? `Last seen wearing: ${item.lastSeenWearing}` : null,
    ].filter(Boolean).join('\n') || 'No description provided.',
    location: item.location || 'Location not specified',
    date: created ? created.toLocaleDateString() : item.dateLost || 'Recently',
    status: item.status || 'approved',
    ref: item.ref || `LF-${String(item.id).slice(0, 6).toUpperCase()}`,
  };
}

async function uploadReportPhoto(photo, ownerId) {
  const response = await fetch(photo.uri);
  const blob = await response.blob();
  const extension = photo.fileName?.split('.').pop() || 'jpg';
  const path = `lost-found-reports/${ownerId}/${Date.now()}.${extension}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, {
    contentType: photo.mimeType || 'image/jpeg',
  });
  const url = await getDownloadURL(storageRef);
  return {
    url,
    path,
    meta: {
      fileName: photo.fileName || '',
      mimeType: photo.mimeType || 'image/jpeg',
      width: photo.width || null,
      height: photo.height || null,
    },
  };
}
