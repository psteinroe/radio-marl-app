import TrackPlayer, {
	PlayerCommand,
	type PlayerConfig,
	RepeatMode,
} from "@rntp/player";
import { useEffect, useState } from "react";
import { RADIO_TRACK } from "./radio-player";
import { RADIO_PLAYER_CONFIG } from "./radio-player-config";

let initialized = false;

function initializePlayer() {
	if (initialized) return;

	TrackPlayer.setupPlayer(RADIO_PLAYER_CONFIG satisfies PlayerConfig);
	initialized = true;

	// Native handling keeps controls responsive when JS is suspended and applies
	// liveResumeBehavior to lock-screen, notification, Auto, and CarPlay actions.
	TrackPlayer.setCommands({
		capabilities: [PlayerCommand.PlayPause],
		handling: "native",
	});
	TrackPlayer.setRepeatMode(RepeatMode.Off);
	TrackPlayer.setMediaItem(RADIO_TRACK);
}

export function useSetupPlayer() {
	const [playerReady, setPlayerReady] = useState(initialized);
	const [setupError, setSetupError] = useState<Error | null>(null);

	useEffect(() => {
		try {
			initializePlayer();
			setPlayerReady(true);
		} catch (error) {
			setSetupError(
				error instanceof Error ? error : new Error("Audio player setup failed"),
			);
		}
	}, []);

	if (setupError) throw setupError;

	return playerReady;
}
