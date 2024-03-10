import { FC } from 'react';
import { Text, TextProps } from 'react-native';

export const Subtle: FC<TextProps> = ({ children, className, ...props }) => (
  <Text className="text-sm text-slate-500 dark:text-slate-400" {...props}>
    {children}
  </Text>
);
