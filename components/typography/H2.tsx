import { FC } from 'react';
import { Text, TextProps } from 'react-native';

export const H2: FC<TextProps> = ({ children, className, ...props }) => (
  <Text
    className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700"
    {...props}
  >
    {children}
  </Text>
);
