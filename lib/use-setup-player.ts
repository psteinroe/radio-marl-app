import TrackPlayer, {
	PlayerCommand,
	type PlayerConfig,
	RepeatMode,
} from "@rntp/player";
import { useEffect, useState } from "react";
import { radioPlayer } from "./radio-player";
import { RADIO_PLAYER_CONFIG } from "./radio-player-config";

let initialized = false;
let initialization: Promise<void> | undefined;

function initializePlayer() {
	initialization ??= Promise.resolve().then(async () => {
		TrackPlayer.setupPlayer(RADIO_PLAYER_CONFIG satisfies PlayerConfig);
		await radioPlayer.prepare();

		// Configure controls only after Android's asynchronous MediaController is
		// available; commands sent before then are silently discarded by RNTP.
		TrackPlayer.setCommands({
			capabilities: [PlayerCommand.PlayPause],
			handling: "native",
		});
		TrackPlayer.setRepeatMode(RepeatMode.Off);
		initialized = true;
	});

	return initialization;
}

export function useSetupPlayer() {
	const [playerReady, setPlayerReady] = useState(initialized);
	const [setupError, setSetupError] = useState<Error | null>(null);

	useEffect(() => {
		let mounted = true;
		void initializePlayer().then(
			() => {
				if (mounted) setPlayerReady(true);
			},
			(error) => {
				if (!mounted) return;
				setSetupError(
					error instanceof Error
						? error
						: new Error("Audio player setup failed"),
				);
			},
		);
		return () => {
			mounted = false;
		};
	}, []);

	if (setupError) throw setupError;

	return playerReady;
}
