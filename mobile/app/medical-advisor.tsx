import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { Send, User, Bot, ArrowLeft, MoreVertical } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppContext } from '@/context/AppContext';

export default function MedicalAdvisorScreen() {
  const { theme: themeName } = useTheme();
  const theme = Colors[themeName as 'light' | 'dark'];
  const router = useRouter();
  const { userData } = useContext(AppContext);
  
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your LifeSync Health Advisor. How can I help you today?", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = { 
        id: Date.now() + 1, 
        text: "I understand you're asking about " + input + ". Based on preliminary data, this could be related to several factors. However, please consult a real doctor for a proper diagnosis.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isLoading]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>AI Advisor</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <MoreVertical size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[
              styles.messageWrapper,
              msg.sender === 'user' ? styles.userWrapper : styles.botWrapper
            ]}>
              {msg.sender === 'bot' && (
                <View style={[styles.botIcon, { backgroundColor: theme.tint }]}>
                  <Bot size={16} color="#fff" />
                </View>
              )}
              <View style={[
                styles.messageBubble,
                msg.sender === 'user' ? [styles.userBubble, { backgroundColor: theme.tint }] : [styles.botBubble, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]
              ]}>
                <Text style={[
                  styles.messageText,
                  msg.sender === 'user' ? styles.userText : { color: theme.text }
                ]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={styles.botWrapper}>
              <View style={[styles.botIcon, { backgroundColor: theme.tint }]}>
                <Bot size={16} color="#fff" />
              </View>
              <View style={[styles.botBubble, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1, paddingVertical: 10 }]}>
                 <ActivityIndicator size="small" color={theme.tint} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <TextInput
            placeholder="Type your symptoms..."
            placeholderTextColor={theme.icon}
            style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity 
            onPress={handleSend} 
            style={[styles.sendBtn, { backgroundColor: input.trim() ? theme.tint : theme.icon }]}
            disabled={!input.trim()}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backBtn: {
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerStatus: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  moreBtn: {
    padding: 5,
  },
  chatList: {
    padding: 20,
    paddingBottom: 40,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    maxWidth: '85%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  botWrapper: {
    alignSelf: 'flex-start',
  },
  botIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5f6FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 5,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#5f6FFF',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    borderWidth: 1,
    marginRight: 10,
    fontSize: 15,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
});
