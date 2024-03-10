import { ActivityIndicator, FlatList, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRecentTrackList } from "../lib/use-recent-tracklist";
import { SafeAreaView } from "react-native-safe-area-context";
import { P } from "../components/typography/P";
import { Subtle } from "../components/typography/Subtle";

export default function Tracklist() {
  const { data, isLoading } = useRecentTrackList();

  if (isLoading) {
    return (
      <View className={"h-full items-center justify-center gap-y-4"}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <View className="mb-4 flex-row items-center justify-center">
              <View className="flex-1 self-center">
                <P className="text-lg">{item.tracktitle}</P>
                <Subtle className="text-base">{item.trackartist}</Subtle>
              </View>
            </View>
          );
        }}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
