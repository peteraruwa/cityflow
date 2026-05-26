import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import {
  ChevronLeft, ChevronDown, ChevronUp, PhoneCall,
  Siren, Ambulance, Shield, Flame, TrafficCone,
  Building2, Package, Hotel, Utensils, Smartphone, Phone, Mail,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import { CONTACTS_DATA } from '../../shared/data';

const ICON_MAP = {
  Siren, Ambulance, Shield, Flame, TrafficCone,
  Building2, Package, Hotel, Utensils, Smartphone, Phone, Mail,
};

export default function ContactsScreen({ navigation }) {
  const [expanded, setExpanded] = useState('Emergency');

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
          <Text style={s.title}>Quick Contacts</Text>
          <Text style={s.sub}>All important numbers in one place</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {CONTACTS_DATA.map(group => {
          const open = expanded === group.group;
          return (
            <View key={group.group} style={[s.groupCard, open && { borderColor:`${group.color}44` }]}>
              <TouchableOpacity
                style={s.groupHeader}
                onPress={() => setExpanded(open ? null : group.group)}
                activeOpacity={0.8}
              >
                <View style={[s.groupIcon, { backgroundColor:`${group.color}18`, borderColor:`${group.color}28` }]}>
                  <PhoneCall size={14} color={group.color} strokeWidth={2}/>
                </View>
                <View style={{flex:1}}>
                  <Text style={s.groupTitle}>{group.group}</Text>
                  <Text style={s.groupCount}>{group.contacts.length} contacts</Text>
                </View>
                {open
                  ? <ChevronUp size={14} color={C.ts} strokeWidth={2}/>
                  : <ChevronDown size={14} color={C.ts} strokeWidth={2}/>}
              </TouchableOpacity>
              {open && (
                <View style={s.contactList}>
                  {group.contacts.map((c, i) => {
                    const Icon = ICON_MAP[c.iconName] || Phone;
                    return (
                      <View key={i} style={s.contactRow}>
                        <View style={[s.contactIcon, { backgroundColor:`${group.color}14`, borderColor:`${group.color}22` }]}>
                          <Icon size={13} color={group.color} strokeWidth={1.8}/>
                        </View>
                        <View style={{flex:1}}>
                          <Text style={s.contactName}>{c.name}</Text>
                          <Text style={[s.contactPhone, { color:group.color }]}>{c.phone}</Text>
                          <Text style={s.contactNote}>{c.note}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex:1, backgroundColor:'#08011A' },
  header:       { paddingHorizontal:18, paddingTop:14, paddingBottom:12, flexDirection:'row', alignItems:'center', gap:10 },
  backBtn:      { width:34, height:34, borderRadius:10, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', alignItems:'center', justifyContent:'center' },
  title:        { fontSize:18, fontWeight:'700', color:'#EBE3D6' },
  sub:          { fontSize:11, color:'#8C7DA0' },
  scroll:       { padding:18, paddingTop:0, gap:12 },
  groupCard:    { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:20, overflow:'hidden', marginBottom:12 },
  groupHeader:  { padding:14, paddingHorizontal:16, flexDirection:'row', alignItems:'center', gap:10 },
  groupIcon:    { width:32, height:32, borderRadius:10, alignItems:'center', justifyContent:'center', borderWidth:1 },
  groupTitle:   { fontSize:13.5, fontWeight:'700', color:'#EBE3D6' },
  groupCount:   { fontSize:10.5, color:'#8C7DA0' },
  contactList:  { borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.07)', padding:10, paddingHorizontal:16, paddingBottom:14, gap:10 },
  contactRow:   { flexDirection:'row', gap:10, alignItems:'flex-start' },
  contactIcon:  { width:30, height:30, borderRadius:9, alignItems:'center', justifyContent:'center', borderWidth:1, flexShrink:0 },
  contactName:  { fontSize:12.5, fontWeight:'600', color:'#EBE3D6', marginBottom:2 },
  contactPhone: { fontSize:12, fontWeight:'700', marginBottom:2 },
  contactNote:  { fontSize:10, color:'#8C7DA0' },
});
