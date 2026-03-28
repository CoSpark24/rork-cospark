import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Send, Paperclip, Image, FileText, Mic, MoreVertical, Trash2 } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import { useMessagingStore, Message } from "@/store/messaging-store";
import { useAuthStore } from "@/store/auth-store";
import Button from "@/components/Button";

const { width } = Dimensions.get("window");

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const { 
    getConversation, 
    sendMessage, 
    markConversationAsRead, 
    uploadMedia, 
    uploadingMedia,
    deleteMessage,
    setTypingStatus 
  } = useMessagingStore();
  
  const conversation = getConversation(typeof id === "string" ? id : "");
  const [messageText, setMessageText] = useState("");
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  
  const flatListRef = useRef<FlatList<Message>>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (conversation) {
      markConversationAsRead(conversation.id);
    }
  }, [conversation?.id]);

  useEffect(() => {
    if (conversation?.messages && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation?.messages]);

  const handleSendMessage = () => {
    if (messageText.trim() && conversation) {
      sendMessage(conversation.id, messageText.trim());
      setMessageText("");
      inputRef.current?.focus();
    }
  };

  const handleMediaUpload = async (type: "image" | "document" | "audio") => {
    if (!conversation) return;
    
    setShowMediaOptions(false);
    
    // Simulate file picker
    Alert.alert(
      "Upload " + type.charAt(0).toUpperCase() + type.slice(1),
      `Would you like to upload a ${type}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Upload", 
          onPress: () => uploadMedia(conversation.id, null, type)
        }
      ]
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!conversation) return;
    
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteMessage(conversation.id, messageId);
            setSelectedMessage(null);
          }
        }
      ]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === user?.id;
    const isSelected = selectedMessage === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
          isSelected && styles.selectedMessage,
        ]}
        onLongPress={() => setSelectedMessage(isSelected ? null : item.id)}
        onPress={() => setSelectedMessage(null)}
      >
        <View style={styles.messageContent}>
          {item.type === "image" && item.mediaUrl && (
            <View style={styles.mediaContainer}>
              <View style={styles.imagePlaceholder}>
                <Image size={24} color={Colors.textSecondary} />
                <Text style={styles.mediaText}>Image</Text>
              </View>
            </View>
          )}
          
          {item.type === "document" && (
            <View style={styles.mediaContainer}>
              <View style={styles.documentContainer}>
                <FileText size={24} color={Colors.primary} />
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{item.fileName}</Text>
                  {item.fileSize && (
                    <Text style={styles.documentSize}>
                      {formatFileSize(item.fileSize)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
          
          {item.type === "audio" && (
            <View style={styles.mediaContainer}>
              <View style={styles.audioContainer}>
                <Mic size={20} color={Colors.primary} />
                <Text style={styles.audioText}>Voice message</Text>
              </View>
            </View>
          )}
          
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            {item.text}
          </Text>
          
          <View style={styles.messageFooter}>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
            {isCurrentUser && (
              <Text style={[
                styles.readStatus,
                { color: item.isRead ? Colors.success : Colors.textSecondary }
              ]}>
                {item.isRead ? "✓✓" : "✓"}
              </Text>
            )}
          </View>
        </View>
        
        {isSelected && isCurrentUser && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteMessage(item.id)}
          >
            <Trash2 size={16} color={Colors.error} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (!conversation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: conversation.otherUser.name,
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <MoreVertical size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <FlatList
        ref={flatListRef}
        data={conversation.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => {
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }}
        showsVerticalScrollIndicator={false}
      />
      
      {conversation.isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>
            {conversation.otherUser.name} is typing...
          </Text>
        </View>
      )}
      
      {uploadingMedia && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.uploadingText}>Uploading media...</Text>
        </View>
      )}
      
      {showMediaOptions && (
        <View style={styles.mediaOptionsContainer}>
          <TouchableOpacity
            style={styles.mediaOption}
            onPress={() => handleMediaUpload("image")}
          >
            <Image size={24} color={Colors.primary} />
            <Text style={styles.mediaOptionText}>Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.mediaOption}
            onPress={() => handleMediaUpload("document")}
          >
            <FileText size={24} color={Colors.primary} />
            <Text style={styles.mediaOptionText}>Document</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.mediaOption}
            onPress={() => handleMediaUpload("audio")}
          >
            <Mic size={24} color={Colors.primary} />
            <Text style={styles.mediaOptionText}>Voice</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => setShowMediaOptions(!showMediaOptions)}
        >
          <Paperclip size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textSecondary}
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={1000}
          onFocus={() => setShowMediaOptions(false)}
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
          ]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Send size={20} color={messageText.trim() ? Colors.card : Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: Theme.spacing.md,
    color: Colors.textSecondary,
  },
  headerButton: {
    padding: Theme.spacing.sm,
  },
  messagesContainer: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  messageContainer: {
    maxWidth: width * 0.8,
    marginVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.lg,
    position: "relative",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedMessage: {
    backgroundColor: Colors.accent + "20",
  },
  messageContent: {
    padding: Theme.spacing.md,
  },
  messageText: {
    fontSize: Theme.typography.sizes.md,
    lineHeight: 20,
  },
  currentUserText: {
    color: Colors.card,
  },
  otherUserText: {
    color: Colors.text,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Theme.spacing.xs,
  },
  timestamp: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  readStatus: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.bold as any,
  },
  deleteButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: Colors.card,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.small,
  },
  mediaContainer: {
    marginBottom: Theme.spacing.sm,
  },
  imagePlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  mediaText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.md,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
  },
  documentSize: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.md,
  },
  audioText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
  },
  typingIndicator: {
    padding: Theme.spacing.md,
    backgroundColor: Colors.card,
  },
  typingText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  uploadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
    backgroundColor: Colors.card,
  },
  uploadingText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  mediaOptionsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.xl,
  },
  mediaOption: {
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  mediaOptionText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: Theme.spacing.md,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Theme.spacing.sm,
  },
  attachButton: {
    padding: Theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
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
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: Colors.border,
  },
});