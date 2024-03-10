import { ActivityIndicator, TouchableOpacity, View, Text } from "react-native";
import { Image } from "expo-image";
import { useSetupPlayer } from "../lib/use-setup-player";
import TrackPlayer, { useIsPlaying } from "react-native-track-player";
import { useNowPlayingInfo } from "../lib/use-now-playing-info";
import { WhatsApp } from "../components/icons/WhatsApp";
import { Link } from "expo-router";

export default function Home() {
  const isPlayerReady = useSetupPlayer();
  const { playing } = useIsPlaying();

  const { data } = useNowPlayingInfo();

  // logo
  // now playing
  // play/pause
  // buttons on bottom for history and contact via whatsapp

  return (
    <View className="flex flex-col items-center w-full h-full justify-center">
      <Image
        source="https://c32.radioboss.fm/w/artwork/152.jpg"
        alt="cover art"
      />
      <View className="bg-gray-500">
        <TouchableOpacity
          onPress={playing ? TrackPlayer.pause : TrackPlayer.play}
        >
          {!isPlayerReady ? (
            <ActivityIndicator />
          ) : (
            <Text>{playing ? "pause" : "play"}</Text>
          )}
        </TouchableOpacity>
      </View>
      <View>
        <Text>{data?.currenttrack_title}</Text>
        <Text>{data?.currenttrack_artist}</Text>
      </View>
      <View className="flex flex-row justify-between">
        <TouchableOpacity>
          <WhatsApp />
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href="./tracklist"></Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}
