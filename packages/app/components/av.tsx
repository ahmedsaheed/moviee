import { useRef } from 'react'
import { ResizeMode, Video } from 'expo-av'
import { styles } from 'app/features/home/screen'
import { RunOutput } from '@movie-web/providers'
import { Paragraph, Spinner } from '@my/ui'

export const VideoPlayer = (props: { src: string }) => {
    const videoRef = useRef(null)
    console.log('props', props.src)
    return (
        <Video
            source={{ uri: props.src, type: 'm3u8' }}
            style={styles.video}
            ref={videoRef}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            focusable={true}
            shouldPlay={true}
        />
    )
}

export function PlayerWrapper({
    data,
    searchQuery,
    loading,
}: {
    data: RunOutput | null
    searchQuery: string
    loading: boolean
}) {
    if (loading) {
        return <Spinner ai={'center'} size="large" color="$orange10" />
    }
    if (data) {
        return <VideoPlayer src={data.stream?.playlist} />
    }
    return <Paragraph ta="center">No results found.</Paragraph>
}
