import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import ActionButtons from "@/components/ActionButtons";
import ProgressHeader from "@/components/ProgressHeader";
import TinderCard from "@/components/TinderCard";
import { INITIAL_VOCABULARY } from "@/data/vocabulary";
import { SwipeResponse, Word } from "@/types/word";

function generateUniqueKey(wordId: number) {
  // Basit benzersiz anahtar üretimi (bağımlılık gerektirmez)
  return `word-${wordId}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export default function VocabularyCards() {
  const [vocabulary, setVocabulary] = useState<Word[]>(INITIAL_VOCABULARY);
  const [learnedCount, setLearnedCount] = useState(0);
  const activeIndex = useSharedValue(0);

  const handleSwipe = useCallback((response: SwipeResponse) => {
    if (response.status) {
      setLearnedCount((p) => p + 1);
    } else {
      const newWord: Word = {
        ...response,
        uniqueKey: generateUniqueKey(response.id),
      };
      setVocabulary((prev) => [...prev, newWord]);
    }
  }, []);

  const total = INITIAL_VOCABULARY.length;
  const hasCards = vocabulary.length > 0;

  return (
    <LinearGradient
      colors={["#7DD3FC", "#38BDF8", "#0EA5E9"]}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <ProgressHeader learned={learnedCount} total={total} />

      <View style={styles.cardsContainer}>
        {hasCards ? (
          vocabulary.map((word, idx) => (
            <TinderCard
              key={word.uniqueKey}
              user={word}
              numOfCards={vocabulary.length}
              index={idx}
              activeIndex={activeIndex}
              onResponse={handleSwipe}
              isRemoving={false}
            />
          ))
        ) : (
          <View style={styles.completed}>
            <Text style={styles.completedEmoji}>🎉</Text>
            <Text style={styles.completedTitle}>All Done!</Text>
            <Text style={styles.completedText}>
              You've learned {learnedCount} words!
            </Text>
          </View>
        )}
      </View>

      <ActionButtons
        disabled={!hasCards}
        onRepeat={() => {
          // Örnek: mevcut en üst kartı "tekrar" olarak sona at
          const top = vocabulary[0];
          if (!top) return;
          const copy = { ...top, uniqueKey: generateUniqueKey(top.id) };
          setVocabulary((p) => [...p.slice(1), copy]);
        }}
        onLearn={() => {
          // Örnek: mevcut en üst kartı "öğrenildi" olarak kaldır
          const top = vocabulary[0];
          if (!top) return;
          setLearnedCount((p) => p + 1);
          setVocabulary((p) => p.slice(1));
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardsContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  completed: { alignItems: "center", padding: 40 },
  completedEmoji: { fontSize: 64, marginBottom: 16 },
  completedTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  completedText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
});
