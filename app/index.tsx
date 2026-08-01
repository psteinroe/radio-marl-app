import TrackPlayer, {
	Event,
	PlaybackState,
	useIsPlaying,
	usePlaybackState,
} from "@rntp/player";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { Globe, ListMusic, Mail, Pause, Play, Star } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	Pressable,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Facebook } from "../components/icons/facebook";
import { RadioMarlHeader } from "../components/icons/radio-marl-header";
import { WhatsApp } from "../components/icons/whatsapp";
import { CustomFooter } from "../components/ui/custom-footer";
import { CustomHeader } from "../components/ui/custom-header";
import { radioApi } from "../lib/radio-api";
import { radioPlayer } from "../lib/radio-player";
import { useNowPlayingInfo } from "../lib/use-now-playing-info";

const { width, height } = Dimensions.get("window");

const HEADER_LOGO_RATIO = 802 / 87;

// Responsive sizing based on screen height
const isSmallScreen = height < 700;
const COVER_SIZE = Math.min(width * 0.75, height * 0.4);
const PLAY_BUTTON_SIZE = isSmallScreen ? 60 : 72;
const PLAY_ICON_SIZE = isSmallScreen ? 28 : 34;
const SPACING = isSmallScreen ? 10 : 16;
const ICON_SIZE = isSmallScreen ? 24 : 28;
const PLAYBACK_START_TIMEOUT_MS = 15_000;
const E2E_PLAYBACK_START_DELAY_MS = 8_000;

const openExternalLink = (url: string) => {
	if (radioApi.isE2E) {
		Alert.alert("Externer Link", url);
		return;
	}

	void Linking.openURL(url).catch(() => {
		Alert.alert(
			"Link konnte nicht geöffnet werden",
			"Bitte versuche es später erneut.",
		);
	});
};

export default function Home() {
	const playing = useIsPlaying();
	const playerState = usePlaybackState();
	const playbackRequested = useRef(playing);
	const playbackRequestId = useRef(0);
	const e2eStartDelayUsed = useRef(false);
	const [playbackStarting, setPlaybackStarting] = useState(false);
	const [activeButton, setActiveButton] = useState<
		| "whatsapp"
		| "facebook"
		| "mail"
		| "globe"
		| "tracklist"
		| "songwish"
		| "playpause"
		| boolean
	>(false);
	const { push } = useRouter();
	const { data } = useNowPlayingInfo();
	const encodedTrackTitle = encodeURIComponent(
		data?.currenttrack_title || "fallback",
	);

	useEffect(() => {
		if (playing) {
			playbackRequested.current = true;
			setPlaybackStarting(false);
		} else if (!playbackStarting && playerState !== PlaybackState.Buffering) {
			playbackRequested.current = false;
		}
	}, [playerState, playbackStarting, playing]);

	useEffect(() => {
		if (!playbackStarting) return;

		const timeout = setTimeout(() => {
			playbackRequested.current = false;
			setPlaybackStarting(false);
			void radioPlayer.pause().catch((error) => {
				console.error("Audio playback timeout cleanup failed", error);
			});
			Alert.alert(
				"Wiedergabe nicht möglich",
				"Der Stream konnte nicht gestartet werden. Bitte versuche es erneut.",
			);
		}, PLAYBACK_START_TIMEOUT_MS);

		return () => clearTimeout(timeout);
	}, [playbackStarting]);

	useEffect(() => {
		const subscription = TrackPlayer.addEventListener(
			Event.PlaybackError,
			(error) => {
				playbackRequested.current = false;
				setPlaybackStarting(false);
				console.error("Audio playback failed", error);
				Alert.alert(
					"Wiedergabe fehlgeschlagen",
					"Bitte prüfe deine Verbindung und versuche es erneut.",
				);
			},
		);
		return () => subscription.remove();
	}, []);

	const handlePlayPress = () => {
		const requestId = ++playbackRequestId.current;
		const shouldPause = playbackRequested.current;
		playbackRequested.current = !shouldPause;
		setPlaybackStarting(!shouldPause);

		const startPlayback = () => {
			if (!radioApi.isE2E || e2eStartDelayUsed.current) {
				return radioPlayer.play();
			}

			// Make the first E2E start cancellable and observable. Retries use the
			// production path so the real-stream lifecycle test stays representative.
			e2eStartDelayUsed.current = true;
			return new Promise<void>((resolve) =>
				setTimeout(resolve, E2E_PLAYBACK_START_DELAY_MS),
			).then(() => {
				if (playbackRequestId.current === requestId) return radioPlayer.play();
			});
		};

		const command = shouldPause ? radioPlayer.pause() : startPlayback();

		void command.catch((error) => {
			playbackRequested.current = false;
			setPlaybackStarting(false);
			console.error("Audio playback command failed", error);
			Alert.alert("Wiedergabe fehlgeschlagen", "Bitte versuche es erneut.");
		});
	};

	const playbackBusy =
		playbackStarting || playerState === PlaybackState.Buffering;

	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					header: () => (
						<CustomHeader>
							<RadioMarlHeader
								width={width * 0.5}
								height={(width * 0.5) / HEADER_LOGO_RATIO}
							/>
						</CustomHeader>
					),
				}}
			/>
			<SafeAreaView
				testID="home_screen"
				edges={["left", "right"]}
				style={{
					flex: 1,
					flexDirection: "column",
					justifyContent: "space-between",
					backgroundColor: "#EEF2F2",
				}}
			>
				<View
					style={{
						flex: 1,
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "space-evenly",
						paddingVertical: SPACING,
					}}
				>
					<View
						style={{
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 4 },
							shadowOpacity: 0.15,
							shadowRadius: 12,
							elevation: 8,
							borderRadius: 16,
						}}
					>
						<Image
							testID="now_playing_artwork"
							cachePolicy="memory-disk"
							source={
								radioApi.isE2E
									? require("../assets/images/icon.png")
									: {
											uri: `https://c32.radioboss.fm/w/artwork/152.jpg?title=${encodedTrackTitle}`,
										}
							}
							alt="cover art"
							style={{
								width: COVER_SIZE,
								height: COVER_SIZE,
								borderRadius: 16,
							}}
						/>
					</View>
					<View
						style={{
							paddingHorizontal: 24,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text
							testID="now_playing_title"
							style={{
								fontSize: isSmallScreen ? 20 : 24,
								fontWeight: "700",
								textAlign: "center",
								color: "#112022",
								lineHeight: isSmallScreen ? 26 : 32,
							}}
							numberOfLines={2}
							adjustsFontSizeToFit
							minimumFontScale={0.8}
						>
							{data?.currenttrack_title || "Radio Marl"}
						</Text>
						<Text
							testID="now_playing_artist"
							style={{
								fontSize: isSmallScreen ? 14 : 16,
								textAlign: "center",
								marginTop: 4,
								color: "#6F6F6F",
							}}
							numberOfLines={1}
						>
							{data?.currenttrack_artist || " "}
						</Text>
					</View>
					<Pressable
						testID="playback_toggle"
						onPress={handlePlayPress}
						onPressIn={() => setActiveButton("playpause")}
						accessibilityLabel={
							playbackStarting
								? "Wiedergabestart abbrechen"
								: playing
									? "Wiedergabe stoppen"
									: "Radio abspielen"
						}
						accessibilityRole="button"
						accessibilityState={{
							busy: playbackBusy,
							selected: playing,
						}}
						onPressOut={() => setActiveButton(false)}
						style={{
							borderRadius: 9999,
							height: PLAY_BUTTON_SIZE,
							width: PLAY_BUTTON_SIZE,
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							backgroundColor:
								activeButton === "playpause" ? "#7731EC" : "#112022",
						}}
					>
						{playbackBusy ? (
							<ActivityIndicator
								testID="playback_buffering"
								color="white"
								size={isSmallScreen ? "small" : "large"}
							/>
						) : playing ? (
							<Pause fill="white" color="white" size={PLAY_ICON_SIZE} />
						) : (
							<Play
								fill="white"
								color="white"
								size={PLAY_ICON_SIZE}
								style={{ marginLeft: 4 }}
							/>
						)}
					</Pressable>
				</View>
				<CustomFooter>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							width: "100%",
							paddingHorizontal: 24,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: isSmallScreen ? 16 : 20,
							}}
						>
							<Pressable
								testID="open_whatsapp"
								onPress={() =>
									openExternalLink(
										"https://chat.whatsapp.com/DpRbHu7DLEvG9zbkeZXknN",
									)
								}
								onPressIn={() => setActiveButton("whatsapp")}
								onPressOut={() => setActiveButton(false)}
								accessibilityLabel="WhatsApp-Gruppe öffnen"
								accessibilityRole="link"
							>
								<WhatsApp
									viewBox="0 0 24 24"
									width={ICON_SIZE}
									height={ICON_SIZE}
									strokeWidth={0.5}
									fill={activeButton === "whatsapp" ? "#7731EC" : "#2E4454"}
								/>
							</Pressable>
							<Pressable
								testID="open_facebook"
								onPress={() =>
									openExternalLink("https://www.facebook.com/marlradio")
								}
								onPressIn={() => setActiveButton("facebook")}
								onPressOut={() => setActiveButton(false)}
								accessibilityLabel="Facebook öffnen"
								accessibilityRole="link"
							>
								<Facebook
									viewBox="0 0 24 24"
									width={ICON_SIZE}
									height={ICON_SIZE}
									strokeWidth={0.5}
									fill={activeButton === "facebook" ? "#7731EC" : "#2E4454"}
								/>
							</Pressable>
							<Pressable
								testID="open_email"
								onPress={() =>
									openExternalLink("mailto:thomas.wilke@radio-marl.de")
								}
								onPressIn={() => setActiveButton("mail")}
								onPressOut={() => setActiveButton(false)}
								accessibilityLabel="E-Mail schreiben"
								accessibilityRole="link"
							>
								<Mail
									width={ICON_SIZE}
									height={ICON_SIZE}
									color={activeButton === "mail" ? "#7731EC" : "#2E4454"}
								/>
							</Pressable>
							<Pressable
								testID="open_website"
								onPress={() => openExternalLink("https://marl-radio.de")}
								onPressIn={() => setActiveButton("globe")}
								onPressOut={() => setActiveButton(false)}
								accessibilityLabel="Radio-Marl-Webseite öffnen"
								accessibilityRole="link"
							>
								<Globe
									width={ICON_SIZE}
									height={ICON_SIZE}
									color={activeButton === "globe" ? "#7731EC" : "#2E4454"}
								/>
							</Pressable>
						</View>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
						>
							<Pressable
								testID="open_song_wish"
								onPress={() => push("./songwish")}
								onPressIn={() => setActiveButton("songwish")}
								onPressOut={() => setActiveButton(false)}
								accessibilityLabel="Songwunsch"
								accessibilityRole="button"
								style={{
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: 9999,
									padding: isSmallScreen ? 10 : undefined,
									paddingVertical: isSmallScreen ? undefined : 10,
									backgroundColor:
										activeButton === "songwish" ? "#7731EC" : "#F5F5F5",
									width: isSmallScreen ? undefined : 80,
								}}
							>
								<Star
									width={isSmallScreen ? 20 : 22}
									height={isSmallScreen ? 20 : 22}
									color={activeButton === "songwish" ? "white" : "#2E4454"}
								/>
								{!isSmallScreen && (
									<Text
										style={{
											fontSize: 11,
											marginTop: 2,
											color: activeButton === "songwish" ? "white" : "#2E4454",
										}}
									>
										Wunsch
									</Text>
								)}
							</Pressable>
							<Pressable
								testID="open_tracklist"
								onPress={() => push("./tracklist")}
								onPressIn={() => setActiveButton("tracklist")}
								onPressOut={() => setActiveButton(false)}
								accessibilityLabel="Wiedergabeliste"
								accessibilityRole="button"
								style={{
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: 9999,
									padding: isSmallScreen ? 10 : undefined,
									paddingVertical: isSmallScreen ? undefined : 10,
									backgroundColor:
										activeButton === "tracklist" ? "#7731EC" : "#F5F5F5",
									width: isSmallScreen ? undefined : 80,
								}}
							>
								<ListMusic
									width={isSmallScreen ? 20 : 22}
									height={isSmallScreen ? 20 : 22}
									color={activeButton === "tracklist" ? "white" : "#2E4454"}
								/>
								{!isSmallScreen && (
									<Text
										style={{
											fontSize: 11,
											marginTop: 2,
											color: activeButton === "tracklist" ? "white" : "#2E4454",
										}}
									>
										Wiedergabe
									</Text>
								)}
							</Pressable>
						</View>
					</View>
				</CustomFooter>
			</SafeAreaView>
		</>
	);
}
