import type { FC } from "react";
import { Text, type TextProps } from "react-native";

export const Small: FC<TextProps> = ({ children, className, ...props }) => (
	<Text className="text-sm font-medium" {...props}>
		{children}
	</Text>
);
