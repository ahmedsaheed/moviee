import { useRef } from 'react'
import { ResizeMode, Video } from 'expo-av'
import { RunOutput } from '@movie-web/providers'
import { Paragraph, Spinner } from '@my/ui'
import { StyleSheet } from 'react-native'

export const VideoPlayer = (props: { src: string }) => {
    const videoRef = useRef(null)
    console.log('props', props.src)
    return (
        <Video
            source={{ uri: props.src, type: 'm3u8' }}
            style={styles.video}
            ref={videoRef}
            useNativeControls={true}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            focusable={true}
            shouldPlay={true}
            onReadyForDisplay={() => {
                // present full screen
                videoRef.current?.presentFullscreenPlayer()
            }}
        />
    )
}

export function PlayerWrapper({
    data,
    loading,
}: {
    data: RunOutput | null
    loading: boolean
}) {
    if (loading) {
        return <Spinner ai={'center'} size="large" color="$orange10" />
    }
    if (data) {
        return <VideoPlayer src={data.stream?.playlist} />
    }
    return null
}
export const styles = StyleSheet.create({
    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
    },
})
