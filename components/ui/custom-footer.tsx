import { getDefaultHeaderHeight } from "@react-navigation/elements";
import * as React from "react";
import { View, Platform } from "react-native";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export function CustomFooter({ children }: React.PropsWithChildren) {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();

  // On models with Dynamic Island the status bar height is smaller than the safe area top inset.
  const hasDynamicIsland = Platform.OS === "ios" && insets.top > 50;
  const statusBarHeight = hasDynamicIsland ? insets.top - 5 : insets.top;

  const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight);

  return (
    <View
      pointerEvents="box-none"
      style={{
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          backgroundColor: "#EEF2F2",
          marginBottom: insets.bottom,
        }}
      >
        <View
          pointerEvents="box-none"
          className="flex flex-row items-center justify-center bg-white rounded-t-3xl w-full"
          style={{
            height: defaultHeight * 1.2,
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}
