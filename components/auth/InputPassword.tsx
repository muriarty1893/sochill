import { View, TextInput, TextInputProps, StyleProp, ViewStyle, Pressable } from 'react-native';
import { useState } from 'react';
import { useGetMode } from '@/hooks/use-mode';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function InputPassword({ props, style }: { props: TextInputProps; style?: StyleProp<ViewStyle> }) {
  const isDark = useGetMode();
  const [visible, setVisible] = useState(false);
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
        placeholder="Password"
        placeholderTextColor={placeholderColor}
        secureTextEntry={!visible}
        style={{ flex: 1, height: '100%', fontSize: 16, color, fontFamily: 'jakara', includeFontPadding: false }}
        {...props}
      />
      <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
        <MaterialIcons name={visible ? 'visibility' : 'visibility-off'} size={20} color={placeholderColor} />
      </Pressable>
    </View>
  );
}
