import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
  MapPin, Package, BookOpen, LogOut, ChevronRight, Trophy,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import ScreenHeader from '../../shared/components/ScreenHeader';
import { useUserProfile } from '../../shared/context/UserContext';
import { QUIZ_BADGE_KEY, QUIZ_POINTS_KEY } from '../quiz/QuizScreen';

const MENU = [
  { Icon:Package,    label:'My Lost & Found Reports',  sub:'Track your submissions',  color:'#C48D38', tab:'LostFound' },
  { Icon:BookOpen,   label:'Booking History', sub:'Past stays & events',     color:'#2A7FAB' },
];

export default function ProfileScreen({ navigation, route }) {
  const onLogout = route?.params?.onLogout;
  const { user } = useUserProfile();
  const [quizPoints, setQuizPoints] = useState(0);
  const [quizBadge, setQuizBadge] = useState(null);
  const displayName = user?.displayName || [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || user?.email?.split('@')[0] || 'Guest';
  const displayEmail = user?.email || 'No email on file';
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'CF';

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [pointsRaw, badgeRaw] = await Promise.all([
          AsyncStorage.getItem(QUIZ_POINTS_KEY),
          AsyncStorage.getItem(QUIZ_BADGE_KEY),
        ]);
        if (!active) return;
        setQuizPoints(Number(pointsRaw) || 0);
        setQuizBadge(badgeRaw ? JSON.parse(badgeRaw) : null);
      })().catch(() => {
        if (active) {
          setQuizPoints(0);
          setQuizBadge(null);
        }
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const openMenuItem = (item) => {
    if (item.route) {
      navigation.navigate(item.route);
      return;
    }
    if (item.tab) {
      navigation.getParent()?.navigate(item.tab);
    }
  };

  return (
    <View style={s.root}>
      <ScreenHeader title="Profile" sub="Your account"/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Avatar */}
        <View style={s.avatarBlock}>
          <LinearGradient colors={[C.purple, '#5A18A8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatar}>
            <Text style={s.avatarTxt}>{initials}</Text>
          </LinearGradient>
          <Text style={s.name}>{displayName}</Text>
          <Text style={s.email}>{displayEmail}</Text>
          <View style={s.locRow}>
            <MapPin size={10} color={C.gold} strokeWidth={2.5}/>
            <Text style={s.locTxt}> Redemption City</Text>
          </View>
        </View>

        <TouchableOpacity style={s.quizBadgeCard} onPress={() => navigation.navigate('Quiz')} activeOpacity={0.84}>
          <LinearGradient
            colors={['rgba(196,141,56,0.18)', 'rgba(10,2,24,0.98)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.quizBadgeInner}
          >
            <View style={s.quizBadgeIcon}>
              <Trophy size={18} color={C.gold} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.quizBadgeLabel}>Know Your City Badge</Text>
              <Text style={s.quizBadgeTitle}>{quizBadge?.label || 'Start the Quiz'}</Text>
              <Text style={s.quizBadgeSub}>
                {quizPoints} total points{quizBadge ? ` · Last score ${quizBadge.lastScore}/${quizBadge.totalQuestions}` : ' · No quiz completed yet'}
              </Text>
            </View>
            <View style={s.quizPointsPill}>
              <Text style={s.quizPointsValue}>{quizPoints}</Text>
              <Text style={s.quizPointsText}>pts</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats */}
        <View style={s.stats}>
          {[['14','CityRides'],['8','Events'],['2','Lost & Found Reports']].map(([val,lbl],i) => (
            <View key={i} style={[s.statItem, i<2 && s.statDivider]}>
              <Text style={s.statVal}>{val}</Text>
              <Text style={s.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={s.menu}>
          {MENU.map((item,i) => {
            const { Icon, label, sub, color } = item;
            return (
            <TouchableOpacity key={i} style={s.menuItem} onPress={() => openMenuItem(item)} activeOpacity={0.7}>
              <View style={[s.menuIcon, { backgroundColor:`${color}18`, borderColor:`${color}25` }]}>
                <Icon size={16} color={color} strokeWidth={1.8}/>
              </View>
              <View style={{flex:1}}>
                <Text style={s.menuLabel}>{label}</Text>
                <Text style={s.menuSub}>{sub}</Text>
              </View>
              <ChevronRight size={14} color={C.tm} strokeWidth={2}/>
            </TouchableOpacity>
          );
          })}

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
  avatar:      { width:72, height:72, borderRadius:36, alignItems:'center', justifyContent:'center', marginBottom:14, shadowColor:'#641EBE', shadowOpacity:0.35, shadowRadius:28, shadowOffset:{ width:0, height:8 } },
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
  quizBadgeCard: { marginHorizontal:18, marginBottom:14, borderRadius:18, overflow:'hidden', borderWidth:1, borderColor:'rgba(196,141,56,0.26)' },
  quizBadgeInner: { flexDirection:'row', alignItems:'center', gap:12, padding:14, paddingHorizontal:15 },
  quizBadgeIcon: { width:40, height:40, borderRadius:12, backgroundColor:'rgba(196,141,56,0.16)', borderWidth:1, borderColor:'rgba(196,141,56,0.32)', alignItems:'center', justifyContent:'center' },
  quizBadgeLabel: { fontSize:9.5, color:'#8C7DA0', fontWeight:'800', letterSpacing:1, textTransform:'uppercase', marginBottom:2 },
  quizBadgeTitle: { fontSize:14, color:'#EBE3D6', fontWeight:'800' },
  quizBadgeSub: { fontSize:10.5, color:'#8C7DA0', marginTop:2 },
  quizPointsPill: { minWidth:54, paddingVertical:7, paddingHorizontal:9, borderRadius:13, backgroundColor:'rgba(196,141,56,0.14)', borderWidth:1, borderColor:'rgba(196,141,56,0.35)', alignItems:'center' },
  quizPointsValue: { fontSize:17, color:'#C48D38', fontWeight:'900' },
  quizPointsText: { fontSize:9, color:'#C48D38', fontWeight:'700', textTransform:'uppercase' },
  menu:        { paddingHorizontal:18, gap:10 },
  menuItem:    { flexDirection:'row', alignItems:'center', gap:12, padding:13, paddingHorizontal:15, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16 },
  menuIcon:    { width:36, height:36, borderRadius:10, alignItems:'center', justifyContent:'center', borderWidth:1 },
  menuLabel:   { fontSize:13.5, fontWeight:'600', color:'#EBE3D6', marginBottom:2 },
  menuSub:     { fontSize:11, color:'#8C7DA0' },
  signOutBtn:  { flexDirection:'row', alignItems:'center', gap:12, padding:13, paddingHorizontal:15, backgroundColor:'rgba(212,79,79,0.08)', borderWidth:1, borderColor:'rgba(212,79,79,0.2)', borderRadius:16, marginTop:4, marginBottom:8 },
  signOutIcon: { width:36, height:36, borderRadius:10, backgroundColor:'rgba(212,79,79,0.12)', borderWidth:1, borderColor:'rgba(212,79,79,0.25)', alignItems:'center', justifyContent:'center' },
  signOutTxt:  { fontSize:13.5, fontWeight:'600', color:'#D44F4F' },
});
