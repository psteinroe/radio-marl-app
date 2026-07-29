import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Search, Star, X } from "lucide-react-native";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	useRecentRequests,
	useSongRequestMutation,
	useSongSearch,
} from "../lib/use-song-request";

export default function SongWish() {
	const { back } = useRouter();

	const [searchQuery, setSearchQuery] = useState("");
	const [activeButton, setActiveButton] = useState<string | false>(false);
	const [requestedSongs, setRequestedSongs] = useState<Set<number>>(new Set());
	const [loadingSongId, setLoadingSongId] = useState<number | null>(null);

	const {
		data: recentRequests,
		isError: recentError,
		isLoading: recentLoading,
		refetch: refetchRecent,
	} = useRecentRequests();
	const {
		data: searchResults,
		isError: searchError,
		isLoading: searchLoading,
		refetch: refetchSearch,
	} = useSongSearch(searchQuery);
	const requestMutation = useSongRequestMutation();

	const isSearching = searchQuery.trim().length > 0;
	const isLoading = isSearching ? searchLoading : recentLoading;
	const isError = isSearching ? searchError : recentError;

	const handleRequest = async (songId: number) => {
		if (requestedSongs.has(songId)) return;

		setLoadingSongId(songId);
		try {
			await requestMutation.mutateAsync(songId);
			setRequestedSongs((prev) => new Set(prev).add(songId));
		} catch {
			Alert.alert(
				"Songwunsch fehlgeschlagen",
				"Der Wunsch konnte nicht gesendet werden. Bitte versuche es erneut.",
			);
		} finally {
			setLoadingSongId(null);
		}
	};

	const clearSearch = () => {
		setSearchQuery("");
	};

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
							testID="close_song_wish"
							onPress={back}
							onPressIn={() => setActiveButton("x")}
							onPressOut={() => setActiveButton(false)}
							accessibilityLabel="Songwünsche schließen"
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
				testID="song_wish_screen"
				edges={["left", "right", "bottom"]}
				style={{ flex: 1 }}
			>
				{/* Search Input */}
				<View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							borderRadius: 8,
							paddingHorizontal: 12,
							backgroundColor: "#EEF2F2",
						}}
					>
						<Search width={20} height={20} color="#6F6F6F" />
						<TextInput
							testID="song_search_input"
							placeholder="Song suchen..."
							placeholderTextColor="#6F6F6F"
							value={searchQuery}
							onChangeText={setSearchQuery}
							autoCapitalize="none"
							autoCorrect={false}
							style={{
								flex: 1,
								paddingVertical: 12,
								paddingHorizontal: 8,
								fontSize: 16,
								color: "#112022",
							}}
						/>
						{isSearching && (
							<Pressable onPress={clearSearch}>
								<X width={20} height={20} color="#6F6F6F" />
							</Pressable>
						)}
					</View>
				</View>

				{/* Section Header */}
				<View style={{ paddingHorizontal: 24, marginBottom: 8 }}>
					<Text style={{ fontSize: 14, fontWeight: "500", color: "#6F6F6F" }}>
						{isSearching ? "Suchergebnisse" : "Letzte Wünsche"}
					</Text>
				</View>

				{/* Loading State */}
				{isLoading ? (
					<View
						style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
					>
						<ActivityIndicator size="large" color="#7731EC" />
					</View>
				) : isError ? (
					<View
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							gap: 12,
							padding: 24,
						}}
					>
						<Text style={{ textAlign: "center", color: "#6F6F6F" }}>
							Die Songwünsche konnten nicht geladen werden.
						</Text>
						<Pressable
							onPress={() =>
								void (isSearching ? refetchSearch() : refetchRecent())
							}
							accessibilityLabel="Songwünsche erneut laden"
							accessibilityRole="button"
							style={{ padding: 12 }}
						>
							<Text style={{ color: "#7731EC", fontWeight: "600" }}>
								Erneut versuchen
							</Text>
						</Pressable>
					</View>
				) : isSearching ? (
					/* Search Results */
					<FlatList
						style={{ paddingHorizontal: 24 }}
						data={searchResults || []}
						keyExtractor={(item) => item.id.toString()}
						ListEmptyComponent={
							<Text
								style={{
									textAlign: "center",
									paddingVertical: 32,
									color: "#6F6F6F",
								}}
							>
								Keine Ergebnisse gefunden
							</Text>
						}
						renderItem={({ item }) => {
							const isRequested = requestedSongs.has(item.id);
							const isLoadingThis = loadingSongId === item.id;

							return (
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										paddingVertical: 12,
										borderBottomWidth: 1,
										borderBottomColor: "#f3f4f6",
									}}
								>
									<Text
										style={{
											flex: 1,
											fontSize: 16,
											marginRight: 12,
											color: "#112022",
										}}
										numberOfLines={2}
									>
										{item.title}
									</Text>
									<Pressable
										onPress={() => handleRequest(item.id)}
										disabled={
											isRequested || isLoadingThis || requestMutation.isPending
										}
										accessibilityLabel={`Song wünschen: ${item.title}`}
										accessibilityRole="button"
										accessibilityState={{
											disabled:
												isRequested ||
												isLoadingThis ||
												requestMutation.isPending,
										}}
										style={{
											padding: 8,
											alignItems: "center",
											justifyContent: "center",
											width: 40,
											height: 40,
										}}
									>
										{isLoadingThis ? (
											<ActivityIndicator size="small" color="#7731EC" />
										) : (
											<Star
												width={24}
												height={24}
												color="#7731EC"
												fill={isRequested ? "#7731EC" : "transparent"}
											/>
										)}
									</Pressable>
								</View>
							);
						}}
					/>
				) : (
					/* Recent Requests */
					<FlatList
						style={{ paddingHorizontal: 24 }}
						data={recentRequests || []}
						keyExtractor={(item, index) => `${item.title}-${index}`}
						ListEmptyComponent={
							<Text
								style={{
									textAlign: "center",
									paddingVertical: 32,
									color: "#6F6F6F",
								}}
							>
								Noch keine Wünsche
							</Text>
						}
						renderItem={({ item, index }) => (
							<View
								style={{
									paddingVertical: 12,
									borderBottomWidth: 1,
									borderBottomColor: "#f3f4f6",
								}}
							>
								<Text
									style={{
										fontSize: 18,
										color: index === 0 ? "#7731EC" : "#112022",
									}}
								>
									{item.title}
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
