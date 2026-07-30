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
	const { data, isError, isLoading, isRefetching, refetch } =
		useRecentTrackList();
	const [activeButton, setActiveButton] = useState<"x" | false>(false);

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
							testID="close_tracklist"
							onPress={back}
							onPressIn={() => setActiveButton("x")}
							onPressOut={() => setActiveButton(false)}
							accessibilityLabel="Wiedergabeliste schließen"
							accessibilityRole="button"
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
			<SafeAreaView
				testID="tracklist_screen"
				edges={["left", "right", "bottom"]}
				style={{ flex: 1 }}
			>
				{isLoading ? (
					<View
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							gap: 16,
						}}
					>
						<ActivityIndicator size="large" color="#7731EC" />
						<Text testID="tracklist_loading" style={{ color: "#6F6F6F" }}>
							Wiedergabeliste wird geladen …
						</Text>
					</View>
				) : isError ? (
					<View
						testID="tracklist_error"
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							gap: 16,
							padding: 24,
						}}
					>
						<Text style={{ textAlign: "center", color: "#6F6F6F" }}>
							Die Wiedergabeliste konnte nicht geladen werden.
						</Text>
						<Pressable
							testID="retry_tracklist"
							onPress={() => void refetch()}
							accessibilityLabel="Wiedergabeliste erneut laden"
							accessibilityRole="button"
							style={{ padding: 12 }}
						>
							<Text style={{ color: "#7731EC", fontWeight: "600" }}>
								Erneut versuchen
							</Text>
						</Pressable>
					</View>
				) : (
					<FlatList
						testID="tracklist"
						style={{ marginTop: 8 }}
						data={data || []}
						refreshing={isRefetching}
						onRefresh={() => void refetch()}
						ListEmptyComponent={
							<Text
								testID="tracklist_empty"
								style={{
									textAlign: "center",
									paddingVertical: 32,
									color: "#6F6F6F",
								}}
							>
								Noch keine Titel
							</Text>
						}
						renderItem={({ item, index }) => (
							<View
								testID={index === 0 ? "current_track" : `track_${index}`}
								style={{ marginBottom: 20, paddingHorizontal: 24 }}
							>
								<Text
									style={{
										fontSize: 12,
										color: "#6F6F6F",
										marginBottom: 2,
									}}
								>
									{item.started.toLocaleString()}
								</Text>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									{index === 0 && (
										<Playing
											style={{ marginRight: 6 }}
											fill="#7731EC"
											width={14}
											height={14}
										/>
									)}
									<Text
										style={{
											fontSize: 20,
											fontWeight: "600",
											color: index === 0 ? "#7731EC" : "#112022",
											flex: 1,
										}}
										numberOfLines={1}
									>
										{item.tracktitle}
									</Text>
								</View>
								<Text
									style={{ fontSize: 14, color: "#6F6F6F", marginTop: 2 }}
									numberOfLines={1}
								>
									{item.trackartist}
								</Text>
							</View>
						)}
					/>
				)}
				<StatusBar style="light" />
			</SafeAreaView>
		</>
	);
}
