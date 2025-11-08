import TinderCard from "@/components/TinderCard";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
    runOnJS,
    useAnimatedReaction,
    useSharedValue,
} from "react-native-reanimated";

// Vocabulary verileri
const initialVocabulary = [
  { id: 1, name: "Ephemeral", meaning: "Lasting for a very short time" },
  { id: 2, name: "Ubiquitous", meaning: "Present everywhere" },
  { id: 3, name: "Serendipity", meaning: "Happy accident" },
  { id: 4, name: "Mellifluous", meaning: "Sweet sounding" },
  { id: 5, name: "Eloquent", meaning: "Fluent and persuasive" },
  { id: 6, name: "Resilient", meaning: "Able to recover quickly" },
  { id: 7, name: "Pragmatic", meaning: "Practical approach" },
  { id: 8, name: "Ephemeral", meaning: "Temporary, fleeting" },
  { id: 9, name: "Paradox", meaning: "Contradictory statement" },
  { id: 10, name: "Zenith", meaning: "Highest point" },
];

export default function VocabularyCards() {
  const [vocabulary, setVocabulary] = useState(initialVocabulary);
  const activeIndex = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState<number[]>([]);

  useAnimatedReaction(
    () => activeIndex.value,
    (value, prev) => {
      if (Math.floor(value) !== index) {
        runOnJS(setIndex)(Math.floor(value));
      }
    }
  );

  const onResponse = (user: { name: string; meaning: string; id: number, status:boolean }) => {
    if (user.status) {
      // LIKE - Kelime öğrenildi, listeden çıkar
      console.log(`✅ Learned: ${user.name}`);
      setLearnedWords((prev) => [...prev, user.id]);
      setVocabulary((prev) => prev.filter((word) => word.id !== user.id));
    } else {
      // DISLIKE - Kelimeyi tekrar göster, listenin sonuna ekle
      console.log(`🔄 Review again: ${user.name}`);
      setVocabulary((prev) => [...prev, user]);
    }
  };

  // İstatistikler
  const learned = learnedWords.length;
  const remaining = vocabulary.length;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Progress Header */}
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{learned}</Text>
            <Text style={styles.statLabel}>Learned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{remaining}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {vocabulary.map((user, idx) => (
          <TinderCard
            key={user.id}
            user={user}
            numOfCards={vocabulary.length}
            index={idx}
            activeIndex={activeIndex}
            onResponse={onResponse}
          />
        ))}

        {/* Tüm kartlar bittiğinde */}
        {vocabulary.length === 0 && (
          <View style={styles.completedContainer}>
            <Text style={styles.completedEmoji}>🎉</Text>
            <Text style={styles.completedTitle}>All Done!</Text>
            <Text style={styles.completedText}>
              You've learned {learned} words!
            </Text>
          </View>
        )}
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionIcon}>👈</Text>
          <Text style={styles.instructionText}>Review Again</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionIcon}>👉</Text>
          <Text style={styles.instructionText}>I Know This</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 30,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#ddd",
  },
  cardsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  completedContainer: {
    alignItems: "center",
    padding: 40,
  },
  completedEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  completedText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  instructionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  instructionItem: {
    alignItems: "center",
  },
  instructionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});