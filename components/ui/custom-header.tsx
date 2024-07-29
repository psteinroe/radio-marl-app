import { getDefaultHeaderHeight } from "@react-navigation/elements";
import type * as React from "react";
import { Platform, View } from "react-native";
import {
	useSafeAreaFrame,
	useSafeAreaInsets,
} from "react-native-safe-area-context";

export function CustomHeader({ children }: React.PropsWithChildren) {
	const insets = useSafeAreaInsets();
	const frame = useSafeAreaFrame();

	// On models with Dynamic Island the status bar height is smaller than the safe area top inset.
	const hasDynamicIsland = Platform.OS === "ios" && insets.top > 50;
	const statusBarHeight = hasDynamicIsland ? insets.top - 5 : insets.top;

	const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight);

	return (
		<View
			pointerEvents="box-none"
			style={{
				marginTop: insets.top,
				backgroundColor: "#EEF2F2",
			}}
		>
			<View
				pointerEvents="box-none"
				className="flex flex-row items-end justify-center bg-white rounded-b-3xl w-full pb-6"
				style={{
					height: defaultHeight * 0.75,
				}}
			>
				{children}
			</View>
		</View>
	);
}
