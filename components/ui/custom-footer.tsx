import type * as React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CustomFooter({ children }: React.PropsWithChildren) {
	const insets = useSafeAreaInsets();

	return (
		<View
			pointerEvents="box-none"
			style={{
				backgroundColor: "white",
			}}
		>
			<View
				style={{
					backgroundColor: "#EEF2F2",
					marginBottom: insets.bottom,
				}}
			>
				<View
					pointerEvents="box-none"
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "white",
						borderTopLeftRadius: 24,
						borderTopRightRadius: 24,
						width: "100%",
						height: 72,
						paddingTop: 8,
					}}
				>
					{children}
				</View>
			</View>
		</View>
	);
}
