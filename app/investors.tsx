import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { MapPin, ExternalLink, CheckCircle, Briefcase } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useInvestorsStore } from "@/store/investors-store";
import { InvestorProfile } from "@/types";

export default function InvestorsScreen() {
  const { investors, isLoading, error, fetchInvestors, requestIntro } = useInvestorsStore();

  useEffect(() => {
    fetchInvestors();
  }, []);

  const renderInvestor = ({ item }: { item: InvestorProfile }) => (
    <Card style={styles.investorCard}>
      <View style={styles.investorHeader}>
        <Image
          source={{ 
            uri: item.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          }}
          style={styles.investorAvatar}
        />
        <View style={styles.investorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.investorName}>{item.name}</Text>
            {item.isVerified && (
              <CheckCircle size={16} color={Colors.success} />
            )}
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={Colors.textSecondary} />
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.bio} numberOfLines={2}>
        {item.bio}
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Briefcase size={16} color={Colors.primary} />
          <Text style={styles.statText}>{item.portfolioSize} companies</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.ticketSize}>{item.averageTicketSize}</Text>
        </View>
      </View>

      <View style={styles.focusAreas}>
        <Text style={styles.sectionLabel}>Focus Areas:</Text>
        <View style={styles.tagsContainer}>
          {item.focusAreas.map((area, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{area}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.investmentStages}>
        <Text style={styles.sectionLabel}>Investment Stages:</Text>
        <View style={styles.tagsContainer}>
          {item.investmentStages.map((stage, index) => (
            <View key={index} style={styles.stageTag}>
              <Text style={styles.stageTagText}>{stage}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Request Intro"
          onPress={() => requestIntro(item.id, "I would like to connect regarding my startup.")}
          gradient
          style={styles.actionButton}
        />
        {item.website && (
          <TouchableOpacity style={styles.linkButton}>
            <ExternalLink size={16} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading investors...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={fetchInvestors}
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Investors</Text>
        <Text style={styles.subtitle}>
          Connect with investors who match your startup stage and industry
        </Text>
      </View>

      <FlatList
        data={investors}
        renderItem={renderInvestor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    padding: Theme.spacing.xl,
  },
  investorCard: {
    marginBottom: Theme.spacing.lg,
  },
  investorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  investorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Theme.spacing.md,
  },
  investorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  investorName: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginRight: Theme.spacing.sm,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Theme.spacing.xs,
  },
  location: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  bio: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  ticketSize: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.primary,
  },
  focusAreas: {
    marginBottom: Theme.spacing.md,
  },
  investmentStages: {
    marginBottom: Theme.spacing.md,
  },
  sectionLabel: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  tagText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.primary,
  },
  stageTag: {
    backgroundColor: Colors.secondary + "20",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  stageTagText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.secondary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  linkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
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