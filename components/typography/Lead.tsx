import type { FC } from "react";
import { Text, type TextProps } from "react-native";

export const Lead: FC<TextProps> = ({ children, ...props }) => (
	<Text className="text-xl text-slate-700" {...props}>
		{children}
	</Text>
);
