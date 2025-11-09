import React from "react";
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

// Animated + NativeWind support
const AnimatedStyledView = Animated.createAnimatedComponent(View);
const AnimatedStyledPressable = Animated.createAnimatedComponent(Pressable);

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
  const flip = useSharedValue(0); // degrees: 0 = front, 180 = back
  const [isFlipped, setFlip] = React.useState(false)

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

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${flip.value}deg` }],
    backfaceVisibility: "hidden",
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${flip.value + 180}deg` }],
    backfaceVisibility: "hidden",
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

  const onCardPress = () => {
    // Toggle flip: if near 0 -> go to 180, else back to 0
    const current = ((flip.value % 360) + 360) % 360; // normalize to [0,360)
    if (current < 90 || current > 270) {
      flip.value = withSpring(180, { stiffness: 160, damping: 36 });
      setFlip(true)
    } else {
      flip.value = withSpring(0, { stiffness: 160, damping: 36 });
      setFlip(false)
    }
  };

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
        {/* Pressable içerik artık Animated, böylece flip animasyonunu uygulayabiliyoruz */}
        <AnimatedStyledPressable
          onPress={onCardPress}
          className="w-full h-full bg-white rounded-2xl shadow-lg"
          style={{ elevation: 8 }}
        >
          <View className="w-full h-full items-center justify-center p-8 rounded-2xl">
            {/* Front face */}
            <Animated.View style={[frontAnimatedStyle]}>
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
              </View>
            </Animated.View>
            <View className="absolute bottom-10">
              <Text className=" text-[14px] text-[#bbb] text-center">
                {isFlipped
                  ? "Tap go back"
                  : "Tap to view definition"}
              </Text>
            </View>
            {/* Back face */}
            <Animated.View className={"absolute"} style={[backAnimatedStyle]}>
              <View className="w-full items-center justify-center">
                <Text className="text-[14px] text-[#999] uppercase tracking-[1px] mb-4">
                  Definition
                </Text>
                <Text className="text-[24px] font-medium text-[#333] text-center leading-[36px]">
                  {user.meaning}
                </Text>
                
              </View>
            </Animated.View>
          </View>
        </AnimatedStyledPressable>

        {/* Stacked card effect */}
        <View
          className="absolute w-full h-full bg-white/50 rounded-2xl"
          style={{
            transform: [{ translateY: 8 }, { scale: 0.97 }],
            zIndex: -1,
          }}
        />
        <View
          className="absolute w-full h-full bg-white/50 rounded-2xl"
          style={{
            transform: [{ translateY: 16 }, { scale: 0.94 }],
            zIndex: -2,
          }}
        />
      </AnimatedStyledView>
    </GestureDetector>
  );
}
