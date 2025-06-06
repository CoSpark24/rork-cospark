import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { MapPin, User, Camera, Video, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAuthStore } from "@/store/auth-store";
import { FundingStatus, StartupStage } from "@/types";
import { skillCategories } from "@/mocks/skills";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    location: user?.location || "",
    bio: user?.bio || "",
    startupIdea: user?.startupIdea || "",
    vision: user?.vision || "",
    stage: user?.stage || StartupStage.IDEATION,
    fundingStatus: user?.fundingStatus || FundingStatus.BOOTSTRAPPED,
    skills: user?.skills || [],
    lookingFor: user?.lookingFor || [],
    avatar: user?.avatar || "",
    videoIntro: user?.videoIntro || "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      handleChange(
        "skills",
        formData.skills.filter((s) => s !== skill)
      );
    } else {
      handleChange("skills", [...formData.skills, skill]);
    }
  };

  const toggleLookingFor = (skill: string) => {
    if (formData.lookingFor.includes(skill)) {
      handleChange(
        "lookingFor",
        formData.lookingFor.filter((s) => s !== skill)
      );
    } else {
      handleChange("lookingFor", [...formData.lookingFor, skill]);
    }
  };

  const handleSubmit = async () => {
    await updateProfile(formData);
    router.back();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      handleChange("avatar", result.assets[0].uri);
    }
  };

  const recordVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to record video!");
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
      videoMaxDuration: 60, // 1 minute max
    });

    if (!result.canceled) {
      handleChange("videoIntro", result.assets[0].uri);
    }
  };

  const removeVideo = () => {
    handleChange("videoIntro", "");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              {formData.avatar ? (
                <Image source={{ uri: formData.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={40} color={Colors.textSecondary} />
                </View>
              )}
              <View style={styles.cameraButton}>
                <Camera size={16} color={Colors.card} />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarLabel}>Profile Photo</Text>
          </View>

          <View style={styles.videoSection}>
            <Text style={styles.videoTitle}>Intro Video (60s max)</Text>
            <Text style={styles.videoDescription}>
              Record a short video introducing yourself and your startup idea
            </Text>
            
            {formData.videoIntro ? (
              <View style={styles.videoPreviewContainer}>
                <Text style={styles.videoPreviewText}>Video recorded</Text>
                <View style={styles.videoActions}>
                  <Button
                    title="Re-record"
                    onPress={recordVideo}
                    leftIcon={<Video size={16} color={Colors.primary} />}
                    variant="outline"
                    style={styles.videoButton}
                  />
                  <Button
                    title="Remove"
                    onPress={removeVideo}
                    leftIcon={<X size={16} color={Colors.error} />}
                    variant="outline"
                    style={[styles.videoButton, styles.removeButton]}
                    textStyle={{ color: Colors.error }}
                  />
                </View>
              </View>
            ) : (
              <Button
                title="Record Video"
                onPress={recordVideo}
                leftIcon={<Video size={18} color={Colors.card} />}
                gradient
                style={styles.recordButton}
              />
            )}
          </View>

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            leftIcon={<User size={20} color={Colors.textSecondary} />}
          />

          <Input
            label="Location"
            placeholder="e.g., Bangalore, India"
            value={formData.location}
            onChangeText={(text) => handleChange("location", text)}
            leftIcon={<MapPin size={20} color={Colors.textSecondary} />}
          />

          <Input
            label="Bio"
            placeholder="Tell potential co-founders about yourself"
            value={formData.bio}
            onChangeText={(text) => handleChange("bio", text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Input
            label="Startup Idea"
            placeholder="Briefly describe your startup idea"
            value={formData.startupIdea}
            onChangeText={(text) => handleChange("startupIdea", text)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Input
            label="Vision"
            placeholder="What's your vision for this startup?"
            value={formData.vision}
            onChangeText={(text) => handleChange("vision", text)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Startup Stage</Text>
          <View style={styles.optionsContainer}>
            {Object.values(StartupStage).map((stage) => (
              <TouchableOpacity
                key={stage}
                style={[
                  styles.optionButton,
                  formData.stage === stage && styles.selectedOption,
                ]}
                onPress={() => handleChange("stage", stage)}
              >
                <Text
                  style={[
                    styles.optionText,
                    formData.stage === stage && styles.selectedOptionText,
                  ]}
                >
                  {stage}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Funding Status</Text>
          <View style={styles.optionsContainer}>
            {Object.values(FundingStatus).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.optionButton,
                  formData.fundingStatus === status && styles.selectedOption,
                ]}
                onPress={() => handleChange("fundingStatus", status)}
              >
                <Text
                  style={[
                    styles.optionText,
                    formData.fundingStatus === status &&
                      styles.selectedOptionText,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Your Skills</Text>
          {skillCategories.map((category) => (
            <View key={category.name} style={styles.skillCategory}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              <View style={styles.skillsContainer}>
                {category.skills.map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    style={[
                      styles.skillButton,
                      formData.skills.includes(skill) && styles.selectedSkill,
                    ]}
                    onPress={() => toggleSkill(skill)}
                  >
                    <Text
                      style={[
                        styles.skillText,
                        formData.skills.includes(skill) &&
                          styles.selectedSkillText,
                      ]}
                    >
                      {skill}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <Text style={styles.label}>Looking For</Text>
          {skillCategories.map((category) => (
            <View key={`looking-${category.name}`} style={styles.skillCategory}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              <View style={styles.skillsContainer}>
                {category.skills.map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    style={[
                      styles.lookingForButton,
                      formData.lookingFor.includes(skill) &&
                        styles.selectedLookingFor,
                    ]}
                    onPress={() => toggleLookingFor(skill)}
                  >
                    <Text
                      style={[
                        styles.lookingForText,
                        formData.lookingFor.includes(skill) &&
                          styles.selectedLookingForText,
                      ]}
                    >
                      {skill}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <Button
            title="Save Changes"
            onPress={handleSubmit}
            loading={isLoading}
            gradient
            fullWidth
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: Theme.spacing.xl,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: Theme.spacing.xl,
  },
  avatarContainer: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Theme.spacing.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.card,
  },
  avatarLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  videoSection: {
    marginBottom: Theme.spacing.xl,
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
  },
  videoTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  videoDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  recordButton: {
    alignSelf: "flex-start",
  },
  videoPreviewContainer: {
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
  },
  videoPreviewText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  videoActions: {
    flexDirection: "row",
  },
  videoButton: {
    marginRight: Theme.spacing.sm,
  },
  removeButton: {
    borderColor: Colors.error,
  },
  label: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Theme.spacing.md,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    color: Colors.text,
    fontSize: Theme.typography.sizes.sm,
  },
  selectedOptionText: {
    color: Colors.card,
    fontWeight: Theme.typography.weights.medium as any,
  },
  skillCategory: {
    marginBottom: Theme.spacing.md,
  },
  categoryTitle: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillButton: {
    borderWidth: 1,
    borderColor: Colors.primary + "50",
    backgroundColor: Colors.primary + "10",
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  selectedSkill: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  skillText: {
    color: Colors.primary,
    fontSize: Theme.typography.sizes.sm,
  },
  selectedSkillText: {
    color: Colors.card,
    fontWeight: Theme.typography.weights.medium as any,
  },
  lookingForButton: {
    borderWidth: 1,
    borderColor: Colors.secondary + "50",
    backgroundColor: Colors.secondary + "10",
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  selectedLookingFor: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  lookingForText: {
    color: Colors.secondary,
    fontSize: Theme.typography.sizes.sm,
  },
  selectedLookingForText: {
    color: Colors.card,
    fontWeight: Theme.typography.weights.medium as any,
  },
  saveButton: {
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.xxl,
  },
});