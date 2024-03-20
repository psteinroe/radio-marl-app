import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRecentTrackList } from "../lib/use-recent-tracklist";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { useState } from "react";
import { Playing } from "../components/icons/playing";

export default function Tracklist() {
  const { push } = useRouter();

  const { data, isLoading } = useRecentTrackList();

  const [activeButton, setActiveButton] = useState<"x" | false>(false);

  if (isLoading) {
    return (
      <View className={"h-full items-center justify-center gap-y-4"}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          contentStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerTitle: "",
          headerRight: () => (
            <Pressable
              onPress={() => push("./")}
              onPressIn={() => setActiveButton("x")}
              onPressOut={() => setActiveButton(false)}
            >
              <X
                width={32}
                height={32}
                strokeWidth={1}
                color={activeButton === "x" ? "#7731EC" : "#2E4454"}
              />
            </Pressable>
          ),
        }}
      />
      <SafeAreaView edges={["left", "right", "bottom"]}>
        <FlatList
          className="mt-2"
          data={data}
          renderItem={({ item, index }) => {
            return (
              <View className="mb-6 flex-row items-center justify-center px-10">
                <View className="flex-1 self-center">
                  <Text
                    className="text-sm"
                    style={{
                      color: "#112022",
                    }}
                  >
                    {item.started.toLocaleString()}
                  </Text>
                  <View className="flex flex-row items-center">
                    {index === 0 && (
                      <Playing
                        className="mr-1"
                        fill="#7731EC"
                        width={16}
                        height={16}
                      />
                    )}
                    <Text
                      className="text-2xl"
                      style={{
                        color: index === 0 ? "#7731EC" : "#112022",
                      }}
                    >
                      {item.tracktitle}
                    </Text>
                  </View>
                  <Text
                    className="text-base"
                    style={{
                      color: "#B3B3B3",
                    }}
                  >
                    {item.trackartist}
                  </Text>
                </View>
              </View>
            );
          }}
        />
        <StatusBar style="light" />
      </SafeAreaView>
    </>
  );
}
