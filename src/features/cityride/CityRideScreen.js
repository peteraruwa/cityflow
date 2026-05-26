import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Car, MapPin, Clock, ChevronRight, Check, CheckCircle } from 'lucide-react-native';
import { C, FONTS } from '../../shared/constants/theme';
import ScreenHeader from '../../shared/components/ScreenHeader';
import { RIDE_TYPES, RECENT_DEST } from '../../shared/data';

export default function CityRideScreen() {
  const [dest,     setDest]     = useState('');
  const [rideType, setRideType] = useState('standard');
  const [booking,  setBooking]  = useState(false);
  const [booked,   setBooked]   = useState(false);

  const selected = RIDE_TYPES.find(r => r.id === rideType);

  function handleBook() {
    if (!dest.trim()) return;
    setBooking(true);
    setTimeout(() => { setBooking(false); setBooked(true); }, 1500);
  }

  if (booked) return (
    <View style={s.root}>
      <ScreenHeader title="CityRide" sub="Your city transport"/>
      <View style={s.confirmedCard}>
        <View style={s.confirmedIcon}>
          <CheckCircle size={30} color="#3DAA6A" strokeWidth={1.8}/>
        </View>
        <Text style={s.confirmedTitle}>Ride Confirmed!</Text>
        <Text style={s.confirmedSub}>
          Your {selected.label} is on the way to Main Gate.{'\n'}Estimated arrival: {selected.eta}
        </Text>
        <View style={s.confirmedStats}>
          {[['Destination',dest],['Fare',selected.fare],['ETA',selected.eta]].map(([k,v])=>(
            <View key={k} style={{alignItems:'center'}}>
              <Text style={s.statKey}>{k}</Text>
              <Text style={s.statVal}>{v}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={s.anotherBtn}
          onPress={()=>{ setBooked(false); setDest(''); }}
        >
          <Text style={s.anotherTxt}>Book Another</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={s.root}>
      <ScreenHeader title="CityRide" sub="Fast, reliable camp transport"/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Route card */}
        <View style={s.routeCard}>
          <View style={s.routeFrom}>
            <View style={s.greenDot}/>
            <View>
              <Text style={s.routeLabel}>FROM</Text>
              <Text style={s.routeTxt}>Main Gate, Redemption City</Text>
            </View>
          </View>
          <View style={s.routeDivider}/>
          <View style={s.routeTo}>
            <MapPin size={14} color={C.gold} strokeWidth={2}/>
            <View style={{flex:1, marginLeft:12}}>
              <Text style={s.routeLabel}>TO</Text>
              <TextInput
                style={s.destInput} value={dest} onChangeText={setDest}
                placeholder="Where to?" placeholderTextColor={C.ts}
              />
            </View>
          </View>
        </View>

        {/* Recent */}
        {!dest && (
          <View style={s.recentBlock}>
            <Text style={s.sectionLabel}>RECENT</Text>
            {RECENT_DEST.map(d => (
              <TouchableOpacity key={d} style={s.recentItem} onPress={()=>setDest(d)} activeOpacity={0.7}>
                <Clock size={13} color={C.ts} strokeWidth={1.8}/>
                <Text style={s.recentTxt}>{d}</Text>
                <ChevronRight size={13} color={C.ts} strokeWidth={2} style={{marginLeft:'auto'}}/>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Ride types */}
        <View style={s.rideTypesBlock}>
          <Text style={s.sectionLabel}>SELECT RIDE TYPE</Text>
          {RIDE_TYPES.map(r => {
            const active = rideType === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[s.rideCard, active && s.rideCardActive]}
                onPress={() => setRideType(r.id)}
                activeOpacity={0.8}
              >
                <View style={[s.rideCarIcon, active && s.rideCarIconActive]}>
                  <Car size={18} color={active?C.purpleL:C.ts} strokeWidth={1.8}/>
                </View>
                <View style={{flex:1}}>
                  <Text style={s.rideLabel}>{r.label}</Text>
                  <Text style={s.rideNote}>{r.note}</Text>
                </View>
                <View style={{alignItems:'flex-end'}}>
                  <Text style={[s.rideFare, active && {color:C.gold}]}>{r.fare}</Text>
                  <Text style={s.rideEta}>{r.eta}</Text>
                </View>
                {active && (
                  <View style={s.checkBadge}>
                    <Check size={10} color="#fff" strokeWidth={3}/>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Book button */}
        <TouchableOpacity onPress={handleBook} activeOpacity={0.85} style={{marginBottom:16}}>
          <LinearGradient
            colors={dest.trim() ? ['#7128CE','#5A18A8'] : ['rgba(113,40,206,0.3)','rgba(113,40,206,0.3)']}
            start={{x:0,y:0}} end={{x:1,y:1}}
            style={s.bookBtn}
          >
            {booking
              ? <ActivityIndicator color="#fff" size="small"/>
              : <><Car size={15} color="#fff" strokeWidth={2}/><Text style={s.bookBtnTxt}>  Book CityRide · {selected.fare}</Text></>}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:            { flex:1, backgroundColor:'#08011A' },
  scroll:          { padding:18, paddingTop:16 },
  routeCard:       { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:22, padding:16, marginBottom:18 },
  routeFrom:       { flexDirection:'row', alignItems:'center', gap:12, paddingBottom:14, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.07)' },
  greenDot:        { width:8, height:8, borderRadius:4, backgroundColor:'#3DAA6A' },
  routeLabel:      { fontSize:10, color:'#8C7DA0', marginBottom:3 },
  routeTxt:        { fontSize:13, fontWeight:'600', color:'#EBE3D6' },
  routeDivider:    { height:0 },
  routeTo:         { flexDirection:'row', alignItems:'center', paddingTop:14 },
  destInput:       { fontSize:13, fontWeight:'600', color:'#EBE3D6', padding:0 },
  sectionLabel:    { fontSize:11, color:'#8C7DA0', fontWeight:'500', marginBottom:10 },
  recentBlock:     { marginBottom:18 },
  recentItem:      { flexDirection:'row', alignItems:'center', gap:12, padding:10, paddingHorizontal:14, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:13, marginBottom:8 },
  recentTxt:       { fontSize:13, color:'#EBE3D6', fontWeight:'500' },
  rideTypesBlock:  { marginBottom:18 },
  rideCard:        { flexDirection:'row', alignItems:'center', gap:14, padding:14, paddingHorizontal:16, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, marginBottom:10 },
  rideCardActive:  { backgroundColor:'rgba(113,40,206,0.12)', borderColor:'rgba(113,40,206,0.4)' },
  rideCarIcon:     { width:40, height:40, borderRadius:12, backgroundColor:'rgba(255,255,255,0.05)', alignItems:'center', justifyContent:'center' },
  rideCarIconActive:{ backgroundColor:'rgba(113,40,206,0.2)' },
  rideLabel:       { fontSize:14, fontWeight:'600', color:'#EBE3D6', marginBottom:2 },
  rideNote:        { fontSize:11, color:'#8C7DA0' },
  rideFare:        { fontSize:15, fontWeight:'700', color:'#EBE3D6' },
  rideEta:         { fontSize:10, color:'#8C7DA0' },
  checkBadge:      { width:18, height:18, borderRadius:9, backgroundColor:'#7128CE', alignItems:'center', justifyContent:'center' },
  bookBtn:         { width:'100%', paddingVertical:14, borderRadius:15, flexDirection:'row', alignItems:'center', justifyContent:'center' },
  bookBtnTxt:      { fontSize:14, fontWeight:'600', color:'#fff' },
  confirmedCard:   { margin:22, marginTop:40, backgroundColor:'rgba(61,170,106,0.1)', borderWidth:1, borderColor:'rgba(61,170,106,0.25)', borderRadius:24, padding:32, alignItems:'center' },
  confirmedIcon:   { width:64, height:64, borderRadius:32, backgroundColor:'rgba(61,170,106,0.15)', borderWidth:1, borderColor:'rgba(61,170,106,0.3)', alignItems:'center', justifyContent:'center', marginBottom:18 },
  confirmedTitle:  { fontSize:18, fontWeight:'700', color:'#EBE3D6', marginBottom:6 },
  confirmedSub:    { fontSize:13, color:'#8C7DA0', marginBottom:20, lineHeight:20, textAlign:'center' },
  confirmedStats:  { flexDirection:'row', gap:20, marginBottom:24 },
  statKey:         { fontSize:10, color:'#8C7DA0', marginBottom:4 },
  statVal:         { fontSize:14, fontWeight:'600', color:'#EBE3D6' },
  anotherBtn:      { paddingHorizontal:32, paddingVertical:11, borderRadius:13, backgroundColor:'#7128CE' },
  anotherTxt:      { fontSize:13, fontWeight:'600', color:'#fff' },
});
