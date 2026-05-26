import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft, ChevronRight, MapPinned, Clock, CheckCircle, MapPin,
  Building2, Leaf, Coffee, Car, BookOpen, Home,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import { TOUR_STOPS } from '../../shared/data';

const ICON_MAP = { Building2, Leaf, Coffee, Car, BookOpen, Home };

export default function CityTourScreen({ navigation }) {
  const [activeStop, setActiveStop] = useState(0);
  const [completed,  setCompleted]  = useState(new Set());

  function markDone(i) {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const totalDone = completed.size;
  const pct = Math.round((totalDone / TOUR_STOPS.length) * 100);
  const stop = TOUR_STOPS[activeStop];
  const StopIcon = ICON_MAP[stop.iconName] || Building2;

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        {navigation && (
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={16} color="#EBE3D6" strokeWidth={2}/>
          </TouchableOpacity>
        )}
        <View style={{flex:1}}>
          <Text style={s.title}>Redemption City Tour</Text>
          <Text style={s.sub}>Self-guided · 8 stops · ~2 hrs</Text>
        </View>
        <Text style={s.counter}>{totalDone}/{TOUR_STOPS.length}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Progress bar */}
        <View style={s.progressWrap}>
          <View style={s.progressBg}>
            <LinearGradient
              colors={['#2A7FAB','#7128CE']}
              start={{x:0,y:0}} end={{x:1,y:0}}
              style={[s.progressFill, { width:`${pct}%` }]}
            />
          </View>
          <View style={s.progressLabels}>
            <Text style={s.progressPct}>{pct}% complete</Text>
            <Text style={s.progressRem}>{TOUR_STOPS.length - totalDone} stops remaining</Text>
          </View>
        </View>

        {/* Featured stop card */}
        <LinearGradient
          colors={[`${stop.color}22`,'rgba(10,2,24,1)']}
          start={{x:0,y:0}} end={{x:1,y:1}}
          style={[s.featuredCard, { borderColor:`${stop.color}35` }]}
        >
          <View style={s.featuredHeader}>
            <View style={[s.featuredIcon, { backgroundColor:`${stop.color}20`, borderColor:`${stop.color}35` }]}>
              <StopIcon size={20} color={stop.color} strokeWidth={1.8}/>
            </View>
            <View>
              <Text style={[s.stopBadge, { color:stop.color }]}>STOP {activeStop+1} OF {TOUR_STOPS.length}</Text>
              <Text style={s.featuredName}>{stop.name}</Text>
            </View>
          </View>
          <Text style={s.featuredDesc}>{stop.desc}</Text>
          <View style={s.featuredMeta}>
            <View style={s.metaRow}>
              <MapPinned size={11} color={C.gold} strokeWidth={2}/>
              <Text style={s.metaDist}> {stop.dist}</Text>
            </View>
            <View style={s.metaRow}>
              <Clock size={11} color={C.ts} strokeWidth={2}/>
              <Text style={s.metaDur}> {stop.duration}</Text>
            </View>
          </View>
          <View style={s.featuredBtns}>
            <TouchableOpacity
              style={[s.visitBtn, completed.has(activeStop) && s.visitBtnDone,
                !completed.has(activeStop) && { backgroundColor:stop.color }]}
              onPress={() => markDone(activeStop)}
              activeOpacity={0.8}
            >
              {completed.has(activeStop)
                ? <><CheckCircle size={13} color="#3DAA6A" strokeWidth={2}/><Text style={[s.visitBtnTxt,{color:'#3DAA6A'}]}> Visited</Text></>
                : <><MapPin size={13} color="#fff" strokeWidth={2}/><Text style={s.visitBtnTxt}> Mark Visited</Text></>}
            </TouchableOpacity>
            {activeStop < TOUR_STOPS.length - 1 && (
              <TouchableOpacity
                style={s.nextBtn}
                onPress={() => { markDone(activeStop); setActiveStop(i=>i+1); }}
                activeOpacity={0.8}
              >
                <Text style={s.nextBtnTxt}>Next</Text>
                <ChevronRight size={12} color="#EBE3D6" strokeWidth={2}/>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* All stops list */}
        <Text style={s.allStopsLabel}>ALL STOPS</Text>
        {TOUR_STOPS.map((stp, i) => {
          const Icon = ICON_MAP[stp.iconName] || Building2;
          const isActive = i === activeStop;
          return (
            <TouchableOpacity
              key={i}
              style={[s.stopRow, isActive && { backgroundColor:`${stp.color}12`, borderColor:`${stp.color}40` }]}
              onPress={() => setActiveStop(i)}
              activeOpacity={0.8}
            >
              <View style={[s.stopIcon, { backgroundColor:`${stp.color}18`, borderColor:`${stp.color}28` }]}>
                <Icon size={14} color={stp.color} strokeWidth={1.8}/>
              </View>
              <View style={{flex:1}}>
                <Text style={s.stopName}>{stp.name}</Text>
                <Text style={s.stopMeta}>{stp.dist} · {stp.duration}</Text>
              </View>
              {completed.has(i)
                ? <CheckCircle size={14} color="#3DAA6A" strokeWidth={2}/>
                : <View style={[s.stopDot, isActive && { backgroundColor:stp.color }]}/>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:           { flex:1, backgroundColor:'#08011A' },
  header:         { paddingHorizontal:18, paddingTop:14, paddingBottom:12, flexDirection:'row', alignItems:'center', gap:10 },
  backBtn:        { width:34, height:34, borderRadius:10, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', alignItems:'center', justifyContent:'center' },
  title:          { fontSize:18, fontWeight:'700', color:'#EBE3D6' },
  sub:            { fontSize:11, color:'#8C7DA0' },
  counter:        { fontSize:12, fontWeight:'700', color:'#C48D38' },
  scroll:         { padding:18, paddingTop:0, paddingBottom:20 },
  progressWrap:   { marginBottom:16 },
  progressBg:     { height:6, backgroundColor:'rgba(255,255,255,0.04)', borderRadius:6, overflow:'hidden', borderWidth:1, borderColor:'rgba(255,255,255,0.07)' },
  progressFill:   { height:'100%', borderRadius:6 },
  progressLabels: { flexDirection:'row', justifyContent:'space-between', marginTop:5 },
  progressPct:    { fontSize:10, color:'#8C7DA0' },
  progressRem:    { fontSize:10, color:'#8C7DA0' },
  featuredCard:   { borderRadius:24, borderWidth:1, padding:20, paddingHorizontal:18, marginBottom:18 },
  featuredHeader: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:14 },
  featuredIcon:   { width:44, height:44, borderRadius:13, alignItems:'center', justifyContent:'center', borderWidth:1 },
  stopBadge:      { fontSize:8.5, fontWeight:'700', letterSpacing:2, textTransform:'uppercase', marginBottom:2 },
  featuredName:   { fontSize:15, fontWeight:'700', color:'#EBE3D6' },
  featuredDesc:   { fontSize:12.5, color:'#8C7DA0', lineHeight:19, marginBottom:14 },
  featuredMeta:   { flexDirection:'row', alignItems:'center', gap:12, marginBottom:14 },
  metaRow:        { flexDirection:'row', alignItems:'center' },
  metaDist:       { fontSize:11, color:'#C48D38', fontWeight:'500' },
  metaDur:        { fontSize:11, color:'#8C7DA0' },
  featuredBtns:   { flexDirection:'row', gap:8 },
  visitBtn:       { flex:1, paddingVertical:10, borderRadius:12, flexDirection:'row', alignItems:'center', justifyContent:'center' },
  visitBtnDone:   { backgroundColor:'rgba(61,170,106,0.2)' },
  visitBtnTxt:    { fontSize:12, fontWeight:'600', color:'#fff' },
  nextBtn:        { flexDirection:'row', alignItems:'center', gap:5, paddingHorizontal:16, paddingVertical:10, borderRadius:12, borderWidth:1, borderColor:'rgba(255,255,255,0.07)', backgroundColor:'rgba(255,255,255,0.04)' },
  nextBtnTxt:     { fontSize:12, fontWeight:'600', color:'#EBE3D6' },
  allStopsLabel:  { fontSize:11, fontWeight:'700', color:'#8C7DA0', letterSpacing:1, textTransform:'uppercase', marginBottom:12 },
  stopRow:        { flexDirection:'row', alignItems:'center', gap:12, padding:12, paddingHorizontal:14, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, marginBottom:8 },
  stopIcon:       { width:32, height:32, borderRadius:10, alignItems:'center', justifyContent:'center', borderWidth:1, flexShrink:0 },
  stopName:       { fontSize:12.5, fontWeight:'600', color:'#EBE3D6', marginBottom:1 },
  stopMeta:       { fontSize:10.5, color:'#8C7DA0' },
  stopDot:        { width:8, height:8, borderRadius:4, backgroundColor:'#504460' },
});
