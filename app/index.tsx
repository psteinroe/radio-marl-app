import { ActivityIndicator, TouchableOpacity, View, Text } from "react-native";
import { useSetupPlayer } from "../lib/use-setup-player";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackPlayer, {
    useIsPlaying,
    usePlaybackState,
} from "react-native-track-player";

export default function Home() {
    const isPlayerReady = useSetupPlayer();
    const { playing, bufferingDuringPlay } = useIsPlaying();

    const playerState = usePlaybackState();

    console.log(JSON.stringify(playerState.state));

    if (!isPlayerReady) {
        return (
            <SafeAreaView>
                <ActivityIndicator />
            </SafeAreaView>
        );
    }

    return (
        <View className="flex flex-row items-center w-full h-full justify-center">
            <View className="bg-gray-500">
                <TouchableOpacity
                    onPress={playing ? TrackPlayer.pause : TrackPlayer.play}
                >
                    <Text>{playing ? "pause" : "play"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={TrackPlayer.reset}>
                    <Text>{"reset"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
