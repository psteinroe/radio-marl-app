import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { Globe, ListMusic, Mail, Pause, Play, Star } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Pressable,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackPlayer, {
	useIsPlaying,
	usePlaybackState,
} from "react-native-track-player";
import { Facebook } from "../components/icons/facebook";
import { RadioMarlHeader } from "../components/icons/radio-marl-header";
import { WhatsApp } from "../components/icons/whatsapp";
import { CustomFooter } from "../components/ui/custom-footer";
import { CustomHeader } from "../components/ui/custom-header";
import { useNowPlayingInfo } from "../lib/use-now-playing-info";
import { useRecentTrackList } from "../lib/use-recent-tracklist";
import { TRACK, useResetOnError } from "../lib/use-setup-player";

const { width, height } = Dimensions.get("window");

const HEADER_LOGO_RATIO = 802 / 87;

// Responsive sizing based on screen height
const isSmallScreen = height < 700;
const COVER_SIZE = Math.min(width * 0.7, height * 0.35);
const PLAY_BUTTON_SIZE = isSmallScreen ? 64 : 80;
const PLAY_ICON_SIZE = isSmallScreen ? 30 : 38;
const SPACING = isSmallScreen ? 12 : 20;

export default function Home() {
	const { playing } = useIsPlaying();
	const { push } = useRouter();

	const playerState = usePlaybackState();

	useRecentTrackList();

	useResetOnError();

	const { data } = useNowPlayingInfo();

	useEffect(() => {
		if (playerState.state === "error") {
			TrackPlayer.reset();
		}
	}, [playerState.state]);

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

	const handlePlayPress = async () => {
		if (playing) {
			await TrackPlayer.stop();
		} else {
			// Reset and re-add track to force fresh connection to live stream
			await TrackPlayer.reset();
			await TrackPlayer.add(TRACK);
			await TrackPlayer.play();
		}
	};

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
						flexDirection: "column",
						alignItems: "center",
						paddingTop: SPACING,
					}}
				>
					<Image
						cachePolicy="none"
						source={{
							uri: `https://c32.radioboss.fm/w/artwork/152.jpg?title=${
								data?.currenttrack_title || "fallback"
							}`,
						}}
						alt="cover art"
						style={{
							width: COVER_SIZE,
							height: COVER_SIZE,
						}}
					/>
					<View
						style={{
							marginTop: SPACING,
							paddingHorizontal: 24,
							alignItems: "center",
							height: isSmallScreen ? 70 : 90,
							justifyContent: "center",
						}}
					>
						<Text
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
						onPress={handlePlayPress}
						onPressIn={() => setActiveButton("playpause")}
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
							marginTop: SPACING,
						}}
					>
						{playerState.state === "buffering" ? (
							<ActivityIndicator size={isSmallScreen ? "small" : "large"} />
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
							style={{ flexDirection: "row", alignItems: "center", gap: 24 }}
						>
							<Pressable
								onPress={() =>
									Linking.openURL(
										"https://chat.whatsapp.com/DpRbHu7DLEvG9zbkeZXknN",
									)
								}
								onPressIn={() => setActiveButton("whatsapp")}
								onPressOut={() => setActiveButton(false)}
							>
								<WhatsApp
									viewBox="0 0 24 24"
									width={30}
									height={30}
									strokeWidth={0.5}
									fill={activeButton === "whatsapp" ? "#7731EC" : "#2E4454"}
								/>
							</Pressable>
							<Pressable
								onPress={() =>
									Linking.openURL("https://www.facebook.com/marlradio")
								}
								onPressIn={() => setActiveButton("facebook")}
								onPressOut={() => setActiveButton(false)}
							>
								<Facebook
									viewBox="0 0 24 24"
									width={30}
									height={30}
									strokeWidth={0.5}
									fill={activeButton === "facebook" ? "#7731EC" : "#2E4454"}
								/>
							</Pressable>
							<Pressable
								onPress={() =>
									Linking.openURL("mailto:thomas.wilke@radio-marl.de")
								}
								onPressIn={() => setActiveButton("mail")}
								onPressOut={() => setActiveButton(false)}
							>
								<Mail
									width={30}
									height={30}
									color={activeButton === "mail" ? "#7731EC" : "#2E4454"}
								/>
							</Pressable>
							<Pressable
								onPress={() => Linking.openURL("https://marl-radio.de")}
								onPressIn={() => setActiveButton("globe")}
								onPressOut={() => setActiveButton(false)}
							>
								<Globe
									width={30}
									height={30}
									color={activeButton === "globe" ? "#7731EC" : "#2E4454"}
								/>
							</Pressable>
						</View>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
						>
							<Pressable
								onPress={() => push("./songwish")}
								onPressIn={() => setActiveButton("songwish")}
								onPressOut={() => setActiveButton(false)}
								style={{
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: 9999,
									padding: isSmallScreen ? 12 : undefined,
									paddingVertical: isSmallScreen ? undefined : 12,
									backgroundColor:
										activeButton === "songwish" ? "#7731EC" : "#F5F5F5",
									width: isSmallScreen ? undefined : 86,
								}}
							>
								<Star
									width={24}
									height={24}
									color={activeButton === "songwish" ? "white" : "#2E4454"}
								/>
								{!isSmallScreen && (
									<Text
										style={{
											fontSize: 12,
											color: activeButton === "songwish" ? "white" : "#2E4454",
										}}
									>
										Wunsch
									</Text>
								)}
							</Pressable>
							<Pressable
								onPress={() => push("./tracklist")}
								onPressIn={() => setActiveButton("tracklist")}
								onPressOut={() => setActiveButton(false)}
								style={{
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: 9999,
									padding: isSmallScreen ? 12 : undefined,
									paddingVertical: isSmallScreen ? undefined : 12,
									backgroundColor:
										activeButton === "tracklist" ? "#7731EC" : "#F5F5F5",
									width: isSmallScreen ? undefined : 86,
								}}
							>
								<ListMusic
									width={24}
									height={24}
									color={activeButton === "tracklist" ? "white" : "#2E4454"}
								/>
								{!isSmallScreen && (
									<Text
										style={{
											fontSize: 12,
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
