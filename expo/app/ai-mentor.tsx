import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Send, Bot, User } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export default function AIMentorScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI startup mentor. I can help you with business strategy, fundraising, product development, and more. What would you like to discuss today?",
      isUser: false,
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("https://toolkit.rork.com/text/llm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are an expert startup mentor and advisor. You help entrepreneurs with business strategy, fundraising, product development, market validation, team building, and all aspects of building a successful startup. Provide practical, actionable advice based on proven startup methodologies and best practices. Keep responses concise but comprehensive.",
            },
            {
              role: "user",
              content: inputText.trim(),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI mentor");
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.completion,
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <View style={[
        styles.messageIcon,
        item.isUser ? styles.userIcon : styles.aiIcon
      ]}>
        {item.isUser ? (
          <User size={16} color={Colors.card} />
        ) : (
          <Bot size={16} color={Colors.card} />
        )}
      </View>
      <Card style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userText : styles.aiText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </Card>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>AI is thinking...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask your AI mentor anything..."
          placeholderTextColor={Colors.textSecondary}
          multiline
          maxLength={500}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Send size={20} color={Colors.card} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messagesContainer: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: Theme.spacing.sm,
    alignItems: "flex-start",
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  aiMessage: {
    justifyContent: "flex-start",
  },
  messageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: Theme.spacing.sm,
  },
  userIcon: {
    backgroundColor: Colors.primary,
    order: 2,
  },
  aiIcon: {
    backgroundColor: Colors.secondary,
    order: 1,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: Theme.spacing.md,
  },
  userBubble: {
    backgroundColor: Colors.primary + "10",
    borderColor: Colors.primary + "30",
    borderWidth: 1,
    order: 1,
  },
  aiBubble: {
    backgroundColor: Colors.card,
    order: 2,
  },
  messageText: {
    fontSize: Theme.typography.sizes.md,
    lineHeight: 20,
    marginBottom: Theme.spacing.xs,
  },
  userText: {
    color: Colors.text,
  },
  aiText: {
    color: Colors.text,
  },
  timestamp: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
    alignSelf: "flex-end",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Theme.spacing.md,
  },
  loadingText: {
    marginLeft: Theme.spacing.sm,
    color: Colors.textSecondary,
    fontSize: Theme.typography.sizes.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: Theme.spacing.md,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    maxHeight: 100,
    marginRight: Theme.spacing.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
});