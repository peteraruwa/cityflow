import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import {
  Siren, Bot, Store, Lightbulb, PhoneCall, Trophy, User, ChevronRight,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import ScreenHeader from '../../shared/components/ScreenHeader';
import PulsingDot from '../../shared/components/PulsingDot';

const TILES = [
  { id:'Emergency',          label:'Emergency / SOS',        sub:'One-tap ambulance, police, fire',    Icon:Siren,     color:'#D44F4F', urgent:true },
  { id:'AIAssistant',        label:'CityFlow AI',             sub:'Ask me anything about the city',    Icon:Bot,       color:'#9458E0' },
  { id:'BusinessDirectory',  label:'Business Directory',      sub:'Restaurants, hotels, banks & more', Icon:Store,     color:'#C48D38' },
  { id:'FunFacts',           label:'Did You Know?',           sub:'Fun facts about Redemption City',   Icon:Lightbulb, color:'#4A8A5A' },
  { id:'Contacts',           label:'Quick Contacts',          sub:'All important numbers in one place',Icon:PhoneCall, color:'#2A7FAB' },
  { id:'Quiz',               label:'Know Your City',          sub:'Test your local knowledge',         Icon:Trophy,    color:'#B07020' },
  { id:'Profile',            label:'My Profile',              sub:'Account, settings & history',       Icon:User,      color:'#6A6880' },
];

export default function MoreScreen({ navigation, route }) {
  const onLogout = route?.params?.onLogout;

  return (
    <View style={s.root}>
      <ScreenHeader title="More" sub="Features & tools"/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {TILES.map(({ id, label, sub, Icon, color, urgent }) => (
          <TouchableOpacity
            key={id}
            style={[s.tile, urgent && s.tileUrgent]}
            onPress={() => {
              if (id === 'Profile') {
                navigation.navigate('Profile', { onLogout });
              } else {
                navigation.navigate(id);
              }
            }}
            activeOpacity={0.8}
          >
            <View style={[s.tileIcon, { backgroundColor:`${color}18`, borderColor:`${color}28` }]}>
              <Icon size={19} color={color} strokeWidth={1.8}/>
            </View>
            <View style={{flex:1}}>
              <Text style={s.tileLabel}>{label}</Text>
              <Text style={s.tileSub}>{sub}</Text>
            </View>
            {urgent
              ? <PulsingDot size={8} color="#F06565"/>
              : <ChevronRight size={14} color={C.tm} strokeWidth={2}/>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex:1, backgroundColor:'#08011A' },
  scroll:     { padding:18, paddingTop:14, gap:11 },
  tile:       { flexDirection:'row', alignItems:'center', gap:14, padding:14, paddingHorizontal:16, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, marginBottom:11 },
  tileUrgent: { backgroundColor:'rgba(212,79,79,0.08)', borderColor:'rgba(212,79,79,0.25)' },
  tileIcon:   { width:42, height:42, borderRadius:13, alignItems:'center', justifyContent:'center', borderWidth:1 },
  tileLabel:  { fontSize:14, fontWeight:'700', color:'#EBE3D6', marginBottom:2 },
  tileSub:    { fontSize:11, color:'#8C7DA0' },
});
