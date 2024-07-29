import type { FC } from "react";
import { Text, type TextProps } from "react-native";

export const H1: FC<TextProps> = ({ children, className, ...props }) => (
	<Text
		className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
		{...props}
	>
		{children}
	</Text>
);
