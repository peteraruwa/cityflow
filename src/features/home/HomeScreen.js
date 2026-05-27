import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  MapPin, MapPinned, Search, Bell, Navigation, Car, Building2,
  CalendarDays, Clock, Home, Leaf, Coffee, BookOpen, Radio,
  AlertCircle, Bot, Send, ChevronRight, Star, Siren, Utensils,
  Lightbulb, PhoneCall,
} from 'lucide-react-native';
import { C, FONTS } from '../../shared/constants/theme';
import SectionHeader from '../../shared/components/SectionHeader';
import PulsingDot from '../../shared/components/PulsingDot';

const QUICK_FACTS = [
  { icon:'🏙️', text:'Pop. 1M+ visitors/year' },
  { icon:'🗺️', text:'560 km² campus' },
];

const EXPLORE_PLACES = [
  { Icon:Building2, name:'Auditorium',    cat:'Worship',   dist:'0.2km', color:'#6B35C0' },
  { Icon:Home,      name:'Guest House',   cat:'Stay',      dist:'0.4km', color:'#2A7FAB' },
  { Icon:Leaf,      name:'Prayer Garden', cat:'Spiritual', dist:'0.6km', color:'#4A8A5A' },
  { Icon:Coffee,    name:'Restaurants',   cat:'Dining',    dist:'0.3km', color:'#C48D38' },
  { Icon:Car,       name:'Parking',       cat:'Transport', dist:'0.1km', color:'#6A6880' },
  { Icon:BookOpen,  name:'Bookshop',      cat:'Retail',    dist:'0.5km', color:'#9B5E3A' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const liveDot = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(liveDot, { toValue:0.25, duration:800, useNativeDriver:true }),
        Animated.timing(liveDot, { toValue:1,    duration:800, useNativeDriver:true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const ACTIONS = [
    { Icon:Navigation,   label:'Navigate',  sub:'Find your way',   color:'#7128CE' },
    { Icon:Car,          label:'CityRide',  sub:'Book a ride',     color:'#C48D38', onPress:()=>navigation.navigate('CityRide') },
    { Icon:Building2,    label:'Stay',      sub:'Guest houses',    color:'#2A7FAB' },
    { Icon:CalendarDays, label:'Events',    sub:"What's on today", color:'#4A8A5A' },
  ];

  return (
    <View style={s.root}>
      {/* App Header */}
      <View style={s.header}>
        <View>
          <Text style={s.brand}>CityFlow</Text>
          <View style={s.locRow}>
            <MapPin size={10} color={C.gold} strokeWidth={2.5}/>
            <Text style={s.locTxt}> Redemption City</Text>
          </View>
        </View>
        <View style={s.headerActions}>
          {[Search,Bell].map((Icon,i) => (
            <TouchableOpacity key={i} style={s.headerBtn}>
              <Icon size={16} color={C.tp} strokeWidth={1.8}/>
              {i===1 && <View style={s.notifDot}/>}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Greeting */}
        <View style={s.greet}>
          <Text style={s.greetName}>Good morning, Peter</Text>
          <Text style={s.greetSub}>Welcome to Redemption City</Text>
        </View>

        {/* ── EMERGENCY BANNER ── */}
        <TouchableOpacity
          style={s.sosBanner}
          onPress={() => navigation.navigate('Emergency')}
          activeOpacity={0.85}
        >
          <View style={s.sosIcon}>
            <Siren size={20} color="#F06565" strokeWidth={1.8}/>
          </View>
          <View style={s.sosInfo}>
            <Text style={s.sosTitle}>Emergency / SOS</Text>
            <View style={s.sosNumbers}>
              {[['199','Ambulance'],['112','Police'],['190','Fire'],['122','Road']].map(([n,l])=>(
                <Text key={n} style={s.sosNum}>{n} <Text style={s.sosLabel}>{l}  </Text></Text>
              ))}
            </View>
          </View>
          <PulsingDot size={8} color="#F06565" style={{marginRight:4}}/>
          <ChevronRight size={14} color="#F06565" strokeWidth={2}/>
        </TouchableOpacity>

        {/* Hero Card */}
        <View style={s.heroWrap}>
          <LinearGradient
            colors={['rgba(90,18,165,0.94)','rgba(38,8,75,0.97)','rgba(10,2,24,1)']}
            start={{x:0,y:0}} end={{x:1,y:1}}
            style={s.heroCard}
          >
            <View style={s.heroTopRow}>
              <View style={s.liveChip}>
                <PulsingDot size={5} color="#F06565"/>
                <Text style={s.liveTxt}> LIVE NOW</Text>
              </View>
              <View style={s.heroDivLine}/>
              <Text style={s.heroDateTxt}>Today</Text>
            </View>
            <Text style={s.heroTitle}>Sunday Victory Service</Text>
            <View style={s.heroMeta}>
              <View style={s.heroMetaRow}>
                <Building2 size={11} color={C.gold} strokeWidth={1.8}/>
                <Text style={s.heroMetaTxt}> Main Auditorium · Redemption City</Text>
              </View>
              <View style={s.heroMetaRow}>
                <Clock size={11} color={C.gold} strokeWidth={1.8}/>
                <Text style={s.heroMetaTxt}> 8:00 AM – 11:30 AM</Text>
              </View>
            </View>
            <View style={s.heroBtns}>
              <TouchableOpacity style={s.heroBtn1} activeOpacity={0.85}>
                <Navigation size={12} color="#fff" strokeWidth={2.5}/>
                <Text style={s.heroBtnTxt1}> Get Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.heroBtn2} activeOpacity={0.85}>
                <Text style={s.heroBtnTxt2}>View Details</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={s.section}>
          <SectionHeader title="Quick Actions"/>
          <View style={s.actionsGrid}>
            {ACTIONS.map(({ Icon, label, sub, color, onPress },i) => (
              <TouchableOpacity key={i} style={s.actionCard} onPress={onPress} activeOpacity={0.8}>
                <View style={[s.actionIcon, { backgroundColor:`${color}1A`, borderColor:`${color}28` }]}>
                  <Icon size={18} color={color} strokeWidth={1.8}/>
                </View>
                <Text style={s.actionLabel}>{label}</Text>
                <Text style={s.actionSub}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CityFlow AI preview */}
        <View style={s.section}>
          <SectionHeader title="CityFlow AI" action="Open chat" onAction={()=>navigation.navigate('AIAssistant')}/>
          <View style={s.aiCard}>
            <View style={s.aiHeader}>
              <View style={s.aiAvatar}><Bot size={14} color={C.purpleL} strokeWidth={2}/></View>
              <View>
                <Text style={s.aiName}>CityFlow AI</Text>
                <View style={s.aiStatusRow}>
                  <PulsingDot size={5} color={C.green}/>
                  <Text style={s.aiStatus}> Online</Text>
                </View>
              </View>
            </View>
            <View style={s.aiMsg}>
              <View style={s.aiMsgAvatar}><Bot size={11} color={C.purpleL} strokeWidth={2}/></View>
              <View style={s.aiBubble}>
                <Text style={s.aiBubbleTxt}>Hi! I'm your CityFlow AI. Ask me anything about Redemption City.</Text>
              </View>
            </View>
            <View style={s.aiChips}>
              {['Find a restaurant','Book a CityRide','Emergency contacts'].map(q=>(
                <TouchableOpacity key={q} style={s.aiChip} onPress={()=>navigation.navigate('AIAssistant')}>
                  <Text style={s.aiChipTxt}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={s.aiInputRow} onPress={()=>navigation.navigate('AIAssistant')}>
              <Text style={s.aiPlaceholder}>Ask me anything about the city…</Text>
              <View style={s.aiSendBtn}><Send size={12} color="#fff" strokeWidth={2}/></View>
            </TouchableOpacity>
          </View>
        </View>

        {/* City Tour preview */}
        <View style={s.section}>
          <SectionHeader title="Redemption City Tour" action="Explore" onAction={()=>navigation.navigate('CityTour')}/>
          <TouchableOpacity onPress={()=>navigation.navigate('CityTour')} activeOpacity={0.85}>
            <LinearGradient
              colors={['rgba(42,127,171,0.22)','rgba(10,2,24,1)']}
              start={{x:0,y:0}} end={{x:1,y:1}}
              style={s.tourCard}
            >
              <View style={s.tourHeader}>
                <View style={[s.tourIcon,{backgroundColor:'rgba(42,127,171,0.18)',borderColor:'rgba(42,127,171,0.3)'}]}>
                  <Navigation size={17} color="#2A7FAB" strokeWidth={1.8}/>
                </View>
                <View>
                  <Text style={s.tourTitle}>Guided City Tour</Text>
                  <Text style={s.tourSub}>8 stops · ~2 hours · Self-paced</Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tourStops}>
                {[
                  { Icon:Building2, name:'Main Auditorium', color:'#6B35C0' },
                  { Icon:Leaf,      name:'Prayer Mountain', color:'#4A8A5A' },
                  { Icon:Coffee,    name:'Camp Restaurant', color:'#C48D38' },
                  { Icon:BookOpen,  name:'Bookshop',        color:'#9B5E3A' },
                ].map(({ Icon, name, color },i)=>(
                  <View key={i} style={[s.tourStop,{backgroundColor:`${color}14`,borderColor:`${color}25`}]}>
                    <Icon size={11} color={color} strokeWidth={2}/>
                    <Text style={s.tourStopTxt}>{name}</Text>
                  </View>
                ))}
                <View style={[s.tourStop,{backgroundColor:C.surfHi,borderColor:C.b}]}>
                  <Text style={{fontSize:10.5,color:C.ts}}>+4 more</Text>
                </View>
              </ScrollView>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Explore Nearby */}
        <View style={{marginBottom:22}}>
          <View style={s.section2header}>
            <SectionHeader title="Explore Nearby" onAction={()=>navigation.navigate('Explore')}/>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.exploreRow}>
            {EXPLORE_PLACES.map(({ Icon, name, cat, dist, color },i) => (
              <TouchableOpacity key={i} style={s.placeCard} activeOpacity={0.8}>
                <View style={[s.placeImg, { backgroundColor:`${color}18` }]}>
                  <Icon size={22} color={color} strokeWidth={1.5}/>
                </View>
                <View style={s.placeInfo}>
                  <Text style={s.placeName}>{name}</Text>
                  <Text style={s.placeCat}>{cat}</Text>
                  <View style={s.placeDistRow}>
                    <MapPinned size={9} color={C.gold} strokeWidth={2.5}/>
                    <Text style={s.placeDist}> {dist}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Business Directory preview */}
        <View style={s.section}>
          <SectionHeader title="Business Directory" action="See all" onAction={()=>navigation.navigate('BusinessDirectory')}/>
          <TouchableOpacity style={s.bizFeatured} onPress={()=>navigation.navigate('BusinessDirectory')} activeOpacity={0.8}>
            <View style={s.bizIcon}><Utensils size={15} color={C.gold} strokeWidth={2}/></View>
            <View style={{flex:1}}>
              <Text style={s.bizName}>Camp Restaurant</Text>
              <Text style={s.bizSub}>Open · 7AM–9PM · Tap to call</Text>
            </View>
            <View style={s.ratingRow}>
              <Star size={9} color={C.gold} fill={C.gold} strokeWidth={0}/>
              <Text style={s.ratingTxt}> 4.3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Did You Know */}
        <View style={s.section}>
          <SectionHeader title="Did You Know?" action="See all" onAction={()=>navigation.navigate('FunFacts')}/>
          <TouchableOpacity onPress={()=>navigation.navigate('FunFacts')} activeOpacity={0.85}>
            <LinearGradient
              colors={['rgba(113,40,206,0.18)','rgba(10,2,24,1)']}
              start={{x:0,y:0}} end={{x:1,y:1}}
              style={s.factCard}
            >
              <Text style={s.factEmoji}>🏙️</Text>
              <Text style={s.factCounter}>FACT 1 OF 8</Text>
              <Text style={s.factTxt}>Redemption City was officially commissioned in 1999 and now hosts over 1 million visitors annually during major conventions.</Text>
              <View style={s.factDots}>
                {[0,1,2,3,4,5,6,7].map(i=>(
                  <View key={i} style={[s.factDot, i===0 && {backgroundColor:C.gold}]}/>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Contacts preview */}
        <View style={s.section}>
          <SectionHeader title="Quick Contacts" action="See all" onAction={()=>navigation.navigate('Contacts')}/>
          <TouchableOpacity style={s.contactCard} onPress={()=>navigation.navigate('Contacts')} activeOpacity={0.8}>
            <View style={[s.contactIcon,{backgroundColor:'rgba(212,79,79,0.15)',borderColor:'rgba(212,79,79,0.25)'}]}>
              <PhoneCall size={13} color="#D44F4F" strokeWidth={2}/>
            </View>
            <View style={{flex:1}}>
              <Text style={s.contactName}>Emergency</Text>
              <Text style={s.contactSub}>5 contacts</Text>
            </View>
            <ChevronRight size={13} color={C.tm} strokeWidth={2}/>
          </TouchableOpacity>
        </View>

        {/* Quiz preview */}
        <View style={s.section}>
          <SectionHeader title="Know Your City Quiz" action="Play" onAction={()=>navigation.navigate('Quiz')}/>
          <TouchableOpacity onPress={()=>navigation.navigate('Quiz')} activeOpacity={0.85}>
            <LinearGradient
              colors={['rgba(196,141,56,0.16)','rgba(10,2,24,1)']}
              start={{x:0,y:0}} end={{x:1,y:1}}
              style={s.quizCard}
            >
              <Text style={s.quizEmoji}>🏙️</Text>
              <View style={{flex:1}}>
                <Text style={s.quizTitle}>Know Your City</Text>
                <Text style={s.quizSub}>8 questions about Redemption City.</Text>
                <View style={s.quizBadges}>
                  {[['📋','8 Qs'],['⏱️','~3 min'],['🏆','Earn badge']].map(([ic,lb])=>(
                    <View key={lb} style={s.quizBadge}>
                      <Text style={{fontSize:10}}>{ic}</Text>
                      <Text style={s.quizBadgeTxt}> {lb}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Updates */}
        <View style={[s.section,{marginBottom:8}]}>
          <SectionHeader title="Updates"/>
          <View style={s.updatesList}>
            {[
              { Icon:Radio,        color:'#7128CE', title:'Monthly Thanksgiving Service', body:'Join us Saturday at 6PM for a special celebration.', time:'2h ago' },
              { Icon:AlertCircle,  color:'#D44F4F', title:'Lost: Black Wallet — Gate B',  body:'A black leather wallet was found at Gate B.', time:'4h ago' },
              { Icon:Navigation,   color:'#C48D38', title:'Camp Road Closure',            body:'Main Camp Road closed 10AM–2PM. Use Alternative Route 2.', time:'1h ago' },
            ].map(({ Icon, color, title, body, time },i) => (
              <View key={i} style={s.updateCard}>
                <View style={[s.updateIcon,{backgroundColor:`${color}18`,borderColor:`${color}28`}]}>
                  <Icon size={15} color={color} strokeWidth={2}/>
                </View>
                <View style={{flex:1}}>
                  <View style={s.updateTopRow}>
                    <Text style={s.updateTitle} numberOfLines={2}>{title}</Text>
                    <Text style={s.updateTime}>{time}</Text>
                  </View>
                  <Text style={s.updateBody} numberOfLines={2}>{body}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex:1, backgroundColor:'#08011A' },
  scroll:       { paddingBottom:20 },
  header:       { paddingHorizontal:22, paddingTop:12, paddingBottom:14, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  brand:        { fontSize:21, fontWeight:'700', color:'#EBE3D6', letterSpacing:3 },
  locRow:       { flexDirection:'row', alignItems:'center', marginTop:2 },
  locTxt:       { fontSize:10, color:'#8C7DA0' },
  headerActions:{ flexDirection:'row', gap:10 },
  headerBtn:    { width:38, height:38, borderRadius:13, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', alignItems:'center', justifyContent:'center' },
  notifDot:     { position:'absolute', top:9, right:9, width:6, height:6, borderRadius:3, backgroundColor:'#C48D38' },

  greet:        { paddingHorizontal:22, paddingBottom:20 },
  greetName:    { fontSize:22, fontWeight:'700', color:'#EBE3D6', lineHeight:28 },
  greetSub:     { fontSize:12.5, color:'#8C7DA0', marginTop:5 },

  sosBanner:    { marginHorizontal:18, marginBottom:20, backgroundColor:'rgba(212,79,79,0.1)', borderWidth:1, borderColor:'rgba(212,79,79,0.32)', borderRadius:20, padding:14, flexDirection:'row', alignItems:'center', gap:12 },
  sosIcon:      { width:42, height:42, borderRadius:13, backgroundColor:'rgba(212,79,79,0.18)', borderWidth:1, borderColor:'rgba(212,79,79,0.3)', alignItems:'center', justifyContent:'center' },
  sosInfo:      { flex:1 },
  sosTitle:     { fontSize:13.5, fontWeight:'700', color:'#F06565', marginBottom:3 },
  sosNumbers:   { flexDirection:'row', flexWrap:'wrap' },
  sosNum:       { fontSize:10, color:'rgba(240,101,101,0.75)', fontWeight:'600' },
  sosLabel:     { fontWeight:'400', color:'#504460' },

  heroWrap:     { paddingHorizontal:18, marginBottom:22 },
  heroCard:     { borderRadius:26, borderWidth:1, borderColor:'rgba(110,50,190,0.3)', padding:20 },
  heroTopRow:   { flexDirection:'row', alignItems:'center', gap:8, marginBottom:14 },
  liveChip:     { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(215,55,55,0.18)', borderWidth:1, borderColor:'rgba(225,75,75,0.28)', borderRadius:20, paddingHorizontal:9, paddingVertical:3 },
  liveTxt:      { fontSize:9, fontWeight:'700', color:'#F06565', letterSpacing:1.5 },
  heroDivLine:  { flex:1, height:1, backgroundColor:'rgba(255,255,255,0.06)' },
  heroDateTxt:  { fontSize:10, color:'#8C7DA0' },
  heroTitle:    { fontSize:19, fontWeight:'700', color:'#EBE3D6', lineHeight:25, marginBottom:8 },
  heroMeta:     { gap:5, marginBottom:18 },
  heroMetaRow:  { flexDirection:'row', alignItems:'center' },
  heroMetaTxt:  { fontSize:11.5, color:'#8C7DA0' },
  heroBtns:     { flexDirection:'row', gap:10 },
  heroBtn1:     { flex:1, paddingVertical:11, borderRadius:13, backgroundColor:'#7128CE', flexDirection:'row', alignItems:'center', justifyContent:'center' },
  heroBtnTxt1:  { fontSize:12, fontWeight:'600', color:'#fff' },
  heroBtn2:     { flex:1, paddingVertical:11, borderRadius:13, backgroundColor:'rgba(255,255,255,0.07)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', alignItems:'center', justifyContent:'center' },
  heroBtnTxt2:  { fontSize:12, fontWeight:'600', color:'#EBE3D6' },

  section:      { paddingHorizontal:18, marginBottom:22 },
  section2header:{ paddingHorizontal:18, marginBottom:14 },
  actionsGrid:  { display:'flex', flexDirection:'row', flexWrap:'wrap', gap:12, marginTop:14 },
  actionCard:   { width:'47%', backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:20, padding:16 },
  actionIcon:   { width:38, height:38, borderRadius:12, marginBottom:12, alignItems:'center', justifyContent:'center', borderWidth:1 },
  actionLabel:  { fontSize:14, fontWeight:'600', color:'#EBE3D6', marginBottom:2 },
  actionSub:    { fontSize:11, color:'#8C7DA0' },

  aiCard:       { marginTop:12, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:22, overflow:'hidden' },
  aiHeader:     { padding:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.07)', flexDirection:'row', alignItems:'center', gap:10 },
  aiAvatar:     { width:30, height:30, borderRadius:9, backgroundColor:'rgba(113,40,206,0.18)', borderWidth:1, borderColor:'rgba(113,40,206,0.28)', alignItems:'center', justifyContent:'center' },
  aiName:       { fontSize:12, fontWeight:'700', color:'#EBE3D6' },
  aiStatusRow:  { flexDirection:'row', alignItems:'center', marginTop:2 },
  aiStatus:     { fontSize:9.5, color:'#3DAA6A', fontWeight:'600' },
  aiMsg:        { padding:12, paddingBottom:0, flexDirection:'row', gap:8, marginBottom:10 },
  aiMsgAvatar:  { width:24, height:24, borderRadius:7, backgroundColor:'rgba(113,40,206,0.18)', borderWidth:1, borderColor:'rgba(113,40,206,0.28)', alignItems:'center', justifyContent:'center', marginTop:2 },
  aiBubble:     { flex:1, padding:9, paddingHorizontal:12, backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:14, borderTopLeftRadius:4 },
  aiBubbleTxt:  { fontSize:11.5, color:'#EBE3D6', lineHeight:17 },
  aiChips:      { paddingHorizontal:12, flexDirection:'row', flexWrap:'wrap', gap:6, marginBottom:10 },
  aiChip:       { paddingHorizontal:10, paddingVertical:5, borderRadius:16, borderWidth:1, borderColor:'rgba(255,255,255,0.07)', backgroundColor:'rgba(255,255,255,0.07)' },
  aiChipTxt:    { fontSize:10.5, color:'#EBE3D6', fontWeight:'500' },
  aiInputRow:   { margin:12, marginTop:0, flexDirection:'row', alignItems:'center', gap:8, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:13, padding:9, paddingLeft:12 },
  aiPlaceholder:{ flex:1, fontSize:11.5, color:'#504460' },
  aiSendBtn:    { width:28, height:28, borderRadius:9, backgroundColor:'#7128CE', alignItems:'center', justifyContent:'center' },

  tourCard:     { borderRadius:22, borderWidth:1, borderColor:'rgba(42,127,171,0.3)', padding:18, marginTop:12 },
  tourHeader:   { flexDirection:'row', alignItems:'center', gap:10, marginBottom:12 },
  tourIcon:     { width:38, height:38, borderRadius:11, alignItems:'center', justifyContent:'center', borderWidth:1 },
  tourTitle:    { fontSize:13.5, fontWeight:'700', color:'#EBE3D6' },
  tourSub:      { fontSize:10.5, color:'#8C7DA0' },
  tourStops:    { flexDirection:'row' },
  tourStop:     { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'rgba(255,255,255,0.07)', borderWidth:1, borderRadius:10, paddingHorizontal:10, paddingVertical:6, marginRight:8 },
  tourStopTxt:  { fontSize:10.5, color:'#EBE3D6', fontWeight:'500' },

  exploreRow:   { paddingHorizontal:18, gap:12 },
  placeCard:    { width:112, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden' },
  placeImg:     { height:68, alignItems:'center', justifyContent:'center', borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.07)' },
  placeInfo:    { padding:11, paddingBottom:12 },
  placeName:    { fontSize:12, fontWeight:'600', color:'#EBE3D6', marginBottom:2 },
  placeCat:     { fontSize:10, color:'#8C7DA0', marginBottom:6 },
  placeDistRow: { flexDirection:'row', alignItems:'center' },
  placeDist:    { fontSize:9.5, color:'#C48D38', fontWeight:'500' },

  bizFeatured:  { marginTop:10, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:12, flexDirection:'row', alignItems:'center', gap:10 },
  bizIcon:      { width:34, height:34, borderRadius:10, backgroundColor:'rgba(196,141,56,0.15)', borderWidth:1, borderColor:'rgba(196,141,56,0.25)', alignItems:'center', justifyContent:'center' },
  bizName:      { fontSize:12.5, fontWeight:'600', color:'#EBE3D6', marginBottom:1 },
  bizSub:       { fontSize:10.5, color:'#8C7DA0' },
  ratingRow:    { flexDirection:'row', alignItems:'center' },
  ratingTxt:    { fontSize:10.5, color:'#C48D38', fontWeight:'600' },

  factCard:     { borderRadius:22, borderWidth:1, borderColor:'rgba(113,40,206,0.28)', padding:20, alignItems:'center', marginTop:12 },
  factEmoji:    { fontSize:36, marginBottom:10 },
  factCounter:  { fontSize:8.5, fontWeight:'700', color:'#C48D38', letterSpacing:3, marginBottom:8 },
  factTxt:      { fontSize:12.5, color:'#EBE3D6', lineHeight:20, fontWeight:'500', textAlign:'center', marginBottom:16 },
  factDots:     { flexDirection:'row', gap:5 },
  factDot:      { width:5, height:5, borderRadius:3, backgroundColor:'#504460' },

  contactCard:  { marginTop:12, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:12, flexDirection:'row', alignItems:'center', gap:10 },
  contactIcon:  { width:32, height:32, borderRadius:10, alignItems:'center', justifyContent:'center', borderWidth:1 },
  contactName:  { fontSize:12.5, fontWeight:'700', color:'#EBE3D6' },
  contactSub:   { fontSize:10.5, color:'#8C7DA0' },

  quizCard:     { borderRadius:22, borderWidth:1, borderColor:'rgba(196,141,56,0.25)', padding:18, flexDirection:'row', alignItems:'center', gap:14, marginTop:12 },
  quizEmoji:    { fontSize:44 },
  quizTitle:    { fontSize:14, fontWeight:'700', color:'#EBE3D6', marginBottom:4 },
  quizSub:      { fontSize:11, color:'#8C7DA0', lineHeight:16, marginBottom:10 },
  quizBadges:   { flexDirection:'row', gap:8 },
  quizBadge:    { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.07)', borderRadius:8, paddingHorizontal:8, paddingVertical:4 },
  quizBadgeTxt: { fontSize:9.5, color:'#8C7DA0' },

  updatesList:  { gap:10, marginTop:14 },
  updateCard:   { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:14, flexDirection:'row', gap:12 },
  updateIcon:   { width:34, height:34, borderRadius:10, alignItems:'center', justifyContent:'center', borderWidth:1, flexShrink:0 },
  updateTopRow: { flexDirection:'row', justifyContent:'space-between', marginBottom:4 },
  updateTitle:  { fontSize:13, fontWeight:'600', color:'#EBE3D6', flex:1, marginRight:8, lineHeight:18 },
  updateTime:   { fontSize:10, color:'#504460' },
  updateBody:   { fontSize:11.5, color:'#8C7DA0', lineHeight:16 },
});



