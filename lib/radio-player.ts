import TrackPlayer, { type MediaItem } from "@rntp/player";
import { createLivePlayerController } from "./live-player-controller";

export const RADIO_TRACK: MediaItem = {
	mediaId: "radio-marl-live",
	url: {
		uri: "https://c32.radioboss.fm:18152/stream",
		headers: { "Icy-MetaData": "0" },
	},
	title: "Radio Marl",
	artist: "Live",
	artworkUrl: require("../assets/images/icon.png"),
	isLive: true,
	mimeType: "audio/mpeg",
};

export const radioPlayer = createLivePlayerController(TrackPlayer, RADIO_TRACK);
