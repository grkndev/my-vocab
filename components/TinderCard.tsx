import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

const screenWidth = Dimensions.get("screen").width;
export const tinderCardWidth = Dimensions.get("screen").width * 0.85;

type TinderCard = {
  user: {
    name: string;
    meaning: string;
    example?: string;
    forms?: string;
    uniqueKey: string;
  };
  numOfCards: number;
  index: number;
  activeIndex: SharedValue<number>;
  onResponse: (user: { name: string; status: boolean; id: number; meaning: string; uniqueKey: string }) => void;
  isRemoving: boolean
};

export default function TinderCard({
  user,
  numOfCards,
  index,
  activeIndex,
  onResponse,
  isRemoving
}: TinderCard) {
  const translationX = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const animatedCard = useAnimatedStyle(() => ({
    opacity: isRemoving ? 0 : interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [1 - 1 / 5, 1, 1]
    ),
    transform: [
      {
        scale: interpolate(
          activeIndex.value,
          [index - 1, index, index + 1],
          [0.95, 1, 1]
        ),
      },
      {
        translateY: interpolate(
          activeIndex.value,
          [index - 1, index, index + 1],
          [-30, 0, 0]
        ),
      },
      {
        translateX: translationX.value,
      },
      {
        rotateZ: `${interpolate(
          translationX.value,
          [-screenWidth / 2, 0, screenWidth / 2],
          [-15, 0, 15]
        )}deg`,
      },
    ],
  }));

  const gesture = Gesture.Pan()
    .enabled(!isRemoving)
    .onChange((event) => {
      translationX.value = event.translationX;
      activeIndex.value = interpolate(
        Math.abs(translationX.value),
        [0, 500],
        [index, index + 0.8]
      );
    })
    .onEnd((event) => {
      if (Math.abs(event.velocityX) > 400) {

        translationX.value = withSpring(
          Math.sign(event.velocityX) * 500, 
          {
            velocity: event.velocityX,
            damping: 25,
            stiffness: 100,
          }
        );
        activeIndex.value = withSpring(index + 1, {
          damping: 25,
          stiffness: 100,
        });
        runOnJS(onResponse)({
          ...user,
          status: event.velocityX > 0,
          id: index,
        });
      } else {
       
        translationX.value = withSpring(0, {
          damping: 25,
          stiffness: 100,
        });
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.card,
          animatedCard,
          {
            zIndex: numOfCards - index,
          },
        ]}
      >
        <Pressable
          onPress={() => setIsFlipped(!isFlipped)}
          style={styles.cardContent}
        >
          <View style={styles.cardInner}>
            {!isFlipped ? (
              // Ön yüz - Kelime
              <View style={styles.frontFace}>
                <Text style={styles.wordText}>{user.name}</Text>
                {user.forms && (
                  <Text style={styles.formsText}>{user.forms}</Text>
                )}
                {user.example && (
                  <Text style={styles.exampleText}>{user.example}</Text>
                )}
                <Text style={styles.tapHint}>Tap to view definition</Text>
              </View>
            ) : (
              // Arka yüz - Anlam
              <View style={styles.backFace}>
                <Text style={styles.definitionLabel}>Definition</Text>
                <Text style={styles.meaningText}>{user.meaning}</Text>
                <Text style={styles.tapHint}>Tap to go back</Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* Stacked card effect */}
        <View style={[styles.stackedCard, styles.stackedCard1]} />
        <View style={[styles.stackedCard, styles.stackedCard2]} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    aspectRatio: 1 / 1.5,
    width: tinderCardWidth,
  },
  cardContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 24,
  },
  frontFace: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  backFace: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  wordText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
    textAlign: "center",
  },
  formsText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  exampleText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  definitionLabel: {
    fontSize: 14,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
  meaningText: {
    fontSize: 24,
    color: "#333",
    textAlign: "center",
    lineHeight: 36,
    fontWeight: "500",
  },
  tapHint: {
    position: "absolute",
    bottom: 24,
    fontSize: 14,
    color: "#bbb",
    textAlign: "center",
  },
  stackedCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 24,
    zIndex: -1,
  },
  stackedCard1: {
    transform: [{ translateY: 8 }, { scale: 0.97 }],
  },
  stackedCard2: {
    transform: [{ translateY: 16 }, { scale: 0.94 }],
  },
});