import TrackPlayer, { Event } from "react-native-track-player";

export async function PlaybackService() {
	TrackPlayer.addEventListener(Event.RemotePause, () => {
		TrackPlayer.pause();
	});

	TrackPlayer.addEventListener(Event.RemotePlay, () => {
		TrackPlayer.play();
	});

	TrackPlayer.addEventListener(Event.RemoteNext, () => {
		TrackPlayer.skipToNext();
	});

	TrackPlayer.addEventListener(Event.RemotePrevious, () => {
		TrackPlayer.skipToPrevious();
	});

	TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
		TrackPlayer.seekBy(event.interval);
	});

	TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
		TrackPlayer.seekBy(-event.interval);
	});

	TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
		TrackPlayer.seekTo(event.position);
	});

	TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
		//
	});

	TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (event) => {
		//
	});

	TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
		//
	});

	TrackPlayer.addEventListener(Event.PlaybackPlayWhenReadyChanged, (event) => {
		//
	});

	TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
		//
	});

	TrackPlayer.addEventListener(Event.PlaybackMetadataReceived, (event) => {
		//
	});

	TrackPlayer.addEventListener(Event.MetadataChapterReceived, (event) => {
		//
	});

	TrackPlayer.addEventListener(Event.MetadataTimedReceived, (event) => {
		//
	});

	TrackPlayer.addEventListener(Event.MetadataCommonReceived, (event) => {
		//
	});

	TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (event) => {
		//
	});

	TrackPlayer.addEventListener(
		Event.PlaybackMetadataReceived,
		async ({ title, artist }) => {
			const activeTrack = await TrackPlayer.getActiveTrack();
			TrackPlayer.updateNowPlayingMetadata({
				artist: [title, artist].filter(Boolean).join(" - "),
				title: activeTrack?.title,
				artwork: activeTrack?.artwork,
			});
		},
	);
}
