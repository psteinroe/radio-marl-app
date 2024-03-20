import { FC } from "react";
import { Text, TextProps } from "react-native";

export const Large: FC<TextProps> = ({ children, className, ...props }) => (
  <Text className="text-lg font-semibold text-slate-900" {...props}>
    {children}
  </Text>
);
