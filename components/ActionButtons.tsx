import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  disabled?: boolean;
  onRepeat?: () => void;
  onLearn?: () => void;
};

export default function ActionButtons({ disabled, onRepeat, onLearn }: Props) {
  return (
    <View style={styles.actions}>
      <Pressable style={styles.button} onPress={onRepeat} disabled={disabled}>
        <View style={styles.buttonInner}><Text style={styles.buttonIcon}>🔄</Text></View>
      </Pressable>

      <Pressable style={styles.button} onPress={onLearn} disabled={disabled}>
        <View style={styles.buttonInner}><Text style={styles.buttonIcon}>✓</Text></View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 40,
    paddingHorizontal: 60,
  },
  button: { width: 80, height: 80 },
  buttonInner: {
    width: "100%", height: "100%", backgroundColor: "white", borderRadius: 40,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8,
  },
  buttonIcon: { fontSize: 36 },
});
