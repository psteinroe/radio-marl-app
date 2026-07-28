import type * as React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CustomHeader({ children }: React.PropsWithChildren) {
	const insets = useSafeAreaInsets();

	return (
		<View pointerEvents="box-none">
			{/* White status bar area */}
			<View
				style={{
					height: insets.top,
					backgroundColor: "white",
				}}
			/>
			{/* Gray background for rounded corners to show */}
			<View
				pointerEvents="box-none"
				style={{
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
		</View>
	);
}
