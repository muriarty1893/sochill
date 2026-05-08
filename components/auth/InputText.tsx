import { View, TextInput, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { useGetMode } from '@/hooks/use-mode';

export default function InputText({ props, style }: { props: TextInputProps; style?: StyleProp<ViewStyle> }) {
  const isDark = useGetMode();
  const backgroundColor = isDark ? '#292828' : '#f1f1f1';
  const color = isDark ? 'white' : 'black';
  const placeholderColor = isDark ? '#959595' : '#393939';

  return (
    <View
      style={[
        {
          width: '100%',
          height: 50,
          paddingHorizontal: 20,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor,
        },
        style,
      ]}
    >
      <TextInput
        cursorColor={color}
        placeholder="Enter Email"
        placeholderTextColor={placeholderColor}
        style={{ flex: 1, height: '100%', fontSize: 16, color, fontFamily: 'jakara', includeFontPadding: false }}
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
}
