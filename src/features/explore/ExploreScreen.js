import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import {
  Search, X, Star, MapPinned, Building2, Home, Leaf,
  Coffee, Car, BookOpen,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import ScreenHeader from '../../shared/components/ScreenHeader';
import { EXPLORE_PLACES } from '../../shared/data';

const ICON_MAP = { Building2, Home, Leaf, Coffee, Car, BookOpen };

export default function ExploreScreen() {
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('All');
  const CATS = ['All','Worship','Stay','Dining','Spiritual','Transport','Retail'];

  const filtered = EXPLORE_PLACES.filter(p => {
    const matchCat = category === 'All' || p.cat === category;
    const matchQ   = !query || p.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <View style={s.root}>
      <ScreenHeader title="Explore" sub="Discover Redemption City"/>
      {/* Search */}
      <View style={s.searchWrap}>
        <View style={s.searchBar}>
          <Search size={15} color={C.ts} strokeWidth={1.8}/>
          <TextInput
            style={s.searchInput} value={query} onChangeText={setQuery}
            placeholder="Search places..." placeholderTextColor={C.tm}
          />
          {query ? (
            <TouchableOpacity onPress={()=>setQuery('')}>
              <X size={14} color={C.ts} strokeWidth={2}/>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {/* Category filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll} contentContainerStyle={s.catContent}>
        {CATS.map(c => (
          <TouchableOpacity
            key={c}
            style={[s.catBtn, category===c && s.catBtnActive]}
            onPress={() => setCategory(c)}
            activeOpacity={0.8}
          >
            <Text style={[s.catTxt, category===c && s.catTxtActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Grid */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.grid}>
        <View style={s.gridRow}>
          {filtered.length === 0 ? (
            <Text style={s.empty}>No places found for "{query}"</Text>
          ) : (
            filtered.map(({ iconName, name, cat, dist, color, rating },i) => {
              const Icon = ICON_MAP[iconName] || Building2;
              return (
                <TouchableOpacity key={i} style={s.placeCard} activeOpacity={0.8}>
                  <View style={[s.placeImg, { backgroundColor:`${color}18` }]}>
                    <Icon size={28} color={color} strokeWidth={1.4}/>
                  </View>
                  <View style={s.placeBody}>
                    <Text style={s.placeName} numberOfLines={2}>{name}</Text>
                    <View style={s.placeMid}>
                      <Text style={s.placeCat}>{cat}</Text>
                      <View style={s.ratingRow}>
                        <Star size={9} color={C.gold} fill={C.gold} strokeWidth={0}/>
                        <Text style={s.ratingTxt}> {rating}</Text>
                      </View>
                    </View>
                    <View style={s.distRow}>
                      <MapPinned size={9} color={C.gold} strokeWidth={2.5}/>
                      <Text style={s.distTxt}> {dist}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex:1, backgroundColor:'#08011A' },
  searchWrap:   { paddingHorizontal:18, paddingTop:12 },
  searchBar:    { flexDirection:'row', alignItems:'center', gap:10, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:14, paddingHorizontal:14, paddingVertical:11 },
  searchInput:  { flex:1, fontSize:13, color:'#EBE3D6', padding:0 },
  catScroll:    { marginTop:14, flexGrow:0 },
  catContent:   { paddingHorizontal:18, gap:8 },
  catBtn:       { paddingHorizontal:14, paddingVertical:7, borderRadius:20, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)' },
  catBtnActive: { backgroundColor:'#7128CE', borderColor:'transparent' },
  catTxt:       { fontSize:12, fontWeight:'600', color:'#8C7DA0' },
  catTxtActive: { color:'#fff' },
  grid:         { paddingHorizontal:18, paddingTop:16, paddingBottom:8 },
  gridRow:      { flexDirection:'row', flexWrap:'wrap', gap:12 },
  placeCard:    { width:'47%', backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden' },
  placeImg:     { height:76, alignItems:'center', justifyContent:'center', borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.07)' },
  placeBody:    { padding:12, paddingTop:10 },
  placeName:    { fontSize:12.5, fontWeight:'600', color:'#EBE3D6', marginBottom:4, lineHeight:17 },
  placeMid:     { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:6 },
  placeCat:     { fontSize:10, color:'#8C7DA0' },
  ratingRow:    { flexDirection:'row', alignItems:'center' },
  ratingTxt:    { fontSize:10, color:'#C48D38', fontWeight:'600' },
  distRow:      { flexDirection:'row', alignItems:'center' },
  distTxt:      { fontSize:9.5, color:'#C48D38', fontWeight:'500' },
  empty:        { fontSize:13, color:'#8C7DA0', textAlign:'center', paddingVertical:40, width:'100%' },
});
