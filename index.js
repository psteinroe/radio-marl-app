const TrackPlayer = require("@rntp/player").default;
const { PlaybackService } = require("./lib/playback");

// Register before Expo Router registers the React Native application so Android
// can deliver background events after the UI runtime has been suspended.
TrackPlayer.registerBackgroundEventHandler(() => PlaybackService);

require("expo-router/entry");
