import { useWindowDimensions, View } from 'react-native';

import { Tab } from './tab';

import type { AntDesign } from '@expo/vector-icons';

type TabsProps = {
  tabs: { label: string; icon: keyof typeof AntDesign.glyphMap }[];
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
};

export const AnimatedTabs = ({ activeTabIndex, setActiveTabIndex, tabs }: TabsProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const gap = 8;
  const paddingHorizontal = 10;

  const tabsWidth = windowWidth - paddingHorizontal * 2 - gap * (tabs.length - 1);
  const maxTabWidth = 132;
  const minTabWidth = (tabsWidth - maxTabWidth) / (tabs.length - 1);

  return (
    <View
      style={{
        width: windowWidth,
        gap,
        flexDirection: 'row',
        paddingHorizontal,
      }}>
      {tabs.map((tab, index) => (
        <Tab
          onPress={() => {
            setActiveTabIndex(index);
          }}
          icon={tab.icon}
          key={tab.label}
          label={tab.label}
          maxWidth={maxTabWidth}
          minWidth={minTabWidth}
          isActive={index === activeTabIndex}
        />
      ))}
    </View>
  );
};
