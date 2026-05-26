import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Bot, Send, ChevronLeft } from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import PulsingDot from '../../shared/components/PulsingDot';

const QUICK = ['Find a restaurant','Book a CityRide','Emergency contacts','Prayer Mountain location',"Today's events"];

const RESPONSES = {
  restaurant: 'There are several great dining spots! Camp Restaurant (0.3km) is open 7AM–9PM. Bread of Life Café (0.7km) serves snacks all day. Both accept cash and mobile payments.',
  ride:       'Head to the CityRide tab. Camp Shuttle ₦150, Standard ₦450, Premium ₦850. Average wait: 3–8 minutes.',
  emergency:  'Ambulance: 199 · Police: 112 · Fire: 190 · Road Safety: 122 · General: 112 (works without airtime).',
  prayer:     'Prayer Mountain is 1.2km from Main Gate. Rated 4.9★. Open 5AM–10PM. Follow the blue pathway from the main auditorium.',
  default:    "I'm here to help with anything in Redemption City — navigation, bookings, emergencies, events, or local info. Could you give me more detail?",
};

function getResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('restaurant')||m.includes('food')||m.includes('eat')) return RESPONSES.restaurant;
  if (m.includes('ride')||m.includes('transport')||m.includes('car'))  return RESPONSES.ride;
  if (m.includes('emergency')||m.includes('ambulance')||m.includes('sos')) return RESPONSES.emergency;
  if (m.includes('prayer')||m.includes('mountain'))                    return RESPONSES.prayer;
  return RESPONSES.default;
}

export default function AIAssistantScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { role:'ai', text:"Hi! I'm your CityFlow AI Assistant. How can I help you today in Redemption City?" }
  ]);
  const [input,  setInput]  = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated:true });
  }, [messages, typing]);

  function sendMessage(text) {
    const msg = (text || input).trim();
    if (!msg) return;
    setMessages(m => [...m, { role:'user', text:msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { role:'ai', text:getResponse(msg) }]);
    }, 1100);
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS==='ios'?'padding':'height'}>
      {/* Header */}
      <View style={s.header}>
        {navigation && (
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={16} color="#EBE3D6" strokeWidth={2}/>
          </TouchableOpacity>
        )}
        <View style={{flex:1}}>
          <Text style={s.title}>CityFlow AI</Text>
          <View style={s.statusRow}>
            <PulsingDot size={6} color="#3DAA6A"/>
            <Text style={s.statusTxt}> Online</Text>
          </View>
        </View>
        <View style={s.botBadge}>
          <Bot size={17} color="#9458E0" strokeWidth={1.8}/>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={s.messages}
        contentContainerStyle={s.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={()=>scrollRef.current?.scrollToEnd({ animated:true })}
      >
        {/* Quick prompts — shown before user sends */}
        {messages.length <= 1 && (
          <View style={s.quickBlock}>
            <Text style={s.quickLabel}>QUICK QUESTIONS</Text>
            <View style={s.quickChips}>
              {QUICK.map(q => (
                <TouchableOpacity key={q} style={s.chip} onPress={() => sendMessage(q)} activeOpacity={0.7}>
                  <Text style={s.chipTxt}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {messages.map((m,i) => (
          <View key={i} style={[s.msgRow, m.role==='user'?s.msgRowUser:s.msgRowAI]}>
            {m.role==='ai' && (
              <View style={s.aiBadge}><Bot size={12} color="#9458E0" strokeWidth={2}/></View>
            )}
            <View style={[s.bubble, m.role==='user'?s.bubbleUser:s.bubbleAI]}>
              <Text style={s.bubbleTxt}>{m.text}</Text>
            </View>
          </View>
        ))}
        {typing && (
          <View style={s.msgRowAI}>
            <View style={s.aiBadge}><Bot size={12} color="#9458E0" strokeWidth={2}/></View>
            <View style={s.bubbleAI}>
              <View style={s.typingDots}>
                {[0,1,2].map(i => <PulsingDot key={i} size={6} color={C.ts} style={{marginHorizontal:2}}/>)}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={s.inputBar}>
        <View style={s.inputWrap}>
          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask me anything about the city..."
            placeholderTextColor={C.tm}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[s.sendBtn, !input.trim() && s.sendBtnDisabled]}
            onPress={() => sendMessage()}
            activeOpacity={0.8}
          >
            <Send size={14} color={input.trim()?'#fff':C.ts} strokeWidth={2}/>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:         { flex:1, backgroundColor:'#08011A' },
  header:       { paddingHorizontal:18, paddingTop:14, paddingBottom:12, flexDirection:'row', alignItems:'center', gap:10 },
  backBtn:      { width:34, height:34, borderRadius:10, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', alignItems:'center', justifyContent:'center' },
  title:        { fontSize:17, fontWeight:'700', color:'#EBE3D6' },
  statusRow:    { flexDirection:'row', alignItems:'center', marginTop:1 },
  statusTxt:    { fontSize:10, color:'#3DAA6A', fontWeight:'600' },
  botBadge:     { width:36, height:36, borderRadius:12, backgroundColor:'rgba(113,40,206,0.15)', borderWidth:1, borderColor:'rgba(113,40,206,0.25)', alignItems:'center', justifyContent:'center' },
  messages:     { flex:1 },
  messagesContent:{ padding:16, paddingBottom:8 },
  quickBlock:   { marginBottom:16 },
  quickLabel:   { fontSize:10, color:'#8C7DA0', marginBottom:8, fontWeight:'500' },
  quickChips:   { flexDirection:'row', flexWrap:'wrap', gap:7 },
  chip:         { paddingHorizontal:12, paddingVertical:7, borderRadius:20, borderWidth:1, borderColor:'rgba(255,255,255,0.07)', backgroundColor:'rgba(255,255,255,0.04)' },
  chipTxt:      { fontSize:11, color:'#EBE3D6', fontWeight:'500' },
  msgRow:       { marginBottom:12, flexDirection:'row', alignItems:'flex-start' },
  msgRowAI:     { justifyContent:'flex-start' },
  msgRowUser:   { justifyContent:'flex-end' },
  aiBadge:      { width:26, height:26, borderRadius:8, backgroundColor:'rgba(113,40,206,0.18)', borderWidth:1, borderColor:'rgba(113,40,206,0.3)', alignItems:'center', justifyContent:'center', marginRight:8, marginTop:2 },
  bubble:       { maxWidth:'76%', padding:10, paddingHorizontal:13, borderRadius:16 },
  bubbleAI:     { backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderTopLeftRadius:4 },
  bubbleUser:   { backgroundColor:'#7128CE', borderTopRightRadius:4 },
  bubbleTxt:    { fontSize:12.5, color:'#EBE3D6', lineHeight:19 },
  typingDots:   { flexDirection:'row', alignItems:'center', paddingVertical:2 },
  inputBar:     { paddingHorizontal:16, paddingVertical:10, paddingBottom:14, borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.07)' },
  inputWrap:    { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, paddingVertical:8, paddingLeft:14, paddingRight:8, gap:10 },
  input:        { flex:1, fontSize:12.5, color:'#EBE3D6', padding:0 },
  sendBtn:      { width:34, height:34, borderRadius:11, backgroundColor:'#7128CE', alignItems:'center', justifyContent:'center' },
  sendBtnDisabled:{ backgroundColor:'rgba(255,255,255,0.07)' },
});
