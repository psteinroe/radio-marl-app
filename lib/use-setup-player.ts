import { useEffect, useState } from "react";
import TrackPlayer, {
  AddTrack,
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  usePlaybackState,
} from "react-native-track-player";

export const DefaultRepeatMode = RepeatMode.Queue;
export const DefaultAudioServiceBehaviour =
  AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification;

const TRACK: AddTrack = {
  url: "https://c32.radioboss.fm:18152/stream",
  title: "Radio Marl",
  artwork: require("../assets/images/icon.png"),
  isLive: true,
};

export function useResetOnError() {
  const playerState = usePlaybackState();

  useEffect(() => {
    const addTrack = async () => {
      const queue = await TrackPlayer.getQueue();

      if (queue.length <= 0) {
        await TrackPlayer.add([TRACK]);
      }
    };
    if (playerState.state === "error") {
      TrackPlayer.reset();
      addTrack();
    }
  }, [playerState.state]);
}

export function useSetupPlayer() {
  const [playerReady, setPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      await setupPlayer({
        autoHandleInterruptions: true,
      });

      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: DefaultAudioServiceBehaviour,
        },
        capabilities: [Capability.Play, Capability.Stop],
        compactCapabilities: [Capability.Play, Capability.Stop],
        progressUpdateEventInterval: 2,
      });
      await TrackPlayer.setRepeatMode(DefaultRepeatMode);

      if (unmounted) return;

      setPlayerReady(true);

      const queue = await TrackPlayer.getQueue();

      if (unmounted) return;

      if (queue.length <= 0) {
        await TrackPlayer.add([TRACK]);
      }
    })();
    return () => {
      unmounted = true;
    };
  }, []);
  return playerReady;
}

const setupPlayer = async (
  options: Parameters<typeof TrackPlayer.setupPlayer>[0]
) => {
  const setup = async () => {
    try {
      await TrackPlayer.setupPlayer(options);
    } catch (error) {
      return (error as Error & { code?: string }).code;
    }
  };
  while ((await setup()) === "android_cannot_setup_player_in_background") {
    // A timeout will mostly only execute when the app is in the foreground,
    // and even if we were in the background still, it will reject the promise
    // and we'll try again:
    await new Promise<void>((resolve) => setTimeout(resolve, 1));
  }
};
