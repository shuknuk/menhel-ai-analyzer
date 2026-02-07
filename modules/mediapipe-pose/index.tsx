import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { ViewProps } from 'react-native';

export type OnSquatCountEvent = {
    count: number;
};

export type MediapipePoseViewProps = ViewProps & {
    onSquatCount?: (event: { nativeEvent: OnSquatCountEvent }) => void;
};

const NativeView: React.ComponentType<MediapipePoseViewProps> =
    requireNativeViewManager('MediapipePose');

export default function MediapipePoseView(props: MediapipePoseViewProps) {
    return <NativeView { ...props } />;
}
