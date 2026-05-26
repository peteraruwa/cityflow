import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ambulance, Shield, Flame, TrafficCone, ChevronLeft, MapPin } from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import PulsingDot from '../../shared/components/PulsingDot';

const SERVICES = [
  { id:'ambulance', label:'Ambulance',    sub:'Medical emergency',  color:'#D44F4F', bg:'rgba(212,79,79,0.12)',  Icon:Ambulance,   number:'199' },
  { id:'police',    label:'Police',       sub:'Crime / security',   color:'#2A7FAB', bg:'rgba(42,127,171,0.12)', Icon:Shield,      number:'112' },
  { id:'fire',      label:'Fire Service', sub:'Fire / rescue',      color:'#E07A1A', bg:'rgba(224,122,26,0.12)', Icon:Flame,       number:'190' },
  { id:'road',      label:'Road Safety',  sub:'Accident / traffic', color:'#C48D38', bg:'rgba(196,141,56,0.12)', Icon:TrafficCone, number:'122' },
];

export default function EmergencyScreen({ navigation }) {
  const [sosActive, setSosActive] = useState(null);
  const [locSent,   setLocSent]   = useState(false);

  function handleSOS(svc) {
    setSosActive(svc.id);
    setLocSent(false);
    setTimeout(() => setLocSent(true), 1200);
  }

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
          <Text style={s.title}>Emergency / SOS</Text>
          <Text style={s.sub}>One-tap access · Location auto-shared</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Alert banner */}
        <View style={s.alertBanner}>
          <PulsingDot size={8} color="#F06565"/>
          <Text style={s.alertTxt}> Tapping any button will call the service and share your GPS location with responders.</Text>
        </View>

        {/* SOS Grid */}
        <View style={s.grid}>
          {SERVICES.map(svc => {
            const active = sosActive === svc.id;
            return (
              <TouchableOpacity
                key={svc.id}
                style={[s.sosCard, { borderColor: active?svc.color:C.b, backgroundColor: active?svc.bg:C.surf }]}
                onPress={() => handleSOS(svc)}
                activeOpacity={0.8}
              >
                <View style={[s.sosIcon, { backgroundColor:`${svc.color}${active?'22':'18'}`, borderColor:`${svc.color}35` }]}>
                  <svc.Icon size={24} color={svc.color} strokeWidth={1.8}/>
                </View>
                <Text style={s.sosLabel}>{svc.label}</Text>
                <Text style={s.sosSub}>{svc.sub}</Text>
                <Text style={[s.sosNum, { color: active?svc.color:C.gold }]}>{svc.number}</Text>
                {active && locSent && (
                  <View style={s.locSentRow}>
                    <MapPin size={9} color={svc.color} strokeWidth={2.5}/>
                    <Text style={[s.locSentTxt, {color:svc.color}]}> Location sent</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* General emergency card */}
        <View style={s.generalCard}>
          <Text style={s.generalTitle}>🚨 General Emergency Line</Text>
          <Text style={s.generalNum}>112</Text>
          <Text style={s.generalBody}>Available 24/7. Dispatches nearest available emergency unit. Works even without airtime.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex:1, backgroundColor:'#08011A' },
  header:     { paddingHorizontal:18, paddingTop:14, flexDirection:'row', alignItems:'center', gap:10, paddingBottom:0 },
  backBtn:    { width:34, height:34, borderRadius:10, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', alignItems:'center', justifyContent:'center' },
  title:      { fontSize:18, fontWeight:'700', color:'#EBE3D6' },
  sub:        { fontSize:11, color:'#8C7DA0' },
  scroll:     { padding:18, paddingTop:14 },
  alertBanner:{ flexDirection:'row', alignItems:'center', backgroundColor:'rgba(212,79,79,0.1)', borderWidth:1, borderColor:'rgba(212,79,79,0.28)', borderRadius:16, padding:12, paddingHorizontal:16, marginBottom:16 },
  alertTxt:   { fontSize:12, color:'#F06565', fontWeight:'500', lineHeight:18, flex:1 },
  grid:       { flexDirection:'row', flexWrap:'wrap', gap:14, marginBottom:18 },
  sosCard:    { width:'47%', borderRadius:22, borderWidth:2, padding:18, paddingVertical:20, alignItems:'center' },
  sosIcon:    { width:52, height:52, borderRadius:16, borderWidth:1, alignItems:'center', justifyContent:'center', marginBottom:12 },
  sosLabel:   { fontSize:14, fontWeight:'700', color:'#EBE3D6', marginBottom:3 },
  sosSub:     { fontSize:10.5, color:'#8C7DA0', marginBottom:8, textAlign:'center' },
  sosNum:     { fontSize:13, fontWeight:'700' },
  locSentRow: { flexDirection:'row', alignItems:'center', marginTop:8 },
  locSentTxt: { fontSize:10, fontWeight:'600' },
  generalCard:{ backgroundColor:'rgba(212,79,79,0.07)', borderWidth:1, borderColor:'rgba(212,79,79,0.2)', borderRadius:18, padding:14, paddingHorizontal:16 },
  generalTitle:{ fontSize:12, fontWeight:'700', color:'#F06565', marginBottom:6 },
  generalNum: { fontSize:22, fontWeight:'800', color:'#EBE3D6', marginBottom:4 },
  generalBody:{ fontSize:11, color:'#8C7DA0', lineHeight:17 },
});
