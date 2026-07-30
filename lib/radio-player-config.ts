export const RADIO_PLAYER_CONFIG = {
	contentType: "music",
	handleAudioBecomingNoisy: true,
	autoUpdateMetadataFromStream: true,
	audioMixing: "exclusive",
	// RNTP 5.7 moves every native Play action (including lock screen, Android
	// Auto, and CarPlay) to the current live edge instead of replaying old audio.
	liveResumeBehavior: "live-edge",
	android: {
		wakeMode: "network",
		taskRemovedBehavior: "stop",
	},
} as const;
