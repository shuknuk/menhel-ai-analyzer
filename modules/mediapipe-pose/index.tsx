import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { ViewProps } from 'react-native';

// Body pose types (for squats)
export type OnSquatCountEvent = {
    count: number;
};

export type OnSquatDepthEvent = {
    depth: number;
    angle: number;
};

export type OnFormCorrectionEvent = {
    type: string;
    message: string;
};

export type MediapipePoseViewProps = ViewProps & {
    onSquatCount?: (event: { nativeEvent: OnSquatCountEvent }) => void;
    onSquatDepth?: (event: { nativeEvent: OnSquatDepthEvent }) => void;
    onFormCorrection?: (event: { nativeEvent: OnFormCorrectionEvent }) => void;
};

// Hand pose types
export type HandLandmark = {
    x: number;
    y: number;
    confidence: number;
};

export type OnHandOpenCloseEvent = {
    count: number;
};

export type OnLandmarksEvent = {
    landmarks: HandLandmark[];
};

export type OnHandStateEvent = {
    isOpen: boolean;
    avgTipDistance: number;
};

export type HandTrackerViewProps = ViewProps & {
    onHandOpenClose?: (event: { nativeEvent: OnHandOpenCloseEvent }) => void;
    onLandmarks?: (event: { nativeEvent: OnLandmarksEvent }) => void;
    onHandState?: (event: { nativeEvent: OnHandStateEvent }) => void;
};

// Native views
const NativeBodyPoseView: React.ComponentType<MediapipePoseViewProps> =
    requireNativeViewManager('MediapipePose');

const NativeHandTrackerView: React.ComponentType<HandTrackerViewProps> =
    requireNativeViewManager('HandTrackerView');

// Export components
export function MediapipePoseView(props: MediapipePoseViewProps) {
    return <NativeBodyPoseView {...props} />;
}

export function HandTrackerView(props: HandTrackerViewProps) {
    return <NativeHandTrackerView {...props} />;
}

// Default export for backwards compatibility
export default MediapipePoseView;
