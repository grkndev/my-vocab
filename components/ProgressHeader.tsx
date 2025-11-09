import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  learned: number;
  total: number;
};

export default function ProgressHeader({ learned, total }: Props) {
  const progress = total > 0 ? learned / total : 0;

  return (
    <View style={styles.header}>
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>{learned.toString().padStart(2, "0")}</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{total.toString().padStart(2, "0")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  progressRow: {
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
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 4,
  },
});
