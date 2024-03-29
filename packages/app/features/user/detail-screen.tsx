import { ButtonIcon, H3, Spinner } from '@my/ui'
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
import { Base, ShowType } from 'app/@types/types'
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
import { useWishlistStorage } from 'app/hooks/useWishlistStorage'
import { Stack } from 'expo-router'

const { useParam } = createParam<{ id: string; type: string }>()

export function UserDetailScreen() {
    const [media, setMedia] = useState<ScrapeMedia | null>(null)
    const [data, setData] = useState<RunOutput | null>(null)
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const [wishedListed, setWishedListed] = useState(false)
    const [progress, setProgress] = useState<ProgressInfo | null>(null)
    const [id] = useParam('id')
    const [type] = useParam('type') as unknown as [ShowType]

    const link = useLink({
        href: '/',
    })

    const IMAGE_URL_PREFIX = 'https://image.tmdb.org/t/p/original/'
    const { height } = Dimensions.get('window')
    const {
        data: movieData,
        images,
        similarMovies,
    } = useMovieData(type, Number(id!!))
    const { isWishlisted, updateWishlist } = useWishlistStorage()
    const info = useSeasonsAndEpisodes(type, Number(id!!))
    const { getItem: getProgressInfo, setItem: setProgressInfo } =
        useAsyncStorage(`PROGRESS_INFO_${type}_${id}`)

    const baseTypedInfo = {
        tmdbId: Number(id),
        imageUrl: movieData?.poster_path,
        backdropUrl: movieData?.backdrop_path,
        title: movieData?.title ?? movieData?.name,
        releaseYear: movieData?.release_date?.split('-')[0] ?? '',
    } as unknown as Base

    const checkWishlistStorage = async () => {
        const isWishListed = await isWishlisted(baseTypedInfo)
        console.log('isWishListed', isWishListed)
        if (isWishListed) {
            setWishedListed(true)
        }
    }

    const addToWishlist = async () => {
        await updateWishlist('add', baseTypedInfo)
        setWishedListed(true)
    }
    const removeFromWishlist = async () => {
        await updateWishlist('remove', baseTypedInfo)
        setWishedListed(false)
    }

    const getProgress = async () => {
        const progressInfo = await getProgressInfo()
        if (!progressInfo) {
            setProgress(null)
            return
        }

        const res = JSON.parse(progressInfo) as ProgressInfo
        setProgress(res)
    }

    const updateProgress = async (progressInfo: ProgressInfo) => {
        await setProgressInfo(JSON.stringify(progressInfo))
        setProgress(progressInfo)
    }

    useEffect(() => {
        checkWishlistStorage()
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
                if (progress.viewingProgress?.percentageCompleted === 100) {
                    return 'REPLAY'
                }
                if (progress.positionMillis > 0) {
                    return 'CONTINUE'
                }
            }
            return 'PLAY'
        }
        if (type === 'show') {
            if (progress !== null) {
                if (progress.positionMillis > 0) {
                    return `Continue S${progress.season} E${progress.episode}`
                }
            }
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
        const res = await getMetaAndPlay(movieName, Number(id), seriesOptions)
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

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
        >
            <YStack pb="$2" style={{ height: '100%' }}>
                {movieData === null && (
                    <View
                        mih={'100%'}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: height,
                            minHeight: height,
                        }}
                    >
                        <Spinner size="large" />
                    </View>
                )}
                {!!movieData && (
                    <>
                        <Stack.Screen
                            options={{
                                title: movieData?.title ?? movieData.name,
                                headerLargeTitle: false,
                                headerShown: true,
                                headerTransparent: true,
                                headerBlurEffect: 'dark',
                                headerRight: () => {
                                    return !wishedListed ? (
                                        <Plus
                                            size="$1"
                                            onPress={addToWishlist}
                                        />
                                    ) : (
                                        <Check
                                            size="$1"
                                            onPress={removeFromWishlist}
                                        />
                                    )
                                },
                                // headerBackVisible: true,
                            }}
                        />
                        <View style={{ flex: 1, position: 'relative' }}>
                            <ImageBackground
                                source={{
                                    uri: `${
                                        IMAGE_URL_PREFIX +
                                        movieData.backdrop_path
                                    }`,
                                }}
                                style={{
                                    width: '100%',
                                    height: height / 2,
                                    alignItems: 'center',
                                    position: 'relative',
                                    pointerEvents: 'auto',
                                }}
                                resizeMode="cover"
                            >
                                <LinearGradient
                                    colors={['black', 'transparent']}
                                    style={styles.gradient}
                                    start={{ x: 0, y: 1.0 }}
                                    end={{ x: 0, y: 0 }}
                                >
                                    {images?.logos[0] !== undefined && (
                                        // @ts-ignore

                                        <Image
                                            source={{
                                                uri: `${
                                                    IMAGE_URL_PREFIX +
                                                    images?.logos[0].file_path
                                                }`,
                                            }}
                                            width="100%"
                                            height={70}
                                            resizeMode="contain"
                                            position="absolute"
                                        />
                                    )}
                                    {images?.logos[0] === undefined && (
                                        <H3
                                            fontWeight="bold"
                                            m="$4"
                                            style={{ fontFamily: 'System' }}
                                        >
                                            {movieData?.title ?? movieData.name}
                                        </H3>
                                    )}
                                </LinearGradient>
                            </ImageBackground>
                        </View>
                        <Button
                            mt="$2"
                            icon={Play}
                            width={'90%'}
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

                        {type === 'show' && (
                            <SeasonSelector
                                id="select-demo-2"
                                native
                                seasonsLength={movieData?.number_of_seasons}
                                updateProgress={updateProgress}
                                initialSeason={progress?.season}
                            />
                        )}
                        {progress?.viewingProgress?.percentageCompleted !==
                            undefined &&
                            progress?.viewingProgress?.percentageCompleted !==
                                100 && (
                                <ShowProgressIndicator
                                    progressPercentVal={
                                        progress?.viewingProgress
                                            ?.percentageCompleted
                                    }
                                    timeLeft={
                                        progress?.viewingProgress?.timeLeft
                                    }
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
                        <ExtraInfo {...movieData} />
                        <Badges />

                        <DetailedTabView
                            movieName={movieData?.title ?? movieData.name}
                            movieType={type}
                            movieId={id!!}
                            // episodes={info?.episodes}
                            moreDetails={moreDetails}
                            similarMovies={similarMovies}
                            seasonNumber={progress?.season}
                            setMedia={setMedia}
                        />

                        <PlayerWrapper
                            data={data}
                            loading={loading}
                            id={id!!}
                            mediaType={type}
                            setProgress={setProgress}
                            baseTypedInfo={baseTypedInfo}
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
                                            key={item.name}
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
    id: number,
    seriesOptions?: { seasonNumber: number; episodeNumber: number }
): Promise<BothMedia | null> {
    let res = await getMoviesMetadata(movieName, id, seriesOptions)
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
            mx="$4"
            py="$1"
        >
            {BadgesUrl.map((item, index) => {
                return (
                    <YStack
                        key={index}
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
