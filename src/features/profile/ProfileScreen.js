import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import {
  MapPin, Bell, Package, BookOpen, HelpCircle,
  Settings, LogOut, ChevronRight,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import ScreenHeader from '../../shared/components/ScreenHeader';

const MENU = [
  { Icon:Bell,       label:'Notifications',   sub:'Manage your alerts',      color:'#7128CE' },
  { Icon:Package,    label:'My L&F Reports',  sub:'Track your submissions',  color:'#C48D38' },
  { Icon:BookOpen,   label:'Booking History', sub:'Past stays & events',     color:'#2A7FAB' },
  { Icon:HelpCircle, label:'Help & Support',  sub:'FAQs and contact',        color:'#4A8A5A' },
  { Icon:Settings,   label:'Settings',        sub:'App preferences',         color:'#6A6880' },
];

export default function ProfileScreen({ route }) {
  const onLogout = route?.params?.onLogout;

  return (
    <View style={s.root}>
      <ScreenHeader title="Profile" sub="Your account"/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Avatar */}
        <View style={s.avatarBlock}>
          <View style={s.avatar}><Text style={s.avatarTxt}>PA</Text></View>
          <Text style={s.name}>Peter Adeyemi</Text>
          <Text style={s.email}>peter.adeyemi@example.com</Text>
          <View style={s.locRow}>
            <MapPin size={10} color={C.gold} strokeWidth={2.5}/>
            <Text style={s.locTxt}> Redemption City</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={s.stats}>
          {[['14','CityRides'],['8','Events'],['2','L&F Reports']].map(([val,lbl],i) => (
            <View key={i} style={[s.statItem, i<2 && s.statDivider]}>
              <Text style={s.statVal}>{val}</Text>
              <Text style={s.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={s.menu}>
          {MENU.map(({ Icon, label, sub, color },i) => (
            <TouchableOpacity key={i} style={s.menuItem} activeOpacity={0.7}>
              <View style={[s.menuIcon, { backgroundColor:`${color}18`, borderColor:`${color}25` }]}>
                <Icon size={16} color={color} strokeWidth={1.8}/>
              </View>
              <View style={{flex:1}}>
                <Text style={s.menuLabel}>{label}</Text>
                <Text style={s.menuSub}>{sub}</Text>
              </View>
              <ChevronRight size={14} color={C.tm} strokeWidth={2}/>
            </TouchableOpacity>
          ))}

          {/* Sign out */}
          <TouchableOpacity style={s.signOutBtn} onPress={onLogout} activeOpacity={0.8}>
            <View style={s.signOutIcon}>
              <LogOut size={16} color="#D44F4F" strokeWidth={1.8}/>
            </View>
            <Text style={s.signOutTxt}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex:1, backgroundColor:'#08011A' },
  scroll:      { paddingBottom:20 },
  avatarBlock: { paddingHorizontal:22, paddingTop:10, paddingBottom:20, alignItems:'center' },
  avatar:      { width:72, height:72, borderRadius:36, backgroundColor:'#7128CE', alignItems:'center', justifyContent:'center', marginBottom:14 },
  avatarTxt:   { fontSize:26, fontWeight:'700', color:'#fff' },
  name:        { fontSize:18, fontWeight:'700', color:'#EBE3D6', marginBottom:4 },
  email:       { fontSize:12, color:'#8C7DA0', marginBottom:4 },
  locRow:      { flexDirection:'row', alignItems:'center' },
  locTxt:      { fontSize:11, color:'#8C7DA0' },
  stats:       { flexDirection:'row', marginHorizontal:18, marginBottom:20, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden' },
  statItem:    { flex:1, paddingVertical:14, alignItems:'center' },
  statDivider: { borderRightWidth:1, borderRightColor:'rgba(255,255,255,0.07)' },
  statVal:     { fontSize:20, fontWeight:'700', color:'#EBE3D6', marginBottom:3 },
  statLbl:     { fontSize:10, color:'#8C7DA0' },
  menu:        { paddingHorizontal:18, gap:10 },
  menuItem:    { flexDirection:'row', alignItems:'center', gap:12, padding:13, paddingHorizontal:15, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16 },
  menuIcon:    { width:36, height:36, borderRadius:10, alignItems:'center', justifyContent:'center', borderWidth:1 },
  menuLabel:   { fontSize:13.5, fontWeight:'600', color:'#EBE3D6', marginBottom:2 },
  menuSub:     { fontSize:11, color:'#8C7DA0' },
  signOutBtn:  { flexDirection:'row', alignItems:'center', gap:12, padding:13, paddingHorizontal:15, backgroundColor:'rgba(212,79,79,0.08)', borderWidth:1, borderColor:'rgba(212,79,79,0.2)', borderRadius:16, marginTop:4, marginBottom:8 },
  signOutIcon: { width:36, height:36, borderRadius:10, backgroundColor:'rgba(212,79,79,0.12)', borderWidth:1, borderColor:'rgba(212,79,79,0.25)', alignItems:'center', justifyContent:'center' },
  signOutTxt:  { fontSize:13.5, fontWeight:'600', color:'#D44F4F' },
});
