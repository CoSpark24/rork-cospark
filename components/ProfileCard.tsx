import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Heart, X, MapPin, Briefcase, Award, Target, DollarSign, Clock, Building } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "./Card";
import Button from "./Button";
import { MatchProfile, UserRole } from "@/types";

interface ProfileCardProps {
  profile: MatchProfile;
  onConnect: (profile: MatchProfile) => void;
  onSkip: (profile: MatchProfile) => void;
}

export default function ProfileCard({ profile, onConnect, onSkip }: ProfileCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const renderRoleSpecificInfo = () => {
    switch (profile.role) {
      case UserRole.INVESTOR:
        return (
          <>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <DollarSign size={14} color={Colors.primary} />
                <Text style={styles.infoText}>{profile.investmentRange || "Not specified"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Building size={14} color={Colors.primary} />
                <Text style={styles.infoText}>{profile.portfolioCompanies?.length || 0} Portfolio</Text>
              </View>
            </View>
            
            {showDetails && profile.investmentFocus && (
              <>
                <Text style={styles.sectionTitle}>Investment Focus</Text>
                <View style={styles.skillsContainer}>
                  {profile.investmentFocus.map((focus, index) => (
                    <View key={index} style={styles.investmentBadge}>
                      <Text style={styles.investmentText}>{focus}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        );
      
      case UserRole.MENTOR:
        return (
          <>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Clock size={14} color={Colors.primary} />
                <Text style={styles.infoText}>{profile.availability || "Flexible"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Award size={14} color={Colors.primary} />
                <Text style={styles.infoText}>{profile.experience?.split(" ")[0] || "Expert"}</Text>
              </View>
            </View>
            
            {showDetails && profile.mentoringAreas && (
              <>
                <Text style={styles.sectionTitle}>Mentoring Areas</Text>
                <View style={styles.skillsContainer}>
                  {profile.mentoringAreas.map((area, index) => (
                    <View key={index} style={styles.mentoringBadge}>
                      <Text style={styles.mentoringText}>{area}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        );
      
      default:
        return (
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Briefcase size={14} color={Colors.primary} />
              <Text style={styles.infoText}>{profile.stage}</Text>
            </View>
            <View style={styles.infoItem}>
              <Award size={14} color={Colors.primary} />
              <Text style={styles.infoText}>{profile.fundingStatus}</Text>
            </View>
          </View>
        );
    }
  };

  const getConnectButtonText = () => {
    switch (profile.role) {
      case UserRole.INVESTOR:
        return "Connect";
      case UserRole.MENTOR:
        return "Request Mentorship";
      default:
        return "Connect";
    }
  };

  return (
    <Card style={styles.container} elevation="large">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: profile.avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
            }}
            style={styles.profileImage}
          />
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{profile.matchScore}% Match</Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{profile.role}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{profile.name}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.textSecondary} />
            <Text style={styles.location}>{profile.location}</Text>
            {profile.industry && (
              <>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.industry}>{profile.industry}</Text>
              </>
            )}
          </View>

          {renderRoleSpecificInfo()}

          {profile.role !== UserRole.INVESTOR && profile.role !== UserRole.MENTOR && (
            <>
              <Text style={styles.sectionTitle}>Startup Idea</Text>
              <Text style={styles.text} numberOfLines={showDetails ? undefined : 2}>
                {profile.startupIdea}
              </Text>
            </>
          )}

          <Text style={styles.sectionTitle}>
            {profile.role === UserRole.INVESTOR ? "Expertise" : 
             profile.role === UserRole.MENTOR ? "Skills" : "Skills"}
          </Text>
          <View style={styles.skillsContainer}>
            {profile.skills.slice(0, showDetails ? undefined : 3).map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
            {!showDetails && profile.skills.length > 3 && (
              <Text style={styles.moreText}>+{profile.skills.length - 3} more</Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>Why You Match</Text>
          {profile.matchReasons.map((reason, index) => (
            <View key={index} style={styles.reasonItem}>
              <Text style={styles.reasonBullet}>•</Text>
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}

          {showDetails && (
            <>
              {profile.role !== UserRole.INVESTOR && profile.role !== UserRole.MENTOR && (
                <>
                  <Text style={styles.sectionTitle}>Vision</Text>
                  <Text style={styles.text}>{profile.vision}</Text>

                  <Text style={styles.sectionTitle}>Looking For</Text>
                  <View style={styles.skillsContainer}>
                    {profile.lookingFor.map((skill, index) => (
                      <View key={index} style={styles.lookingForBadge}>
                        <Text style={styles.lookingForText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.sectionTitle}>Bio</Text>
              <Text style={styles.text}>{profile.bio}</Text>
            </>
          )}

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={styles.detailsButtonText}>
              {showDetails ? "Show Less" : "Show More"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          title="Skip"
          onPress={() => onSkip(profile)}
          variant="outline"
          leftIcon={<X size={18} color={Colors.textSecondary} />}
          style={styles.actionButton}
        />
        <Button
          title={getConnectButtonText()}
          onPress={() => onConnect(profile)}
          gradient
          leftIcon={<Heart size={18} color={Colors.card} />}
          style={styles.actionButton}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 350,
    maxHeight: "80%",
    padding: 0,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 200,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  matchBadge: {
    position: "absolute",
    top: Theme.spacing.md,
    right: Theme.spacing.md,
    backgroundColor: Colors.success,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  matchText: {
    color: Colors.card,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold as any,
  },
  roleBadge: {
    position: "absolute",
    top: Theme.spacing.md,
    left: Theme.spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  roleText: {
    color: Colors.card,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold as any,
  },
  content: {
    padding: Theme.spacing.md,
  },
  name: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  location: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  separator: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginHorizontal: Theme.spacing.xs,
  },
  industry: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: Theme.spacing.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Theme.spacing.lg,
  },
  infoText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    marginLeft: Theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  text: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    lineHeight: 18,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Theme.spacing.sm,
  },
  skillBadge: {
    backgroundColor: Colors.primary + "20",
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  skillText: {
    color: Colors.primary,
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
  },
  investmentBadge: {
    backgroundColor: Colors.success + "20",
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  investmentText: {
    color: Colors.success,
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
  },
  mentoringBadge: {
    backgroundColor: Colors.warning + "20",
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  mentoringText: {
    color: Colors.warning,
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
  },
  lookingForBadge: {
    backgroundColor: Colors.secondary + "20",
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  lookingForText: {
    color: Colors.secondary,
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
  },
  moreText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
    alignSelf: "center",
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Theme.spacing.xs,
  },
  reasonBullet: {
    color: Colors.primary,
    marginRight: Theme.spacing.xs,
    fontWeight: Theme.typography.weights.bold as any,
  },
  reasonText: {
    flex: 1,
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    lineHeight: 18,
  },
  detailsButton: {
    alignSelf: "center",
    paddingVertical: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
  },
  detailsButtonText: {
    color: Colors.primary,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
  },
  actions: {
    flexDirection: "row",
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
});