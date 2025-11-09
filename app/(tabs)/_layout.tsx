import { useColorScheme } from "@/hooks/use-color-scheme";
import { Slot } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <Slot />
  );
}
