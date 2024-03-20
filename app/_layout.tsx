import { useFonts } from "expo-font";
import TrackPlayer from "react-native-track-player";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

import "../assets/global.css";
import { PlaybackService } from "../lib/playback";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSetupPlayer } from "../lib/use-setup-player";
import {
  nowPlayingInfoOpts,
  useNowPlayingInfo,
} from "../lib/use-now-playing-info";

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
      </Stack>
    </SafeAreaProvider>
  );
}
