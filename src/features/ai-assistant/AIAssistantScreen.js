// src/features/ai-assistant/AIAssistantScreen.js
import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-native-markdown-display";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Bot, Send, ChevronLeft } from "lucide-react-native";
import { GoogleGenAI } from "@google/genai";
import { C } from "../../shared/constants/theme";
import PulsingDot from "../../shared/components/PulsingDot";

// ---------------------------------------------------------------------
// Gemini 2.5 Configuration
// ---------------------------------------------------------------------
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
let aiClient = null;
try {
  if (API_KEY) aiClient = new GoogleGenAI({ apiKey: API_KEY });
} catch (e) {
  console.warn("Gemini client initialization failed:", e);
}

// System prompt (now used as systemInstruction)
const SYSTEM_PROMPT = `You are CityFlow AI, an assistant for Redemption City (also known as Redemption Camp), the headquarters of the Redeemed Christian Church of God (RCCG). Your knowledge is limited to this specific location and RCCG. Answer questions about: navigation within the camp, locations of buildings (Auditorium, Prayer Mountain, Guest Houses, restaurants, bookshop, medical centre, etc.), schedules of services and events, emergency contacts, rules of the camp, RCCG history, and general guidance for visitors. If a question is outside this scope (e.g., politics, world news, unrelated cities), politely say you can only answer about Redemption City and RCCG. Keep answers concise, friendly, and helpful.`;

// ---------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------
const QUICK = [
  "Find a restaurant",
  "Book a CityRide",
  "Emergency contacts",
  "Prayer Mountain location",
  "Today's events",
];

export default function AIAssistantScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm CityFlow AI. Ask me anything about Redemption City (RCCG Camp) – directions, services, events, or visitor info.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, typing]);

  // -----------------------------------------------------------------
  // Send message to Gemini 2.5
  // -----------------------------------------------------------------
  async function sendMessage(text) {
    const userMsg = (text || input).trim();
    if (!userMsg) return;

    // Add user message to UI
    const updatedMessages = [...messages, { role: "user", text: userMsg }];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);

    // If API key or client missing, fallback
    if (!API_KEY || !aiClient) {
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Sorry, the AI assistant is not configured. Please check your API key. For now, here are emergency numbers: Ambulance 199, Police 112, Fire 190.",
          },
        ]);
      }, 500);
      return;
    }

    try {
      // Build conversation history for the API (excluding the initial welcome message maybe)
      // We'll include the last 6 messages (user + AI) plus the new user message.
      const historyMessages = updatedMessages.slice(-6).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      // The API expects the whole conversation in the 'contents' array.
      // The system prompt is passed as 'systemInstruction' in the config.
      const response = await aiClient.models.generateContent({
        model: "gemini-2.5-flash", // Gemini 2.5 Flash model
        contents: historyMessages,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
          maxOutputTokens: 700,
        },
      });

      const aiText =
        response.text || "I'm sorry, I couldn't generate a response.";
      setTyping(false);
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch (error) {
      console.error("Gemini 2.5 error:", error);
      setTyping(false);
      let errorText =
        "I'm having trouble connecting. Please try again in a moment.";
      if (error.message?.includes("API key")) {
        errorText =
          "The AI service is not properly configured. Please contact support.";
      } else if (error.message?.includes("safety")) {
        errorText =
          "I can't answer that based on my guidelines. Please ask something about Redemption City.";
      } else if (error.message?.includes("rate limit")) {
        errorText =
          "I'm receiving too many requests right now. Please wait a moment and try again.";
      }
      setMessages((prev) => [...prev, { role: "ai", text: errorText }]);
    }
  }

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------
  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={s.header}>
        {navigation && (
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={16} color="#EBE3D6" strokeWidth={2} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={s.title}>CityFlow AI</Text>
          <View style={s.statusRow}>
            <PulsingDot size={6} color="#3DAA6A" />
            <Text style={s.statusTxt}> Online (Gemini 2.5)</Text>
          </View>
        </View>
        <View style={s.botBadge}>
          <Bot size={17} color="#9458E0" strokeWidth={1.8} />
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={s.messages}
        contentContainerStyle={s.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {/* Quick prompts - shown when only welcome message exists */}
        {messages.length <= 1 && (
          <View style={s.quickBlock}>
            <Text style={s.quickLabel}>QUICK QUESTIONS</Text>
            <View style={s.quickChips}>
              {QUICK.map((q) => (
                <TouchableOpacity
                  key={q}
                  style={s.chip}
                  onPress={() => sendMessage(q)}
                  activeOpacity={0.7}
                >
                  <Text style={s.chipTxt}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {messages.map((m, i) => (
          <View
            key={i}
            style={[s.msgRow, m.role === "user" ? s.msgRowUser : s.msgRowAI]}
          >
            {m.role === "ai" && (
              <View style={s.aiBadge}>
                <Bot size={12} color="#9458E0" strokeWidth={2} />
              </View>
            )}
            <View
              style={[s.bubble, m.role === "user" ? s.bubbleUser : s.bubbleAI]}
            >
              {m.role === "user" ? (
                <Text style={s.bubbleTxt}>{m.text}</Text>
              ) : (
                <Markdown style={markdownStyles}>{m.text}</Markdown>
              )}
            </View>
          </View>
        ))}

        {typing && (
          <View style={s.msgRowAI}>
            <View style={s.aiBadge}>
              <Bot size={12} color="#9458E0" strokeWidth={2} />
            </View>
            <View style={s.bubbleAI}>
              <View style={s.typingDots}>
                {[0, 1, 2].map((i) => (
                  <PulsingDot
                    key={i}
                    size={6}
                    color={C.ts}
                    style={{ marginHorizontal: 2 }}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={s.inputBar}>
        <View style={s.inputWrap}>
          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about Redemption City..."
            placeholderTextColor={C.tm}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[s.sendBtn, !input.trim() && s.sendBtnDisabled]}
            onPress={() => sendMessage()}
            activeOpacity={0.8}
          >
            <Send
              size={14}
              color={input.trim() ? "#fff" : C.ts}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles (identical to original – no changes needed)
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#08011A" },
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 17, fontWeight: "700", color: "#EBE3D6" },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 1 },
  statusTxt: { fontSize: 10, color: "#3DAA6A", fontWeight: "600" },
  botBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(113,40,206,0.15)",
    borderWidth: 1,
    borderColor: "rgba(113,40,206,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  quickBlock: { marginBottom: 16 },
  quickLabel: {
    fontSize: 10,
    color: "#8C7DA0",
    marginBottom: 8,
    fontWeight: "500",
  },
  quickChips: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  chipTxt: { fontSize: 11, color: "#EBE3D6", fontWeight: "500" },
  msgRow: { marginBottom: 12, flexDirection: "row", alignItems: "flex-start" },
  msgRowAI: { justifyContent: "flex-start" },
  msgRowUser: { justifyContent: "flex-end" },
  aiBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "rgba(113,40,206,0.18)",
    borderWidth: 1,
    borderColor: "rgba(113,40,206,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginTop: 2,
  },
  bubble: {
    maxWidth: "76%",
    padding: 10,
    paddingHorizontal: 13,
    borderRadius: 16,
  },
  bubbleAI: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderTopLeftRadius: 4,
  },
  bubbleUser: { backgroundColor: "#7128CE", borderTopRightRadius: 4 },
  bubbleTxt: { fontSize: 12.5, color: "#EBE3D6", lineHeight: 19 },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  inputBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.07)",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 16,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 8,
    gap: 10,
  },
  input: { flex: 1, fontSize: 12.5, color: "#EBE3D6", padding: 0 },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#7128CE",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: "rgba(255,255,255,0.07)" },
});
const markdownStyles = {
  body: { color: '#EBE3D6', fontSize: 12.5, lineHeight: 19 },
  strong: { fontWeight: 'bold', color: '#C48D38' }, // optional: gold bold text
  link: { color: '#7128CE' },
  paragraph: { marginBottom: 0 },
};
