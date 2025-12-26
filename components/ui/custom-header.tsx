import type * as React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CustomHeader({ children }: React.PropsWithChildren) {
	const insets = useSafeAreaInsets();

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
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "white",
					borderBottomLeftRadius: 24,
					borderBottomRightRadius: 24,
					width: "100%",
					height: 60,
				}}
			>
				{children}
			</View>
		</View>
	);
}
