import { FC } from 'react';
import { Text, TextProps } from 'react-native';

export const P: FC<TextProps> = ({ children, className, ...props }) => (
  <Text className="leading-7 [&:not(:first-child)]:mt-6" {...props}>
    {children}
  </Text>
);
