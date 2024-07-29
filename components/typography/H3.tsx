import type { FC } from "react";
import { Text, type TextProps } from "react-native";

export const H3: FC<TextProps> = ({ children, className, ...props }) => (
	<Text
		className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight"
		{...props}
	>
		{children}
	</Text>
);
