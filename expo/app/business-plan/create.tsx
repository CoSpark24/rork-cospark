import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import BusinessPlanForm from "@/components/BusinessPlanForm";
import { useBusinessPlanStore } from "@/store/business-plan-store";
import { BusinessPlanData } from "@/types";

export default function CreateBusinessPlanScreen() {
  const router = useRouter();
  const { createBusinessPlan, isLoading } = useBusinessPlanStore();

  const handleSubmit = async (data: Partial<BusinessPlanData>) => {
    await createBusinessPlan(data);
    router.push("/business-plans");
  };

  return (
    <View style={styles.container}>
      <BusinessPlanForm onSubmit={handleSubmit} loading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});