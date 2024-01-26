import { useEffect, useRef, useState } from 'react'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av'
import { RunOutput } from '@movie-web/providers'
import { Spinner } from '@my/ui'
import { StyleSheet } from 'react-native'
import { ShowType } from 'app/@types/types'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'

export type ProgressInfo = {
    positionMillis: number
    uri: string
    completed: boolean
}

export const VideoPlayer = (props: {
    src: string
    id: string
    mediaType: ShowType
}) => {
    const videoRef = useRef(null)
    const { setItem, getItem, removeItem } = useAsyncStorage(
        `PROGRESS_INFO_${props.mediaType}_${props.id}`
    )
    const [position, setPosition] = useState(0)
    const updateProgress = async (progressInfo: ProgressInfo) => {
        await setItem(JSON.stringify(progressInfo))
    }
    const getProgress = async () => {
        const progressInfo = await getItem()
        if (!progressInfo) return
        const res = JSON.parse(progressInfo) as ProgressInfo
        setPosition(res.positionMillis)
    }

    function updatePlaybackStatus(status: AVPlaybackStatus) {
        if (!status.isLoaded) {
            if (status.error) {
                console.log(
                    `Encountered a fatal error during playback: ${status.error}`
                )
            }
        } else {
            if (status.isPlaying) {
                // Update your UI for the playing state
                updateProgress({
                    positionMillis: status.positionMillis,
                    uri: props.src,
                    completed: false,
                })

            } else {
                updateProgress({
                    positionMillis: status.positionMillis,
                    uri: props.src,
                    completed: false,
                })
            }

            if (status.isBuffering) {
                // Update your UI for the buffering state
            }

            if (status.didJustFinish && !status.isLooping) {
                // The player has just finished playing and will stop. Maybe you want to play something else?
                updateProgress({
                    positionMillis: 0,
                    uri: props.src,
                    completed: true,
                })
            }
        }
    }

    useEffect(() => {
        getProgress()
    }, [])
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
            positionMillis={position}
            progressUpdateIntervalMillis={500}
            //@ts-ignore
            onPlaybackStatusUpdate={status => updatePlaybackStatus(status)}
            onReadyForDisplay={() => {
                // present full screen
                //@ts-ignore
                videoRef.current?.presentFullscreenPlayer()
            }}
        />
    )
}

export function PlayerWrapper({
    data,
    loading,
    id,
    mediaType,
}: {
    data: RunOutput | null
    id: string
    mediaType: ShowType
    loading: boolean
}) {
    if (loading) {
        return <Spinner ai={'center'} size="large" color="$orange10" />
    }
    if (data) {
        //@ts-ignore
        return (
            <VideoPlayer
                src={data.stream?.playlist}
                id={id}
                mediaType={mediaType}
            />
        )
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
