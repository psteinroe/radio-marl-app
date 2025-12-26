import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import TrackPlayer from "react-native-track-player";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PlaybackService } from "../lib/playback";
import { useSetupPlayer } from "../lib/use-setup-player";

const queryClient = new QueryClient();

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(home)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

TrackPlayer.registerPlaybackService(() => PlaybackService);

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	const isPlayerReady = useSetupPlayer();

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded && isPlayerReady) {
			SplashScreen.hideAsync();
		}
	}, [loaded, isPlayerReady]);

	if (!loaded || !isPlayerReady) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<RootLayoutNav />
		</QueryClientProvider>
	);
}

function RootLayoutNav() {
	return (
		<SafeAreaProvider>
			<Stack>
				<Stack.Screen name="index" />
				<Stack.Screen
					options={{
						headerShown: true,
						presentation: "modal",
					}}
					name="tracklist"
				/>
				<Stack.Screen
					options={{
						headerShown: true,
						presentation: "modal",
					}}
					name="songwish"
				/>
			</Stack>
		</SafeAreaProvider>
	);
}
