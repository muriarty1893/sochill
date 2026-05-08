import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Menu, Divider } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import Entypo from '@expo/vector-icons/Entypo';
import { useGetMode } from '@/hooks/use-mode';
import { VerifiedIcon, TrashIcon, CloseCircleIcon } from '../icons';

interface Props {
  name?: string;
  userTag?: string;
  dateAgo?: string;
  verified?: boolean;
  id?: string;
  myPost?: boolean;
  deletePost?: () => void;
}

export default function NameAndTag({ name, userTag, dateAgo, verified, id, myPost, deletePost }: Props) {
  const isDark = useGetMode();
  const color = isDark ? 'white' : 'black';
  const style = isDark ? 'dark' : 'light';
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', gap: 2, alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
        <Text style={{ fontFamily: 'jakaraBold', includeFontPadding: false, fontSize: 14, color }}>
          {name}
        </Text>
        {verified && <VerifiedIcon color="green" size={16} />}
        <Text style={{ fontFamily: 'jakara', includeFontPadding: false, color: '#7a868f', fontSize: 14, marginBottom: 2 }}>
          @{userTag}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <View style={{ backgroundColor: '#7a868f', height: 4, width: 4, borderRadius: 9999 }} />
          <Text style={{ color: '#7a868f' }}>{dateAgo}</Text>
        </View>
      </View>

      {myPost && (
        <Menu
          contentStyle={{
            backgroundColor: 'transparent',
            elevation: 0,
            shadowColor: 'transparent',
            borderWidth: 1,
            borderColor: '#B4B4B488',
            borderRadius: 10,
            overflow: 'hidden',
          }}
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Pressable onPress={() => setVisible(true)}>
              <Entypo name="dots-three-horizontal" size={20} color={color} />
            </Pressable>
          }
        >
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            tint={style}
            style={{ height: '130%', width: '300%', position: 'absolute' }}
          />
          <Menu.Item
            titleStyle={{ fontFamily: 'jakara', color }}
            onPress={() => {
              deletePost?.();
              setVisible(false);
            }}
            trailingIcon={() => <TrashIcon size={20} color="red" />}
            title="Delete"
          />
          <Divider />
          <Menu.Item
            titleStyle={{ fontFamily: 'jakara', color }}
            trailingIcon={() => <CloseCircleIcon size={20} color="red" />}
            onPress={() => setVisible(false)}
            title="Cancel"
          />
        </Menu>
      )}
    </View>
  );
}
