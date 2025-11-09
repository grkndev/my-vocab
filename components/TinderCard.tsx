import React, { useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";


const screenWidth = Dimensions.get("screen").width;
export const tinderCardWidth = Dimensions.get("screen").width * 0.85;

// Create an Animated component that supports NativeWind className
const AnimatedStyledView = Animated.createAnimatedComponent(View);

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
  onResponse: (user: {
    name: string;
    status: boolean;
    id: number;
    meaning: string;
    uniqueKey: string;
  }) => void;
  isRemoving: boolean;
};

export default function TinderCard({
  user,
  numOfCards,
  index,
  activeIndex,
  onResponse,
  isRemoving,
}: TinderCard) {
  const translationX = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const animatedCard = useAnimatedStyle(() => ({
    opacity: isRemoving
      ? 0
      : interpolate(
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
        translationX.value = withSpring(Math.sign(event.velocityX) * 500, {
          velocity: event.velocityX,
          damping: 25,
          stiffness: 100,
        });
        activeIndex.value = withSpring(index + 1, {
          damping: 25,
          stiffness: 100,
        });
        scheduleOnRN(onResponse, {
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
      <AnimatedStyledView
        className="absolute rounded-2xl"
        style={[
          animatedCard,
          {
            width: tinderCardWidth,
            aspectRatio: 1 / 1.5,
            zIndex: numOfCards - index,
          },
        ]}
      >
        <Pressable
          onPress={() => setIsFlipped(!isFlipped)}
          className="w-full h-full bg-white rounded-2xl shadow-lg"
          style={{ elevation: 8 }}
        >
          <View className="w-full h-full items-center justify-center p-8 rounded-2xl">
            {!isFlipped ? (
              // Front face - Word
              <View className="w-full items-center justify-center">
                <Text className="text-[48px] font-extrabold text-[#1a1a1a] mb-4 text-center">
                  {user.name}
                </Text>

                {user.forms && (
                  <Text className="text-[18px] text-[#666] mb-6 text-center">
                    {user.forms}
                  </Text>
                )}

                {user.example && (
                  <Text className="text-[16px] text-[#888] italic text-center px-5 mb-10">
                    {user.example}
                  </Text>
                )}

                <Text className="absolute bottom-6 text-[14px] text-[#bbb] text-center">
                  Tap to view definition
                </Text>
              </View>
            ) : (
              // Back face - Meaning
              <View className="w-full items-center justify-center">
                <Text className="text-[14px] text-[#999] uppercase tracking-[1px] mb-4">
                  Definition
                </Text>
                <Text className="text-[24px] font-medium text-[#333] text-center leading-[36px]">
                  {user.meaning}
                </Text>
                <Text className="absolute bottom-6 text-[14px] text-[#bbb] text-center">
                  Tap to go back
                </Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* Stacked card effect (kept as Views with transforms) */}
        <View
          className="absolute w-full h-full bg-white/50 rounded-2xl"
          style={{ transform: [{ translateY: 8 }, { scale: 0.97 }], zIndex: -1 }}
        />
        <View
          className="absolute w-full h-full bg-white/50 rounded-2xl"
          style={{ transform: [{ translateY: 16 }, { scale: 0.94 }], zIndex: -2 }}
        />
      </AnimatedStyledView>
    </GestureDetector>
  );
}
