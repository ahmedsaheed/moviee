import { H3, Spinner } from '@my/ui'
import { Image, SizableText } from 'tamagui'
import { useEffect, useState } from 'react'
import {
    MovieMedia,
    RunOutput,
    ScrapeMedia,
    ShowMedia,
} from '@movie-web/providers'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { useMovieData } from 'app/hooks/useMovieData'
import { Dimensions, ImageBackground, ScrollView } from 'react-native'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { Check, ChevronLeft, Play, Plus, Share } from '@tamagui/lucide-icons'
import { getMoviesMetadata, retrieveFromProvider } from 'app/lib/movies/movies'
import { PlayerWrapper, ProgressInfo } from 'app/components/av'
import { CannotPlayMovieDialog, convertMinutesToHours } from 'app/utils'
import { ShowType } from 'app/@types/types'
import { useSeasonsAndEpisodes } from 'app/hooks/useSeasonsAndEpisodes'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'
import { SvgUri } from 'react-native-svg'
import { Button, Paragraph, XStack, YStack, View } from 'tamagui'
import { DetailedTabView } from 'app/components/underlined-tab-view'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet } from 'react-native'
import { SeasonSelector } from 'app/components/season-selector'
import { ShowProgressIndicator } from 'app/components/progress-indicator'

const { useParam } = createParam<{ id: string; type: string }>()

export function UserDetailScreen() {
    const [media, setMedia] = useState<ScrapeMedia | null>(null)
    const [data, setData] = useState<RunOutput | null>(null)
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const [wishedlisted, setWishedlisted] = useState(false)
    const [progress, setProgress] = useState<ProgressInfo | null>(null)
    const [id] = useParam('id')
    const [type] = useParam('type') as unknown as [ShowType]

    const link = useLink({
        href: '/',
    })

    const IMAGE_URL_PRFIX = 'https://image.tmdb.org/t/p/original/'
    const { height } = Dimensions.get('window')
    const {
        data: movieData,
        images,
        similarMovies,
    } = useMovieData(type, Number(id!!))
    const info = useSeasonsAndEpisodes(type, Number(id!!))
    const { setItem, getItem, removeItem } = useAsyncStorage(`WATCHLIST_${id}`)
    const { getItem: getProgressInfo, setItem: setProgressInfo } =
        useAsyncStorage(`PROGRESS_INFO_${type}_${id}`)
    const readItemFromWishlistStorage = async () => {
        const item = await getItem()
        if (item !== null) {
            setWishedlisted(true)
        }
    }

    const getProgress = async () => {
        const progressInfo = await getProgressInfo()
        if (!progressInfo) {
            setProgress(null)
            return
        }

        const res = JSON.parse(progressInfo) as ProgressInfo
        console.log('progrssInfo', res)
        setProgress(res)
    }

    const updateProgress = async (progressInfo: ProgressInfo) => {
        await setProgressInfo(JSON.stringify(progressInfo))
        setProgress(progressInfo)
    }

    const removeItemFromWishlistStorage = async () => {
        const item = await getItem()
        if (item !== null) {
            await removeItem()
            setWishedlisted(false)
        }
    }

    const writeItemToStorage = async newValue => {
        await setItem(newValue)
        if (newValue === 'true') {
            setWishedlisted(true)
        }
    }
    useEffect(() => {
        readItemFromWishlistStorage()
        getProgress()
    }, [])

    const moreDetails = {
        genre: movieData?.genres.map(item => item.name).join(', '),
        director: 'unknown',
        starring: 'unknown',
        studio: movieData?.production_companies
            .map(item => item.name)
            .join(', '),
    }

    const movieOverView = () => {
        const overview =
            type === 'movie'
                ? movieData?.overview
                : info?.episodes !== undefined
                ? info?.episodes!![info.currentEpisode.number - 1]?.overview
                : movieData?.overview
        return showMore ? overview : overview?.slice(0, 100)
    }
    function playButtonText() {
        if (loading) {
            return 'Loading...'
        }
        if (type === 'movie') {
            if (progress !== null) {
                if (progress.positionMillis > 0) {
                    return 'CONTINUE'
                }
            }
            return 'PLAY'
        }
        if (type === 'show') {
            if (progress !== null) {
                if (progress.positionMillis > 0) {
                    console.log('using progress', progress)
                    return `Continue S${progress.season} E${progress.episode}`
                }
            }
            // let use progress if available

            return `Play S${progress?.season || info!!.season.number} E${
                progress?.episode || info!!.currentEpisode.number
            }`
        }
    }

    const internalPlay = async (
        movieName: string,
        seriesOptions?: { seasonNumber: number; episodeNumber: number }
    ) => {
        setLoading(true)
        const res = await getMetaAndPlay(movieName, seriesOptions)
        if (res === null) return
        if (res && res?.type === 'show' && seriesOptions === undefined) {
            res.episode = info!!.currentEpisode
            res.season = info!!.season
        }
        setMedia(res)
    }

    useEffect(() => {
        const out = async () => await retrieveFromProvider(media)
        out().then(out => {
            console.log('out', out)
            if (out === null) {
                CannotPlayMovieDialog()
                return
            }

            setData(out)
        })
        setLoading(false)
    }, [media])

    if (movieData === null) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <Spinner size="large" />
            </View>
        )
    }
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <YStack pb="$2" style={{ height: '100%' }}>
                {!!movieData && (
                    <>
                        <View style={{ flex: 1, position: 'relative' }}>
                            <ImageBackground
                                source={{
                                    uri: `${
                                        IMAGE_URL_PRFIX +
                                        movieData.backdrop_path
                                    }`,
                                }}
                                style={{
                                    width: '100%',
                                    height: height / 1.7,
                                    alignItems: 'center',
                                    position: 'relative',
                                }}
                                resizeMode="cover"
                            >
                                <XStack
                                    flex={1}
                                    width={'100%'}
                                    space="$8"
                                    padding="$4"
                                >
                                    {/*@ts-ignore*/}
                                    <BlurView
                                        intensity={40}
                                        tint="dark"
                                        mt="$10"
                                        style={{
                                            width: '7%',
                                            height: 30,
                                            position: 'absolute',
                                            top: 60,
                                            left: 10,
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            display: 'flex',
                                        }}
                                    >
                                        <ChevronLeft
                                            size="$1"
                                            onPress={router.back}
                                        />
                                    </BlurView>
                                    {/*@ts-ignore*/}
                                    <BlurView
                                        intensity={10}
                                        tint="dark"
                                        style={{
                                            width: '7%',
                                            height: 30,
                                            position: 'absolute',
                                            top: 60,
                                            right: 10,
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            display: 'flex',
                                        }}
                                    >
                                        <Share
                                            size="$1"
                                            onPress={router.back}
                                        />
                                    </BlurView>

                                    {/*@ts-ignore*/}
                                    <BlurView
                                        intensity={10}
                                        tint="dark"
                                        style={{
                                            width: '7%',
                                            height: 30,
                                            position: 'absolute',
                                            top: 60,
                                            right: 50,
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            display: 'flex',
                                        }}
                                    >
                                        {!wishedlisted ? (
                                            <Plus
                                                size="$1"
                                                onPress={() =>
                                                    writeItemToStorage('true')
                                                }
                                            />
                                        ) : (
                                            <Check
                                                size="$1"
                                                onPress={() =>
                                                    removeItemFromWishlistStorage()
                                                }
                                            />
                                        )}
                                    </BlurView>
                                </XStack>
                                {images?.logos[0] !== undefined && (
                                    // @ts-ignore
                                    <LinearGradient
                                        colors={['black', 'transparent']}
                                        style={styles.gradient}
                                        start={{ x: 0, y: 1.0 }}
                                        end={{ x: 0, y: 0 }}
                                    >
                                        <Image
                                            source={{
                                                uri: `${
                                                    IMAGE_URL_PRFIX +
                                                    images?.logos[0].file_path
                                                }`,
                                            }}
                                            width="100%"
                                            height={70}
                                            resizeMode="contain"
                                            position="absolute"
                                        />
                                    </LinearGradient>
                                )}
                            </ImageBackground>
                        </View>

                        {images?.logos[0] === undefined && (
                            <H3
                                fontWeight="bold"
                                m="$4"
                                style={{ fontFamily: 'System' }}
                            >
                                {movieData?.title ?? movieData.name}
                            </H3>
                        )}

                        <Button
                            mt="$2"
                            icon={Play}
                            width={'80%'}
                            alignSelf="center"
                            style={{
                                textTransform: 'uppercase',
                                fontFamily: 'System',
                            }}
                            onPress={() =>
                                internalPlay(movieData?.title ?? movieData.name)
                            }
                        >
                            {playButtonText()}
                        </Button>
                        {progress?.viewingProgress?.percentageCompleted !==
                            undefined && (
                            <ShowProgressIndicator
                                progressPercentVal={
                                    progress?.viewingProgress
                                        ?.percentageCompleted
                                }
                                timeLeft={progress?.viewingProgress?.timeLeft}
                            />
                        )}
                        <Paragraph
                            m="$4"
                            style={{
                                fontFamily: 'System',
                            }}
                            fontSize={16}
                            lineHeight="$1"
                        >
                            {movieOverView()}
                            <SizableText
                                onPress={() => setShowMore(!showMore)}
                                style={{
                                    fontFamily: 'System',
                                }}
                                theme={'alt1'}
                                fontSize={18}
                            >
                                ...{showMore ? 'less' : 'more'}
                            </SizableText>
                        </Paragraph>
                        {type === 'show' && (
                            <SeasonSelector
                                id="select-demo-2"
                                native
                                seasonsLength={movieData?.number_of_seasons}
                                updateProgress={updateProgress}
                                initialSeason={progress?.season}
                            />
                        )}
                        <ExtraInfo {...movieData} />
                        <Badges />

                        <DetailedTabView
                            movieType={type}
                            movieId={id!!}
                            // episodes={info?.episodes}
                            moreDetails={moreDetails}
                            similarMovies={similarMovies}
                            seasonNumber={progress?.season}
                        />

                        <PlayerWrapper
                            data={data}
                            loading={loading}
                            id={id!!}
                            mediaType={type}
                        />
                    </>
                )}
            </YStack>
        </ScrollView>
    )
}

function ExtraInfo(movieData) {
    return (
        <View
            padding="$2"
            mx="$4"
            style={{
                fontWeight: 'bold',
            }}
        >
            <XStack>
                <>
                    <SizableText style={{ fontFamily: 'System' }}>
                        {movieData.release_date?.split('-')[0] ??
                            movieData.seasons[0]!!.air_date?.split('-')[0]}
                    </SizableText>
                    <SizableText
                        theme={'alt1'}
                        style={{ fontFamily: 'System' }}
                    >
                        {''} • {''}
                    </SizableText>

                    <SizableText style={{ fontFamily: 'System' }}>
                        {movieData?.runtime !== undefined
                            ? convertMinutesToHours(movieData.runtime)
                            : `${movieData?.number_of_seasons} ${
                                  movieData?.number_of_seasons === 1
                                      ? 'Season'
                                      : 'Seasons'
                              }`}
                    </SizableText>

                    <SizableText
                        theme={'alt1'}
                        style={{ fontFamily: 'System' }}
                    >
                        {''} • {''}
                    </SizableText>
                    {movieData.genres.map((item, index) => {
                        return (
                            index < 2 && (
                                <>
                                    <SizableText
                                        key={index}
                                        style={{ fontFamily: 'System' }}
                                    >
                                        {item.name}
                                    </SizableText>
                                    {index !== 1 && (
                                        <SizableText
                                            theme={'alt1'}
                                            style={{ fontFamily: 'System' }}
                                        >
                                            {''},{' '}
                                        </SizableText>
                                    )}
                                </>
                            )
                        )
                    })}
                </>
            </XStack>
        </View>
    )
}

type BothMedia = ShowMedia | MovieMedia

export async function getMetaAndPlay(
    movieName: string,
    seriesOptions?: { seasonNumber: number; episodeNumber: number }
): Promise<BothMedia | null> {
    let res = await getMoviesMetadata(movieName, seriesOptions)
    console.log('metadata is ', res)
    return res === null ? null : res
}

const styles = StyleSheet.create({
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 40,
        height: '90%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
})

const Badges = () => {
    const BadgesUrl: Array<string> = [
        'https://tv.apple.com/assets/badges/MetadataBadge%204K%20OnDark-c90195dae0171c69694b4d7386421ad8.svg',
        'https://tv.apple.com/assets/badges/MetadataBadge%20AD%20OnDark-4731d380509cdd9c3e59e73cb9dc09d5.svg',
        'https://tv.apple.com/assets/badges/MetadataBadge%20SDH%20OnDark-45f29ce5e07128bf67d924a31a003cf3.svg',
        'https://tv.apple.com/assets/badges/MetadataBadge%20CC%20OnDark-7b5b00df263bfee5af843510f708c307.svg',
    ]

    return (
        <XStack
            flex={1}
            space="$2"
            borderWidth={2}
            borderColor="transparent"
            padding="$2"
            mx="$4"
        >
            {BadgesUrl.map((item, index) => {
                return (
                    <YStack
                        alignItems="center"
                        padding="$0"
                        backgroundColor="$transparent"
                        theme={'alt2'}
                    >
                        <SvgUri uri={item} style={{ opacity: 0.8 }} />
                    </YStack>
                )
            })}
        </XStack>
    )
}
