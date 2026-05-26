import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import {
  Search, X, Star, Clock, Phone, ChevronLeft,
  Utensils, Hotel, Banknote, Store,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import { BUSINESSES } from '../../shared/data';

const ICON_MAP = { Utensils, Hotel, Banknote, Store };

export default function BusinessDirectoryScreen({ navigation }) {
  const [activeCat, setActiveCat] = useState('Restaurants');
  const [search,    setSearch]    = useState('');

  const current  = BUSINESSES.find(b => b.cat === activeCat);
  const filtered = current?.items.filter(i =>
    !search ||
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.desc.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        {navigation && (
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={16} color="#EBE3D6" strokeWidth={2}/>
          </TouchableOpacity>
        )}
        <View>
          <Text style={s.title}>Business Directory</Text>
          <Text style={s.sub}>Redemption City local businesses</Text>
        </View>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <View style={s.searchBar}>
          <Search size={14} color={C.ts} strokeWidth={1.8}/>
          <TextInput
            style={s.searchInput} value={search} onChangeText={setSearch}
            placeholder="Search businesses..." placeholderTextColor={C.tm}
          />
          {search ? (
            <TouchableOpacity onPress={()=>setSearch('')}>
              <X size={14} color={C.ts} strokeWidth={2}/>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll} contentContainerStyle={s.catContent}>
        {BUSINESSES.map(b => {
          const act  = activeCat === b.cat;
          const Icon = ICON_MAP[b.iconName] || Store;
          return (
            <TouchableOpacity
              key={b.cat}
              style={[s.catBtn, act && { backgroundColor:b.color, borderColor:'transparent' }]}
              onPress={() => { setActiveCat(b.cat); setSearch(''); }}
              activeOpacity={0.8}
            >
              <Icon size={12} color={act?'#fff':C.ts} strokeWidth={2}/>
              <Text style={[s.catTxt, act && { color:'#fff' }]}> {b.cat.split(' ')[0]}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Listings */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {filtered.length === 0 ? (
          <Text style={s.empty}>No results for "{search}"</Text>
        ) : (
          filtered.map((item, i) => (
            <View key={i} style={s.listingCard}>
              <View style={s.listingTop}>
                <Text style={s.listingName}>{item.name}</Text>
                <View style={s.ratingRow}>
                  <Star size={9} color={C.gold} fill={C.gold} strokeWidth={0}/>
                  <Text style={s.ratingTxt}> {item.rating}</Text>
                </View>
              </View>
              <Text style={s.listingDesc} numberOfLines={2}>{item.desc}</Text>
              <View style={s.listingFooter}>
                <View style={s.hoursRow}>
                  <Clock size={10} color={C.ts} strokeWidth={2}/>
                  <Text style={s.hoursTxt}> {item.hours}</Text>
                </View>
                <TouchableOpacity
                  style={[s.phoneChip, { backgroundColor:`${current.color}15`, borderColor:`${current.color}25` }]}
                  activeOpacity={0.8}
                >
                  <Phone size={10} color={current.color} strokeWidth={2.5}/>
                  <Text style={[s.phoneTxt, { color:current.color }]}> {item.phone}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex:1, backgroundColor:'#08011A' },
  header:      { paddingHorizontal:18, paddingTop:14, paddingBottom:12, flexDirection:'row', alignItems:'center', gap:10 },
  backBtn:     { width:34, height:34, borderRadius:10, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', alignItems:'center', justifyContent:'center' },
  title:       { fontSize:18, fontWeight:'700', color:'#EBE3D6' },
  sub:         { fontSize:11, color:'#8C7DA0' },
  searchWrap:  { paddingHorizontal:18, paddingBottom:14 },
  searchBar:   { flexDirection:'row', alignItems:'center', gap:10, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:14, paddingHorizontal:14, paddingVertical:11 },
  searchInput: { flex:1, fontSize:13, color:'#EBE3D6', padding:0 },
  catScroll:   { flexGrow:0, marginBottom:16 },
  catContent:  { paddingHorizontal:18, gap:8 },
  catBtn:      { flexDirection:'row', alignItems:'center', paddingHorizontal:14, paddingVertical:8, borderRadius:20, borderWidth:1, borderColor:'rgba(255,255,255,0.07)', backgroundColor:'rgba(255,255,255,0.04)' },
  catTxt:      { fontSize:11.5, fontWeight:'600', color:'#8C7DA0' },
  scroll:      { paddingHorizontal:18, paddingBottom:8 },
  listingCard: { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:14, paddingHorizontal:16, marginBottom:12 },
  listingTop:  { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 },
  listingName: { fontSize:14, fontWeight:'700', color:'#EBE3D6', flex:1, marginRight:8 },
  ratingRow:   { flexDirection:'row', alignItems:'center' },
  ratingTxt:   { fontSize:10.5, color:'#C48D38', fontWeight:'600' },
  listingDesc: { fontSize:11.5, color:'#8C7DA0', lineHeight:17, marginBottom:10 },
  listingFooter:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  hoursRow:    { flexDirection:'row', alignItems:'center' },
  hoursTxt:    { fontSize:10.5, color:'#8C7DA0' },
  phoneChip:   { flexDirection:'row', alignItems:'center', paddingHorizontal:10, paddingVertical:5, borderRadius:10, borderWidth:1 },
  phoneTxt:    { fontSize:10.5, fontWeight:'600' },
  empty:       { fontSize:13, color:'#8C7DA0', textAlign:'center', paddingVertical:40 },
});
