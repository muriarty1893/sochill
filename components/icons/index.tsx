import * as React from 'react';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

type IconProps = { size: number; color: string };

export const HomeIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="m20.86 8.37-6.93-5.54c-1.07-.86-2.8-.86-3.86-.01L3.14 8.37c-.78.62-1.28 1.93-1.11 2.91l1.33 7.96c.24 1.42 1.6 2.57 3.04 2.57h11.2c1.43 0 2.8-1.16 3.04-2.57l1.33-7.96c.16-.98-.34-2.29-1.11-2.91ZM12 15.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Z" />
  </Svg>
);

export const HomeIconUnfocused = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M9.02 2.84 3.63 7.04C2.73 7.74 2 9.23 2 10.36v7.41C2 19.92 3.53 21 4.96 21h14.08C20.47 21 22 19.92 22 17.77V10.5c0-1.21-.81-2.76-1.8-3.45l-6.21-4.33c-1.41-.98-3.65-.93-5.97.12Z" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 17v-3" />
  </Svg>
);

export const SearchIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M11.5 21.75c-5.65 0-10.25-4.6-10.25-10.25S5.85 1.25 11.5 1.25s10.25 4.6 10.25 10.25-4.6 10.25-10.25 10.25Zm0-19c-4.83 0-8.75 3.93-8.75 8.75S6.67 20.25 11.5 20.25s8.75-3.93 8.75-8.75S16.33 2.75 11.5 2.75Z" />
    <Path fill={color} d="M22 22.75c-.19 0-.38-.07-.53-.22l-2-2a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2 2c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22Z" />
  </Svg>
);

export const SearchUnfocused = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2" />
  </Svg>
);

export const MessagesIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M17 2H7C4.24 2 2 4.24 2 7v8.86c0 2.76 2.24 5 5 5h.09c.26 0 .52.13.68.35l1.41 1.87c.63.83 1.65.83 2.28 0l1.41-1.87c.18-.24.46-.35.68-.35H17c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5Z" opacity={0.4} />
    <Path fill={color} d="M12 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM16 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM8 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
  </Svg>
);

export const MessageUnfocused = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M8.5 19H8c-4 0-6-1-6-6V8c0-4 2-6 6-6h8c4 0 6 2 6 6v5c0 4-2 6-6 6h-.5c-.31 0-.61.15-.8.4l-1.5 2c-.66.88-1.74.88-2.4 0l-1.5-2c-.16-.22-.51-.4-.8-.4Z" />
    <Path stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15.997 11h.01M11.995 11h.01M7.995 11h.01" />
  </Svg>
);

export const MessageAvailableIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M17 2H7C4.24 2 2 4.24 2 7v8.86c0 2.76 2.24 5 5 5h.09c.26 0 .52.13.68.35l1.41 1.87c.63.83 1.65.83 2.28 0l1.41-1.87c.18-.24.46-.35.68-.35H17c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5Z" />
    <Circle cx="19" cy="5" r="4" fill="red" />
  </Svg>
);

export const NotificationIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2Zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2Z" />
  </Svg>
);

export const NotificationUnfocused = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeMiterlimit={10} d="M12.02 2.91c-3.31 0-6 2.69-6 6v.81c0 .61-.26 1.54-.57 2.06L4.3 13.27c-.71 1.18-.22 2.49 1.08 2.93 4.31 1.44 8.96 1.44 13.27 0 1.21-.4 1.74-1.83 1.08-2.93l-1.15-1.49c-.3-.52-.56-1.45-.56-2.06v-.81c-.01-3.3-2.71-6-6-6Z" />
    <Path stroke={color} strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap="round" d="M13.87 3.2a6.754 6.754 0 0 0-3.7 0c.29-.74 1.01-1.26 1.85-1.26.84 0 1.56.52 1.85 1.26Z" />
    <Path stroke={color} strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" d="M15.02 19.06c0 1.65-1.35 3-3 3-.82 0-1.58-.34-2.12-.88-.54-.54-.88-1.3-.88-2.12" />
  </Svg>
);

export const ProfileIcon = ({ size, color }: { size: number | string; color: string }) => (
  <Svg width={size as number} height={size as number} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3Zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22Z" />
  </Svg>
);

export const ProfileIconUnfocused = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12.12 12.78c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C7.52 5.96 9.54 4 12 4a4.435 4.435 0 0 1 .12 8.78ZM7.16 14.56c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0Z" />
  </Svg>
);

export const AddIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M6 12h12M12 18V6" />
  </Svg>
);

export const HeartUnfocused = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z" />
  </Svg>
);

export const HeartsFocused = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z" />
  </Svg>
);

export const ShareUnfocused = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M17 2.1 21 6l-4 3.9M21 6H9c-4.42 0-8 3.58-8 8v1" />
  </Svg>
);

export const CommentIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M8.5 19H8c-4 0-6-1-6-6V8c0-4 2-6 6-6h8c4 0 6 2 6 6v5c0 4-2 6-6 6h-.5c-.31 0-.61.15-.8.4l-1.5 2c-.66.88-1.74.88-2.4 0l-1.5-2c-.16-.22-.51-.4-.8-.4Z" />
  </Svg>
);

export const RepostIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M17 2.1 21 6l-4 3.9" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M3 11V9a4 4 0 0 1 4-4h14M7 21.9 3 18l4-3.9" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M21 13v2a4 4 0 0 1-4 4H3" />
  </Svg>
);

export const MoonIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M12 22c5.52 0 10-4.48 10-10 0-.55-.45-1-1-1-.52 0-.95.4-1 .91A7.003 7.003 0 0 1 12.09 19a7.003 7.003 0 0 1-7.09-6.91c.04-3.46 2.6-6.41 6.01-6.96.5-.08.89-.53.89-1.03 0-.55-.45-1-1-1C5.37 3.1 2 6.67 2 11.1 2 16.98 6.48 22 12 22Z" />
  </Svg>
);

export const LogoutIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M15 12H3.62M5.85 8.65 2.5 12l3.35 3.35" />
  </Svg>
);

export const GlobalIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10Z" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M8 3h1a28.424 28.424 0 0 0 0 18H8M15 3a28.424 28.424 0 0 1 0 18" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M3 16v-1a28.424 28.424 0 0 0 18 0v1M3 9a28.424 28.424 0 0 1 18 0" />
  </Svg>
);

export const VerifyIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M10.49 2.23 9 3.72c-.3.3-.88.54-1.29.54H6.27c-1.23 0-2.23 1-2.23 2.23v1.44c0 .4-.24.98-.54 1.28L2 10.71c-.87.87-.87 2.3 0 3.17L3.5 15.37c.3.3.54.88.54 1.29v1.44c0 1.23 1 2.23 2.23 2.23h1.44c.4 0 .98.24 1.28.54L10.49 22c.87.87 2.3.87 3.17 0l1.49-1.49c.3-.3.88-.54 1.29-.54h1.44c1.23 0 2.23-1 2.23-2.23v-1.44c0-.4.24-.98.54-1.28L22 13.52c.87-.87.87-2.3 0-3.17L20.65 8.9c-.3-.3-.54-.88-.54-1.29V6.17c0-1.23-1-2.23-2.23-2.23h-1.44c-.4 0-.98-.24-1.28-.54L13.67 1.91c-.87-.87-2.3-.87-3.18.32Z" opacity={0.4} />
    <Path fill={color} d="m10.58 15.58-1.59-1.59a.996.996 0 0 1 0-1.41.996.996 0 0 1 1.41 0l.88.88 3.12-3.12a.996.996 0 0 1 1.41 0c.39.39.39 1.02 0 1.41l-3.82 3.83c-.38.38-1.02.38-1.41 0Z" />
  </Svg>
);

export const ForbiddenIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.68L5.68 16.9C4.63 15.55 4 13.85 4 12Zm8 8c-1.85 0-3.55-.63-4.9-1.68L18.32 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8Z" />
  </Svg>
);

export const InfoIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1Zm1-8h-2V7h2v2Z" />
  </Svg>
);

export const AddMessage = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M8.5 19H8c-4 0-6-1-6-6V8c0-4 2-6 6-6h8c4 0 6 2 6 6v5c0 4-2 6-6 6h-.5c-.31 0-.61.15-.8.4l-1.5 2c-.66.88-1.74.88-2.4 0l-1.5-2c-.16-.22-.51-.4-.8-.4Z" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 8v6M9 11h6" />
  </Svg>
);

export const ReloadIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2c2.76 0 5.26 1.12 7.07 2.93" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M22 2v5h-5" />
  </Svg>
);

export const EditIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z" />
  </Svg>
);

export const CameraIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M20.44 6.55c-1.03-.11-1.97-.68-2.56-1.56l-1.1-1.73C16.3 2.49 15.41 2 14.46 2H9.55C8.59 2 7.7 2.49 7.22 3.26L6.12 5c-.59.87-1.55 1.45-2.56 1.56C1.59 6.74 0 8.45 0 10.52v7.12C0 20.55 1.45 22 3.37 22h17.26C22.55 22 24 20.55 24 18.64V10.52c0-2.07-1.59-3.78-3.56-3.97ZM12 18.49c-2.62 0-4.76-2.13-4.76-4.76 0-2.62 2.14-4.76 4.76-4.76s4.76 2.13 4.76 4.76c0 2.62-2.14 4.76-4.76 4.76Z" opacity={0.4} />
    <Path fill={color} d="M12 18.49c-2.62 0-4.76-2.13-4.76-4.76 0-2.62 2.14-4.76 4.76-4.76s4.76 2.13 4.76 4.76c0 2.62-2.14 4.76-4.76 4.76Z" />
  </Svg>
);

export const CloseCircleIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm3.36 12.3c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-2.3-2.3-2.3 2.3c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l2.3-2.3-2.3-2.3a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 2.3-2.3c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-2.3 2.3 2.3 2.3Z" />
  </Svg>
);

export const SendIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="m22.01 2.58-7.16 19.27a.5.5 0 0 1-.94.01L10.5 14 2.14 10.6a.5.5 0 0 1 .01-.94L21.42 2.5a.5.5 0 0 1 .59.08Z" />
  </Svg>
);

export const BackIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M9.57 5.93 3.5 12l6.07 6.07M20.5 12H3.67" />
  </Svg>
);

export const ActivityUnfocused = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M8 16h5M10 3H6C4.34 3 3 4.34 3 6v14c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3h-4" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M10 4a2 2 0 0 1 2-2 2 2 0 0 1 2 2v1H10V4Z" />
  </Svg>
);

export const RepostUnFocused = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M17 2.1 21 6l-4 3.9" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M3 11V9a4 4 0 0 1 4-4h14M7 21.9 3 18l4-3.9" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M21 13v2a4 4 0 0 1-4 4H3" />
  </Svg>
);

export const Repost = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M21 7.4 17 3l-4 4.4h2.5V14h2V7.4H21ZM7 10H5v6.6L9 21l4-4.4H10.5V10H7Zm10 8H5v2h12v-2ZM7 4H5v2h12V4H7Z" />
  </Svg>
);

export const TrashIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5" />
  </Svg>
);

export const CheckIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
  </Svg>
);

export const SparkIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M12 2Q12 12 22 12Q12 12 12 22Q12 12 2 12Q12 12 12 2Z" />
  </Svg>
);

export const SparkIconUnfocused = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path stroke={color} strokeWidth={1.5} strokeLinejoin="round" d="M12 2Q12 12 22 12Q12 12 12 22Q12 12 2 12Q12 12 12 2Z" />
  </Svg>
);

export const VerifiedIcon = ({ size, color }: IconProps) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path fill={color} d="M10.49 2.23 9 3.72c-.3.3-.88.54-1.29.54H6.27c-1.23 0-2.23 1-2.23 2.23v1.44c0 .4-.24.98-.54 1.28L2 10.71c-.87.87-.87 2.3 0 3.17L3.5 15.37c.3.3.54.88.54 1.29v1.44c0 1.23 1 2.23 2.23 2.23h1.44c.4 0 .98.24 1.28.54L10.49 22c.87.87 2.3.87 3.17 0l1.49-1.49c.3-.3.88-.54 1.29-.54h1.44c1.23 0 2.23-1 2.23-2.23v-1.44c0-.4.24-.98.54-1.28L22 13.52c.87-.87.87-2.3 0-3.17L20.65 8.9c-.3-.3-.54-.88-.54-1.29V6.17c0-1.23-1-2.23-2.23-2.23h-1.44c-.4 0-.98-.24-1.28-.54L13.67 1.91c-.87-.87-2.3-.87-3.18.32Z" opacity={0.4} />
    <Path fill={color} d="m10.58 15.58-1.59-1.59a.996.996 0 0 1 0-1.41.996.996 0 0 1 1.41 0l.88.88 3.12-3.12a.996.996 0 0 1 1.41 0c.39.39.39 1.02 0 1.41l-3.82 3.83c-.38.38-1.02.38-1.41 0Z" />
  </Svg>
);
