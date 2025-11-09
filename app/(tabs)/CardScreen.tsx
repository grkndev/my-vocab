import TinderCard from "@/components/TinderCard";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// Vocabulary verileri - Genişletilmiş
const initialVocabulary = [
  { 
    id: 1,
    uniqueKey: 'word-1-0',
    name: "Ephemeral", 
    meaning: "Lasting for a very short time",
    forms: "V1 - V2 - collab",
    example: "The morning dew was ephemeral"
  },
  { 
    id: 2,
    uniqueKey: 'word-2-0',
    name: "Ubiquitous", 
    meaning: "Present, appearing, or found everywhere",
    forms: "V1 - V2 - collab",
    example: "Smartphones have become ubiquitous"
  },
  { 
    id: 3,
    uniqueKey: 'word-3-0',
    name: "Serendipity", 
    meaning: "The occurrence of events by chance in a happy way",
    forms: "V1 - V2 - collab",
    example: "Meeting you was pure serendipity"
  },
  { 
    id: 4,
    uniqueKey: 'word-4-0',
    name: "Mellifluous", 
    meaning: "Sweet or musical; pleasant to hear",
    forms: "V1 - V2 - collab",
    example: "Her mellifluous voice calmed everyone"
  },
  { 
    id: 5,
    uniqueKey: 'word-5-0',
    name: "Eloquent", 
    meaning: "Fluent or persuasive in speaking or writing",
    forms: "V1 - V2 - collab",
    example: "He gave an eloquent speech"
  },
  { 
    id: 6,
    uniqueKey: 'word-6-0',
    name: "Resilient", 
    meaning: "Able to withstand or recover quickly from difficulties",
    forms: "V1 - V2 - collab",
    example: "Children are remarkably resilient"
  },
  { 
    id: 7,
    uniqueKey: 'word-7-0',
    name: "Pragmatic", 
    meaning: "Dealing with things sensibly and realistically",
    forms: "V1 - V2 - collab",
    example: "We need a pragmatic approach"
  },
  { 
    id: 8,
    uniqueKey: 'word-8-0',
    name: "Paradigm", 
    meaning: "A typical example or pattern of something",
    forms: "V1 - V2 - collab",
    example: "This represents a paradigm shift"
  },
  { 
    id: 9,
    uniqueKey: 'word-9-0',
    name: "Paradox", 
    meaning: "A seemingly contradictory statement that may be true",
    forms: "V1 - V2 - collab",
    example: "It's a paradox of modern life"
  },
  { 
    id: 10,
    uniqueKey: 'word-10-0',
    name: "Zenith", 
    meaning: "The highest point reached; peak",
    forms: "V1 - V2 - collab",
    example: "At the zenith of his career"
  },
];

export default function VocabularyCards() {
  const [vocabulary, setVocabulary] = useState(initialVocabulary);
  const activeIndex = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState<number[]>([]);
  const [keyCounter, setKeyCounter] = useState(initialVocabulary.length);
  const [removingKeys, setRemovingKeys] = useState<string[]>([]);

  useAnimatedReaction(
    () => activeIndex.value,
    (value, prev) => {
      if (Math.floor(value) !== index) {
        runOnJS(setIndex)(Math.floor(value));
      }
    }
  );

  const onResponse = (user: { name: string; meaning: string; id: number; status: boolean; uniqueKey: string }) => {
    if (user.status) {
      // LIKE - Kelime öğrenildi
      console.log(`✅ Learned: ${user.name}`);
     // setRemovingKeys((prev) => [...prev, user.uniqueKey]);
      
      // setTimeout(() => {
      //   setLearnedWords((prev) => [...prev, user.id]);
      //   setVocabulary((prev) => prev.filter((word) => word.uniqueKey !== user.uniqueKey));
      //   setRemovingKeys((prev) => prev.filter((key) => key !== user.uniqueKey));
      // }, 400); // Biraz daha uzun süre
    } else {
      // DISLIKE - Kelimeyi tekrar göster
      console.log(`🔄 Review again: ${user.name}`);
      setTimeout(() => {
        setKeyCounter((prev) => prev + 1);
        const newWord = { ...user, uniqueKey: `word-${user.id}-${keyCounter}` };
        setVocabulary((prev) => [...prev, newWord]);
      }, 300);
    }
  };

  const handleReview = () => {
    if (vocabulary.length > 0) {
      const currentWord = vocabulary[index];
      activeIndex.value = withSpring(index + 1);
      
      setTimeout(() => {
        setKeyCounter((prev) => prev + 1);
        const newWord = { ...currentWord, uniqueKey: `word-${currentWord.id}-${keyCounter}` };
        setVocabulary((prev) => [...prev, newWord]);
      }, 300);
    }
  };

  const handleKnow = () => {
    if (vocabulary.length > 0) {
      const currentWord = vocabulary[index];
      setRemovingKeys((prev) => [...prev, currentWord.uniqueKey]);
      activeIndex.value = withSpring(index + 1);
      
      setTimeout(() => {
        setLearnedWords((prev) => [...prev, currentWord.id]);
        setVocabulary((prev) => prev.filter((word) => word.uniqueKey !== currentWord.uniqueKey));
        setRemovingKeys((prev) => prev.filter((key) => key !== currentWord.uniqueKey));
      }, 400);
    }
  };

  const learned = learnedWords.length;
  const remaining = vocabulary.length;
  const total = initialVocabulary.length;
  const progress = learned / total;

  return (
    <LinearGradient
      colors={["#7DD3FC", "#38BDF8", "#0EA5E9"]}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Progress Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{learned.toString().padStart(2, '0')}</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{total.toString().padStart(2, '0')}</Text>
        </View>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {vocabulary.map((user, idx) => {
          const isRemoving = removingKeys.includes(user.uniqueKey);
          return (
            <TinderCard
              key={user.uniqueKey}
              user={user}
              numOfCards={vocabulary.length}
              index={idx}
              activeIndex={activeIndex}
              onResponse={onResponse}
              isRemoving={isRemoving}
            />
          );
        })}

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

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Pressable 
          style={styles.actionButton}
          onPress={handleReview}
          disabled={vocabulary.length === 0}
        >
          <View style={styles.actionButtonInner}>
            <Text style={styles.actionIcon}>🔄</Text>
          </View>
        </Pressable>

        <Pressable 
          style={styles.actionButton}
          onPress={handleKnow}
          disabled={vocabulary.length === 0}
        >
          <View style={styles.actionButtonInner}>
            <Text style={styles.actionIcon}>✓</Text>
          </View>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    width: 50,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 4,
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
    color: "white",
    marginBottom: 8,
  },
  completedText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 40,
    paddingHorizontal: 60,
  },
  actionButton: {
    width: 80,
    height: 80,
  },
  actionButtonInner: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  actionIcon: {
    fontSize: 36,
  },
});