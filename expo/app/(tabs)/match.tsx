import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Users, Filter, MapPin, Target, Briefcase, UserCheck } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import ProfileCard from "@/components/ProfileCard";
import Button from "@/components/Button";
import FilterModal, { FilterOptions } from "@/components/FilterModal";
import { useAuthStore } from "@/store/auth-store";
import { useMatchesStore } from "@/store/matches-store";
import { useMessagingStore } from "@/store/messaging-store";
import { MatchProfile, UserRole } from "@/types";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const ROLE_ICONS = {
  [UserRole.CO_FOUNDER]: UserCheck,
  [UserRole.INVESTOR]: Target,
  [UserRole.MENTOR]: Briefcase,
  [UserRole.FOUNDER]: Users,
};

export default function MatchScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    potentialMatches,
    currentIndex,
    isLoading,
    error,
    matchingRole,
    fetchMatches,
    connectWithFounder,
    skipFounder,
    resetMatches,
    applyFilters,
    setMatchingRole,
  } = useMatchesStore();
  const { startConversation } = useMessagingStore();

  const [currentProfile, setCurrentProfile] = useState<MatchProfile | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    if (user) {
      // Default to co-founder matching for founders
      const defaultRole = user.role === UserRole.FOUNDER ? UserRole.CO_FOUNDER : UserRole.FOUNDER;
      setMatchingRole(defaultRole);
      fetchMatches(defaultRole);
    }
  }, [user]);

  useEffect(() => {
    if (potentialMatches.length > 0 && currentIndex < potentialMatches.length) {
      setCurrentProfile(potentialMatches[currentIndex]);
    } else {
      setCurrentProfile(null);
    }
  }, [potentialMatches, currentIndex]);

  const handleConnect = (profile: MatchProfile) => {
    connectWithFounder(profile.id);
    
    // Start a conversation with the connected founder
    const conversationId = startConversation(profile.id);
    
    // Optionally navigate to the conversation
    if (conversationId) {
      router.push(`/conversation/${conversationId}`);
    }
  };

  const handleSkip = (profile: MatchProfile) => {
    skipFounder(profile.id);
  };

  const handleReset = () => {
    resetMatches();
    const roleToFetch = matchingRole || UserRole.CO_FOUNDER;
    fetchMatches(roleToFetch);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    applyFilters(filters);
    setFiltersApplied(Object.keys(filters).some((key: string) => {
      const value = filters[key as keyof FilterOptions];
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    }));
  };

  const handleRoleChange = (role: UserRole) => {
    setMatchingRole(role);
    fetchMatches(role);
    setActiveFilters({});
    setFiltersApplied(false);
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.CO_FOUNDER:
        return "Co-founders";
      case UserRole.INVESTOR:
        return "Investors";
      case UserRole.MENTOR:
        return "Mentors";
      default:
        return "Founders";
    }
  };

  const currentMatchingRole = matchingRole || UserRole.CO_FOUNDER;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>
          Finding potential {getRoleDisplayName(currentMatchingRole).toLowerCase()}...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Try Again" onPress={() => fetchMatches(currentMatchingRole)} style={styles.button} />
      </View>
    );
  }

  if (potentialMatches.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Users size={64} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>No Matches Yet</Text>
        <Text style={styles.emptyText}>
          We're still looking for potential {getRoleDisplayName(currentMatchingRole).toLowerCase()} that match your profile
        </Text>
        <Button
          title="Refresh"
          onPress={() => fetchMatches(currentMatchingRole)}
          gradient
          style={styles.button}
        />
      </View>
    );
  }

  if (currentIndex >= potentialMatches.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No More Matches</Text>
        <Text style={styles.emptyText}>
          You've gone through all potential matches. Check back later or reset to start over.
        </Text>
        <Button
          title="Reset Matches"
          onPress={handleReset}
          gradient
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Find Your {getRoleDisplayName(currentMatchingRole)}</Text>
          <Text style={styles.subtitle}>
            Swipe right to connect, left to skip
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, filtersApplied && styles.filterButtonActive]} 
          onPress={toggleFilterModal}
        >
          <Filter size={24} color={filtersApplied ? Colors.card : Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Role Selection */}
      <View style={styles.roleSelector}>
        {Object.values(UserRole).filter(role => role !== user?.role).map((role) => {
          const IconComponent = ROLE_ICONS[role];
          const isSelected = matchingRole === role;
          
          return (
            <TouchableOpacity
              key={role}
              style={[styles.roleButton, isSelected && styles.selectedRoleButton]}
              onPress={() => handleRoleChange(role)}
            >
              <IconComponent 
                size={20} 
                color={isSelected ? Colors.card : Colors.textSecondary} 
              />
              <Text style={[
                styles.roleButtonText,
                isSelected && styles.selectedRoleButtonText
              ]}>
                {getRoleDisplayName(role)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {currentProfile && (
        <View style={styles.cardContainer}>
          <ProfileCard
            profile={currentProfile}
            onConnect={handleConnect}
            onSkip={handleSkip}
          />
        </View>
      )}

      <FilterModal
        visible={filterModalVisible}
        onClose={toggleFilterModal}
        initialFilters={activeFilters}
        onApplyFilters={handleApplyFilters}
        matchingRole={currentMatchingRole}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Theme.spacing.xl,
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
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  roleSelector: {
    flexDirection: "row",
    marginBottom: Theme.spacing.xl,
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xs,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
    gap: Theme.spacing.xs,
  },
  selectedRoleButton: {
    backgroundColor: Colors.primary,
  },
  roleButtonText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  selectedRoleButtonText: {
    color: Colors.card,
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
    textAlign: "center",
  },
  errorText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.error,
    marginBottom: Theme.spacing.md,
    textAlign: "center",
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
    maxWidth: width * 0.8,
  },
  button: {
    minWidth: 200,
  },
});