import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Plus, Heart, MessageCircle, Share, TrendingUp, Pin, Flag } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useFeedStore } from "@/store/feed-store";
import { FeedPost } from "@/types";

export default function FeedScreen() {
  const router = useRouter();
  const { posts, isLoading, error, fetchPosts, likePost, pinPost, reportPost } = useFeedStore();
  const [filter, setFilter] = useState<"all" | "trending" | "questions" | "achievements">("all");

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = (postId: string) => {
    likePost(postId);
  };

  const handleComment = (postId: string) => {
    router.push(`/feed/${postId}/comments`);
  };

  const handleShare = (post: FeedPost) => {
    Alert.alert(
      "Share Post",
      "Share this post with your network",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Copy Link", onPress: () => console.log("Copy link") },
        { text: "Share", onPress: () => console.log("Share post") },
      ]
    );
  };

  const handlePin = (postId: string) => {
    pinPost(postId);
    Alert.alert("Success", "Post has been pinned to the top of the feed");
  };

  const handleReport = (postId: string) => {
    Alert.alert(
      "Report Post",
      "Why are you reporting this post?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Spam", onPress: () => reportPost(postId, "spam") },
        { text: "Inappropriate", onPress: () => reportPost(postId, "inappropriate") },
        { text: "Misleading", onPress: () => reportPost(postId, "misleading") },
      ]
    );
  };

  const renderPost = ({ item }: { item: FeedPost }) => (
    <Card style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={{ 
            uri: item.authorAvatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          }}
          style={styles.authorAvatar}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.authorName}</Text>
          <Text style={styles.postTime}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.postBadges}>
          {item.isPinned && (
            <View style={styles.pinnedBadge}>
              <Pin size={12} color={Colors.primary} />
            </View>
          )}
          {item.isTrending && (
            <View style={styles.trendingBadge}>
              <TrendingUp size={12} color={Colors.secondary} />
            </View>
          )}
          <View style={styles.postTypeBadge}>
            <Text style={styles.postTypeText}>{item.type}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleReport(item.id)}>
          <Flag size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.postContent}>{item.content}</Text>

      {item.images && item.images.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.postImage} />
      )}

      <View style={styles.postActions}>
        <TouchableOpacity 
          style={[styles.actionButton, item.isLiked && styles.actionButtonLiked]}
          onPress={() => handleLike(item.id)}
        >
          <Heart 
            size={20} 
            color={item.isLiked ? Colors.error : Colors.textSecondary}
            fill={item.isLiked ? Colors.error : "none"}
          />
          <Text style={[
            styles.actionText,
            item.isLiked && { color: Colors.error }
          ]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleComment(item.id)}
        >
          <MessageCircle size={20} color={Colors.textSecondary} />
          <Text style={styles.actionText}>{item.comments.length}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleShare(item)}
        >
          <Share size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handlePin(item.id)}
        >
          <Pin size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Card>
  );

  const filteredPosts = posts.filter(post => {
    switch (filter) {
      case "trending":
        return post.isTrending;
      case "questions":
        return post.type === "question";
      case "achievements":
        return post.type === "achievement";
      default:
        return true;
    }
  }).sort((a, b) => {
    // Sort pinned posts first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp - a.timestamp;
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading feed...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={fetchPosts}
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Founder Feed</Text>
          <Text style={styles.subtitle}>
            Share updates and connect with the community
          </Text>
        </View>
        <Button
          title="Post"
          onPress={() => router.push("/feed/create")}
          leftIcon={<Plus size={18} color={Colors.card} />}
          gradient
        />
      </View>

      <View style={styles.filterContainer}>
        {["all", "trending", "questions", "achievements"].map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterType as any)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === filterType && styles.filterButtonTextActive,
              ]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredPosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <TrendingUp size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Posts Found</Text>
          <Text style={styles.emptyText}>
            {filter === "all" 
              ? "Be the first to share an update with the founder community"
              : `No ${filter} posts at the moment`
            }
          </Text>
          {filter === "all" && (
            <Button
              title="Create Post"
              onPress={() => router.push("/feed/create")}
              gradient
              style={styles.button}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  filterButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginRight: Theme.spacing.sm,
    backgroundColor: Colors.card,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  filterButtonTextActive: {
    color: Colors.card,
  },
  listContent: {
    padding: Theme.spacing.xl,
  },
  postCard: {
    marginBottom: Theme.spacing.lg,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Theme.spacing.md,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  postTime: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  postBadges: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Theme.spacing.sm,
  },
  pinnedBadge: {
    backgroundColor: Colors.primary + "20",
    padding: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.xs,
  },
  trendingBadge: {
    backgroundColor: Colors.secondary + "20",
    padding: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.xs,
  },
  postTypeBadge: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  postTypeText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  postContent: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: Theme.spacing.md,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
  },
  postActions: {
    flexDirection: "row",
    paddingVertical: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: Theme.spacing.sm,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Theme.spacing.lg,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.sm,
  },
  actionButtonLiked: {
    backgroundColor: Colors.error + "10",
  },
  actionText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: Colors.secondary + "20",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  tagText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
  },
  emptyText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Theme.spacing.xl,
    maxWidth: "80%",
  },
  loadingText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
  },
  errorText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.error,
    marginBottom: Theme.spacing.md,
    textAlign: "center",
  },
  button: {
    minWidth: 200,
  },
});