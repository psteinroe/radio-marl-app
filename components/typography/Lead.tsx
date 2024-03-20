import { FC } from "react";
import { Text, TextProps } from "react-native";

import { cn } from "../../../lib/cn";

export const Lead: FC<TextProps> = ({ children, className, ...props }) => (
  <Text className={cn("text-xl text-slate-700", className)} {...props}>
    {children}
  </Text>
);
