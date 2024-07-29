import type { FC } from "react";
import { Text, type TextProps } from "react-native";

export const P: FC<TextProps> = ({ children, className, ...props }) => (
	<Text className="leading-7 [&:not(:first-child)]:mt-6" {...props}>
		{children}
	</Text>
);
