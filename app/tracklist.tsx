import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Playing } from "../components/icons/playing";
import { useRecentTrackList } from "../lib/use-recent-tracklist";

export default function Tracklist() {
	const { back } = useRouter();

	const { data, isLoading } = useRecentTrackList();

	const [activeButton, setActiveButton] = useState<"x" | false>(false);

	if (isLoading) {
		return (
			<View
				style={{
					height: "100%",
					alignItems: "center",
					justifyContent: "center",
					gap: 16,
				}}
			>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					contentStyle: { backgroundColor: "white" },
					headerShadowVisible: false,
					headerTitle: "",
					headerRight: () => (
						<Pressable
							onPress={back}
							onPressIn={() => setActiveButton("x")}
							onPressOut={() => setActiveButton(false)}
						>
							<X
								width={32}
								height={32}
								strokeWidth={1}
								color={activeButton === "x" ? "#7731EC" : "#2E4454"}
							/>
						</Pressable>
					),
				}}
			/>
			<SafeAreaView edges={["left", "right", "bottom"]}>
				<FlatList
					style={{ marginTop: 8 }}
					data={data}
					renderItem={({ item, index }) => {
						return (
							<View
								style={{
									marginBottom: 24,
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									paddingHorizontal: 40,
								}}
							>
								{index === 0 && (
									<Playing
										style={{ marginRight: 4 }}
										fill="#7731EC"
										width={16}
										height={16}
									/>
								)}
								<View style={{ flex: 1, alignSelf: "center" }}>
									<Text
										style={{
											fontSize: 14,
											color: "#112022",
										}}
									>
										{item.started.toLocaleString()}
									</Text>
									<View style={{ flexDirection: "row", alignItems: "center" }}>
										<Text
											style={{
												fontSize: 24,
												color: index === 0 ? "#7731EC" : "#112022",
											}}
										>
											{item.tracktitle}
										</Text>
									</View>
									<Text
										style={{
											fontSize: 16,
											color: "#6F6F6F",
										}}
									>
										{item.trackartist}
									</Text>
								</View>
							</View>
						);
					}}
				/>
				<StatusBar style="light" />
			</SafeAreaView>
		</>
	);
}
