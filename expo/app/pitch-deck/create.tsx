import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import PitchDeckForm from "@/components/PitchDeckForm";
import { usePitchDeckStore } from "@/store/pitch-deck-store";
import { PitchDeckData } from "@/types";

export default function CreatePitchDeckScreen() {
  const router = useRouter();
  const { createPitchDeck, isLoading } = usePitchDeckStore();

  const handleSubmit = async (data: Partial<PitchDeckData>) => {
    await createPitchDeck(data);
    router.push("/pitch-decks");
  };

  return (
    <View style={styles.container}>
      <PitchDeckForm onSubmit={handleSubmit} loading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});