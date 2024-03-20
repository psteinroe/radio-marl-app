import { FC } from "react";
import { Text, TextProps } from "react-native";

export const H4: FC<TextProps> = ({ children, className, ...props }) => (
  <Text
    className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
    {...props}
  >
    {children}
  </Text>
);
