import { useEffect, useRef, useState } from 'react'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av'
import { RunOutput } from '@movie-web/providers'
import { Spinner } from '@my/ui'
import { StyleSheet } from 'react-native'
import { Base, ShowType } from 'app/@types/types'
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
    basedTypedInfo?: Base
}) => {
    const { src, id, mediaType, setProgress, basedTypedInfo } = props
    const videoRef = useRef(null)
    const { setItem, getItem, removeItem } = useAsyncStorage(
        `PROGRESS_INFO_${mediaType}_${id}`
    )
    const { setItem: setContinueWatchingItem, getItem: getContinueWatching } =
        useAsyncStorage('continue_watching')
    const [position, setPosition] = useState(0)
    const [seasonInfo, setSeasonInfo] = useState<{
        season: number
        episode: number
    } | null>(null)
    const { season, episode } = seasonInfo ?? { season: 1, episode: 1 }
    const updateProgress = async (progressInfo: ProgressInfo) => {
        await setItem(JSON.stringify(progressInfo))
        setProgress(progressInfo)
    }

    const addCurrentToContinueWatching = async () => {
        const continueWatching = await getContinueWatching()
        const continueWatchingArray = (
            continueWatching ? JSON.parse(continueWatching) : []
        ) as Base[]
        console.log('continueWatchingArray', continueWatchingArray.length)
        const index = continueWatchingArray.findIndex(
            (item: Base) => item.tmdbId === Number(id)
        )
        if (index !== -1) {
            continueWatchingArray.splice(index, 1)
        }
        let newlenght = continueWatchingArray.unshift(basedTypedInfo!!)
        console.log('newlenght', newlenght)
        await setContinueWatchingItem(JSON.stringify(continueWatchingArray))
    }

    const getProgress = async () => {
        const progressInfo = await getItem()
        if (!progressInfo) return
        const res = JSON.parse(progressInfo) as ProgressInfo
        setPosition(res.positionMillis ?? 0)
        if (mediaType === 'show') {
            setSeasonInfo({
                season: res.season ?? 1,
                episode: res.episode ?? 1,
            })
        }
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
                addCurrentToContinueWatching()
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
                    uri: src,
                    completed: false,
                    ...(mediaType === 'show' && {
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
                    uri: src,
                    completed: false,
                    ...(mediaType === 'show' && {
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
                    uri: src,
                    completed: true,
                    ...(mediaType === 'show' && {
                        episode: episode + 1,
                        //TODO: if is last episode of season, increment season
                        season: season,
                    }),
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
    baseTypedInfo,
}: {
    data: RunOutput | null
    id: string
    mediaType: ShowType
    loading: boolean
    setProgress: Dispatcher<ProgressInfo>
    baseTypedInfo?: Base
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
                basedTypedInfo={baseTypedInfo}
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
