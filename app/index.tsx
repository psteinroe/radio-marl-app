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
						paddingTop: 40,
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
							width: height * 0.38,
							height: height * 0.38,
						}}
					/>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							height: 36 * 2,
							marginTop: height * 0.02,
							maxWidth: width * 0.85,
						}}
					>
						<Text
							style={{
								fontSize: 30,
								fontWeight: "600",
								textAlign: "center",
								width: "100%",
								color: "#112022",
							}}
							numberOfLines={1}
						>
							{data?.currenttrack_title || "Radio Marl"}
						</Text>
					</View>
					<Text
						style={{
							fontSize: 18,
							textAlign: "center",
							marginTop: height * 0.001,
							maxWidth: width * 0.85,
							color: "#6F6F6F",
						}}
					>
						{data?.currenttrack_artist || " "}
					</Text>
					<Pressable
						onPress={handlePlayPress}
						onPressIn={() => setActiveButton("playpause")}
						onPressOut={() => setActiveButton(false)}
						style={{
							borderRadius: 9999,
							height: 80,
							width: 80,
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							backgroundColor:
								activeButton === "playpause" ? "#7731EC" : "#112022",
							marginTop: height * 0.025,
						}}
					>
						{playerState.state === "buffering" ? (
							<ActivityIndicator size="large" />
						) : playing ? (
							<Pause fill="white" color="white" size={38} />
						) : (
							<Play
								fill="white"
								color="white"
								size={38}
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
									paddingVertical: 12,
									backgroundColor:
										activeButton === "songwish" ? "#7731EC" : "#F5F5F5",
									width: 86,
								}}
							>
								<Star
									width={24}
									height={24}
									color={activeButton === "songwish" ? "white" : "#2E4454"}
								/>
								<Text
									style={{
										fontSize: 12,
										color: activeButton === "songwish" ? "white" : "#2E4454",
									}}
								>
									Wunsch
								</Text>
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
									paddingVertical: 12,
									backgroundColor:
										activeButton === "tracklist" ? "#7731EC" : "#F5F5F5",
									width: 86,
								}}
							>
								<ListMusic
									width={24}
									height={24}
									color={activeButton === "tracklist" ? "white" : "#2E4454"}
								/>
								<Text
									style={{
										fontSize: 12,
										color: activeButton === "tracklist" ? "white" : "#2E4454",
									}}
								>
									Wiedergabe
								</Text>
							</Pressable>
						</View>
					</View>
				</CustomFooter>
			</SafeAreaView>
		</>
	);
}
