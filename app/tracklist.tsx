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
			<View className={"h-full items-center justify-center gap-y-4"}>
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
					className="mt-2"
					data={data}
					renderItem={({ item, index }) => {
						return (
							<View className="mb-6 flex-row items-center justify-center px-10">
								{index === 0 && (
									<Playing
										className="mr-1"
										fill="#7731EC"
										width={16}
										height={16}
									/>
								)}
								<View className="flex-1 self-center">
									<Text
										className="text-sm"
										style={{
											color: "#112022",
										}}
									>
										{item.started.toLocaleString()}
									</Text>
									<View className="flex flex-row items-center">
										<Text
											className="text-2xl"
											style={{
												color: index === 0 ? "#7731EC" : "#112022",
											}}
										>
											{item.tracktitle}
										</Text>
									</View>
									<Text
										className="text-base"
										style={{
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
