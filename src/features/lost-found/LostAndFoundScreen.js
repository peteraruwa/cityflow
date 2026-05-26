import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Package, MapPin, Clock, Phone, Shield, ChevronDown, ChevronUp,
  Tag, Send, CheckCircle, User,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import { FOUND_ITEMS, CATS_LOST, LOCATIONS } from '../../shared/data';

const PEND_COLOR = '#C48D38';
const CLMD_COLOR = '#3DAA6A';

export default function LostAndFoundScreen() {
  const [subTab,     setSubTab]     = useState('found');
  const [expandedId, setExpandedId] = useState(null);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    itemName:'', category:'', description:'', dateLost:'', locationLost:'', ownerName:'', ownerPhone:'', ownerEmail:''
  });

  function upd(field, val) { setForm(f => ({ ...f, [field]:val })); }

  function handleSubmit() {
    if (!form.itemName.trim() || !form.ownerName.trim() || !form.ownerPhone.trim()) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1400);
  }

  const inputStyle = {
    width:'100%', padding:12, paddingHorizontal:14,
    backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)',
    borderRadius:13, fontSize:13, color:'#EBE3D6',
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerIcon}>
          <Package size={16} color="#9458E0" strokeWidth={1.8}/>
        </View>
        <View>
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
          <Text style={s.custodyTxt}>{FOUND_ITEMS.length} ITEMS CURRENTLY IN CUSTODY</Text>
          {FOUND_ITEMS.map(item => {
            const open    = expandedId === item.id;
            const claimed = item.status === 'claimed';
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
                      <View style={[s.statusBadge, claimed?s.statusClaimed:s.statusPending]}>
                        <Text style={[s.statusTxt, {color:claimed?CLMD_COLOR:PEND_COLOR}]}>
                          {claimed?'Claimed':'Pending'}
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
              <TouchableOpacity style={s.reportAnotherBtn} onPress={()=>{ setSubmitted(false); setForm({itemName:'',category:'',description:'',dateLost:'',locationLost:'',ownerName:'',ownerPhone:'',ownerEmail:''}); }}>
                <Text style={s.reportAnotherTxt}>Report Another Item</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{gap:18}}>
              {/* Item Details */}
              <View style={s.formCard}>
                <View style={s.formSectionTitle}>
                  <Tag size={14} color={C.gold} strokeWidth={1.8}/>
                  <Text style={s.formSectionTitleTxt}> Item Details</Text>
                </View>
                <Text style={s.label}>ITEM NAME *</Text>
                <TextInput style={inputStyle} value={form.itemName} onChangeText={v=>upd('itemName',v)} placeholder="e.g. Black Samsung Galaxy S21" placeholderTextColor={C.tm}/>
                <Text style={[s.label,{marginTop:12}]}>CATEGORY</Text>
                <View style={s.catPills}>
                  {CATS_LOST.map(c => (
                    <TouchableOpacity key={c} style={[s.catPill, form.category===c&&s.catPillActive]} onPress={()=>upd('category',c)} activeOpacity={0.8}>
                      <Text style={[s.catPillTxt, form.category===c&&{color:'#fff'}]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[s.label,{marginTop:12}]}>DESCRIPTION</Text>
                <TextInput style={{...inputStyle, minHeight:80, textAlignVertical:'top'}} value={form.description} onChangeText={v=>upd('description',v)} placeholder="Colour, brand, model, unique identifiers..." placeholderTextColor={C.tm} multiline/>
              </View>
              {/* When & Where */}
              <View style={s.formCard}>
                <View style={s.formSectionTitle}>
                  <Clock size={14} color={C.gold} strokeWidth={1.8}/>
                  <Text style={s.formSectionTitleTxt}> When &amp; Where</Text>
                </View>
                <Text style={s.label}>DATE &amp; TIME LOST</Text>
                <TextInput style={inputStyle} value={form.dateLost} onChangeText={v=>upd('dateLost',v)} placeholder="e.g. Dec 15, 2024 around 2:00 PM" placeholderTextColor={C.tm}/>
                <Text style={[s.label,{marginTop:12}]}>LAST KNOWN LOCATION</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:4}}>
                  {LOCATIONS.map(l => (
                    <TouchableOpacity key={l} style={[s.catPill, form.locationLost===l&&s.catPillActive, {marginRight:6}]} onPress={()=>upd('locationLost',l)} activeOpacity={0.8}>
                      <Text style={[s.catPillTxt, form.locationLost===l&&{color:'#fff'}]}>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
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
                ].map(([field,lbl,ph,kb]) => (
                  <View key={field} style={{marginBottom:12}}>
                    <Text style={s.label}>{lbl}</Text>
                    <TextInput style={inputStyle} value={form[field]} onChangeText={v=>upd(field,v)} placeholder={ph} placeholderTextColor={C.tm} keyboardType={kb}/>
                  </View>
                ))}
              </View>
              {/* Submit */}
              <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85} style={{marginBottom:8}}>
                <LinearGradient
                  colors={(!form.itemName||!form.ownerName||!form.ownerPhone)?['rgba(113,40,206,0.3)','rgba(113,40,206,0.3)']:['#7128CE','#5A18A8']}
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
  root:            { flex:1, backgroundColor:'#08011A' },
  header:          { paddingHorizontal:22, paddingTop:18, flexDirection:'row', alignItems:'center', gap:10, marginBottom:4 },
  headerIcon:      { width:34, height:34, borderRadius:10, backgroundColor:'rgba(113,40,206,0.15)', borderWidth:1, borderColor:'rgba(113,40,206,0.25)', alignItems:'center', justifyContent:'center' },
  headerTitle:     { fontSize:18, fontWeight:'700', color:'#EBE3D6' },
  headerSub:       { fontSize:11, color:'#8C7DA0' },
  tabBar:          { flexDirection:'row', marginHorizontal:18, marginTop:14, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:14, padding:3 },
  tabBtn:          { flex:1, paddingVertical:9, borderRadius:11, alignItems:'center' },
  tabBtnActive:    { backgroundColor:'#7128CE' },
  tabTxt:          { fontSize:12, fontWeight:'600', color:'#8C7DA0' },
  tabTxtActive:    { color:'#fff' },
  scroll:          { padding:18, paddingTop:14 },
  custodyTxt:      { fontSize:11, color:'#8C7DA0', fontWeight:'500', marginBottom:12 },
  itemCard:        { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden', marginBottom:12 },
  itemRow:         { padding:14, paddingHorizontal:16, flexDirection:'row', gap:12, alignItems:'flex-start' },
  itemIcon:        { width:36, height:36, borderRadius:10, backgroundColor:'rgba(113,40,206,0.12)', borderWidth:1, borderColor:'rgba(113,40,206,0.22)', alignItems:'center', justifyContent:'center' },
  itemTopRow:      { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:5 },
  itemName:        { fontSize:13.5, fontWeight:'700', color:'#EBE3D6', flex:1, marginRight:8, lineHeight:18 },
  statusBadge:     { paddingHorizontal:8, paddingVertical:3, borderRadius:20, borderWidth:1 },
  statusPending:   { backgroundColor:'rgba(196,141,56,0.15)', borderColor:'rgba(196,141,56,0.3)' },
  statusClaimed:   { backgroundColor:'rgba(61,170,106,0.15)', borderColor:'rgba(61,170,106,0.3)' },
  statusTxt:       { fontSize:9, fontWeight:'700', letterSpacing:0.8, textTransform:'uppercase' },
  itemMeta:        { fontSize:10, color:'#8C7DA0', marginBottom:4 },
  itemLocRow:      { flexDirection:'row', alignItems:'center' },
  itemLoc:         { fontSize:10.5, color:'#8C7DA0' },
  itemExpanded:    { borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.07)', padding:14, paddingHorizontal:16 },
  itemDesc:        { fontSize:12, color:'#8C7DA0', lineHeight:18, marginBottom:12 },
  itemDateRow:     { flexDirection:'row', alignItems:'center', marginBottom:12 },
  itemDate:        { fontSize:10.5, color:'#8C7DA0' },
  contactSecBtn:   { flexDirection:'row', alignItems:'center', justifyContent:'center', paddingVertical:11, borderRadius:12, backgroundColor:'rgba(113,40,206,0.12)', borderWidth:1, borderColor:'rgba(113,40,206,0.3)' },
  contactSecTxt:   { fontSize:12, fontWeight:'600', color:'#9458E0' },
  returnedTxt:     { fontSize:12, color:'#3DAA6A', fontWeight:'500', textAlign:'center', paddingVertical:8 },
  secCard:         { marginTop:18, backgroundColor:'rgba(113,40,206,0.08)', borderWidth:1, borderColor:'rgba(113,40,206,0.2)', borderRadius:18, padding:16 },
  secCardTop:      { flexDirection:'row', alignItems:'center', marginBottom:10 },
  secCardTitle:    { fontSize:13, fontWeight:'700', color:'#EBE3D6' },
  secRow:          { flexDirection:'row', alignItems:'center', marginBottom:7 },
  secTxt:          { fontSize:11.5, color:'#8C7DA0' },
  formCard:        { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:16 },
  formSectionTitle:{ flexDirection:'row', alignItems:'center', marginBottom:14 },
  formSectionTitleTxt:{ fontSize:13, fontWeight:'700', color:'#EBE3D6' },
  label:           { fontSize:11, fontWeight:'600', color:'#8C7DA0', letterSpacing:0.6, textTransform:'uppercase', marginBottom:7 },
  catPills:        { flexDirection:'row', flexWrap:'wrap', gap:7 },
  catPill:         { paddingHorizontal:12, paddingVertical:6, borderRadius:20, borderWidth:1, borderColor:'rgba(255,255,255,0.07)', backgroundColor:'rgba(255,255,255,0.04)' },
  catPillActive:   { backgroundColor:'#7128CE', borderColor:'transparent' },
  catPillTxt:      { fontSize:11, fontWeight:'500', color:'#8C7DA0' },
  submitBtn:       { width:'100%', paddingVertical:14, borderRadius:15, flexDirection:'row', alignItems:'center', justifyContent:'center' },
  submitBtnTxt:    { fontSize:14, fontWeight:'600', color:'#fff' },
  successCard:     { backgroundColor:'rgba(61,170,106,0.08)', borderWidth:1, borderColor:'rgba(61,170,106,0.22)', borderRadius:22, padding:28, alignItems:'center' },
  successIcon:     { width:56, height:56, borderRadius:28, backgroundColor:'rgba(61,170,106,0.15)', borderWidth:1, borderColor:'rgba(61,170,106,0.3)', alignItems:'center', justifyContent:'center', marginBottom:16 },
  successTitle:    { fontSize:17, fontWeight:'700', color:'#EBE3D6', marginBottom:6 },
  successBody:     { fontSize:12.5, color:'#8C7DA0', lineHeight:19, marginBottom:8, textAlign:'center' },
  successRef:      { fontSize:11, color:'#8C7DA0', marginBottom:20 },
  reportAnotherBtn:{ paddingHorizontal:32, paddingVertical:11, borderRadius:13, backgroundColor:'#7128CE' },
  reportAnotherTxt:{ fontSize:13, fontWeight:'600', color:'#fff' },
});
