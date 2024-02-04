import { useEffect, useRef, useState } from 'react'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av'
import { RunOutput } from '@movie-web/providers'
import { Spinner } from '@my/ui'
import { StyleSheet } from 'react-native'
import { ShowType } from 'app/@types/types'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { Dispatch, SetStateAction } from 'react'

type Dispatcher<S> = Dispatch<SetStateAction<S>>

export type ProgressInfo = {
    positionMillis: number
    uri?: string
    viewingProgress?: {
        timeLeft: number
        percentageCompleted: number
    }
    completed: boolean
    episode?: number
    season?: number
}

export const VideoPlayer = (props: {
    src: string
    id: string
    mediaType: ShowType
    setProgress: Dispatcher<ProgressInfo>
}) => {
    const videoRef = useRef(null)
    const { setItem, getItem, removeItem } = useAsyncStorage(
        `PROGRESS_INFO_${props.mediaType}_${props.id}`
    )
    const [position, setPosition] = useState(0)
    const [seasonInfo, setSeasonInfo] = useState<{
        season: number
        episode: number
    } | null>(null)
    const { season, episode } = seasonInfo ?? { season: 1, episode: 1 }
    const updateProgress = async (progressInfo: ProgressInfo) => {
        await setItem(JSON.stringify(progressInfo))
        props.setProgress(progressInfo)
    }
    const getProgress = async () => {
        const progressInfo = await getItem()
        if (!progressInfo) return
        const res = JSON.parse(progressInfo) as ProgressInfo
        setPosition(res.positionMillis ?? 0)
        if (props.mediaType === 'show') {
            setSeasonInfo({
                season: res.season ?? 1,
                episode: res.episode ?? 1,
            })
        }
    }

    const rex = async () => {
        const progressInfo = await getItem()
        const res = JSON.parse(progressInfo!!) as ProgressInfo
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
                    viewingProgress: {
                        timeLeft:
                            status.durationMillis!! - status.positionMillis,
                        percentageCompleted: Math.round(
                            (status.positionMillis / status.durationMillis!!) *
                                100
                        ),
                    },
                    uri: props.src,
                    completed: false,
                    ...(props.mediaType === 'show' && {
                        episode: episode,
                        //TODO: if is last episode of season, increment season
                        season: season,
                    }),
                })
            } else {
                // Update your UI for the paused state
                updateProgress({
                    positionMillis: status.positionMillis,
                    viewingProgress: {
                        timeLeft:
                            status.durationMillis!! - status.positionMillis,
                        percentageCompleted: Math.round(
                            (status.positionMillis / status.durationMillis!!) *
                                100
                        ),
                    },
                    uri: props.src,
                    completed: false,
                    ...(props.mediaType === 'show' && {
                        episode: episode,
                        //TODO: if is last episode of season, increment season
                        season: season,
                    }),
                })
            }

            if (status.isBuffering) {
                // Update your UI for the buffering state
            }

            if (status.didJustFinish && !status.isLooping) {
                // The player has just finished playing and will stop. Maybe you want to play something else?
                updateProgress({
                    positionMillis: 0,
                    viewingProgress: {
                        timeLeft:
                            status.durationMillis!! - status.positionMillis,
                        percentageCompleted: 100,
                    },
                    uri: props.src,
                    completed: true,
                    ...(props.mediaType === 'show' && {
                        episode: episode + 1,
                        //TODO: if is last episode of season, increment season
                        season: season,
                    }),
                })
                rex()
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
                // present full seen
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
    setProgress,
}: {
    data: RunOutput | null
    id: string
    mediaType: ShowType
    loading: boolean
    setProgress: Dispatcher<ProgressInfo>
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
                setProgress={setProgress}
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
