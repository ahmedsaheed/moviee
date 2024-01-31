import { H3, H5, Spinner, Tabs, TabsContentProps, Text } from '@my/ui'
import { Stack } from 'expo-router'
import {
    AnimatePresence,
    Image,
    Separator,
    SizableText,
    StackProps,
    styled,
    TabLayout,
    TabsTabProps,
} from 'tamagui'
import { useEffect, useState } from 'react'
import { RunOutput, ScrapeMedia } from '@movie-web/providers'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { useMovieData } from 'app/hooks/useMovieData'
import {
    Dimensions,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    View,
} from 'react-native'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import {
    Check,
    ChevronLeft,
    Download,
    Play,
    Plus,
    Share,
} from '@tamagui/lucide-icons'
import { getMoviesMetadata, retrieveFromProvider } from 'app/lib/movies/movies'
import { PlayerWrapper, ProgressInfo } from 'app/components/av'
import { CannotPlayMovieDialog, convertMinutesToHours } from 'app/utils'
import { ShowType } from 'app/@types/types'
import { useSeasonsAndEpisodes } from 'app/hooks/useSeasonsAndEpisodes'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'
import { SvgUri } from 'react-native-svg'
import type {} from 'tamagui'
import {
    Button,
    Paragraph,
    SizeTokens,
    Progress,
    Slider,
    XStack,
    YStack,
} from 'tamagui'
import { DetailedTabView } from 'app/components/underlined-tab-view'
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
    const { data: movieData, images } = useMovieData(type, Number(id!!))
    const info = useSeasonsAndEpisodes(type, Number(id!!))
    const { setItem, getItem, removeItem } = useAsyncStorage(`WATCHLIST_${id}`)
    const { setItem: setProgressInfo, getItem: getProgressInfo } =
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

    const BadgesUrl: Array<string> = [
        'https://tv.apple.com/assets/badges/MetadataBadge%204K%20OnDark-c90195dae0171c69694b4d7386421ad8.svg',
        'https://tv.apple.com/assets/badges/MetadataBadge%20AD%20OnDark-4731d380509cdd9c3e59e73cb9dc09d5.svg',
        'https://tv.apple.com/assets/badges/MetadataBadge%20SDH%20OnDark-45f29ce5e07128bf67d924a31a003cf3.svg',
        'https://tv.apple.com/assets/badges/MetadataBadge%20CC%20OnDark-7b5b00df263bfee5af843510f708c307.svg',
    ]

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
                    return `Continue S${progress.season} E${progress.episode}`
                }
            }
            return `Play S${info!!.season.number} E${
                info!!.currentEpisode.number
            }`
        }
    }

    async function getMetaAndPlay(movieName: string) {
        setLoading(true)
        let res = await getMoviesMetadata(movieName)
        if (res === null) {
            return
        }
        if (res && res?.type === 'show') {
            res = {
                ...res,
                episode: info!!.currentEpisode,
                season: info!!.season,
            }
        }
        setMedia(res)
        setLoading(false)
        console.log('res', res)
    }

    useEffect(() => {
        const out = async () => await retrieveFromProvider(media)
        setLoading(true)
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
        <YStack pb="$2" style={{ height: 'auto' }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
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
                                    <BlurView
                                        intensity={10}
                                        tint="dark"
                                        mt="$10"
                                        style={{
                                            width: '100%',
                                            height: '20%',
                                            position: 'absolute',
                                            bottom: 0,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Image
                                            source={{
                                                uri: `${
                                                    IMAGE_URL_PRFIX +
                                                    images?.logos[0].file_path
                                                }`,
                                            }}
                                            width="100%"
                                            height={100}
                                            resizeMode="contain"
                                            bottom={3}
                                            position="absolute"

                                            // px="$8"
                                        />
                                    </BlurView>
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
                                getMetaAndPlay(
                                    movieData?.title ?? movieData.name
                                )
                            }
                        >
                            {playButtonText()}
                        </Button>
                        {progress?.percentCompleted !== undefined && (
                            <ShowProgressIndicator
                                progressVal={progress?.percentCompleted}
                            />
                        )}
                        <ExtraInfo {...movieData} />

                        <XStack
                            flex={1}
                            space="$2"
                            borderWidth={2}
                            borderColor="transparent"
                            padding="$2"
                            alignSelf="center"
                        >
                            {BadgesUrl.map((item, index) => {
                                return (
                                    <YStack
                                        alignItems="center"
                                        padding="$0"
                                        backgroundColor="$transparent"
                                        theme={'alt2'}
                                    >
                                        <SvgUri
                                            uri={item}
                                            style={{ opacity: 0.8 }}
                                        />
                                    </YStack>
                                )
                            })}
                        </XStack>

                        <XStack
                            flex={1}
                            space="$8"
                            borderWidth={2}
                            borderColor="transparent"
                            padding="$2"
                            alignSelf="center"
                        >
                            <YStack
                                alignItems="center"
                                padding="$2"
                                onPress={() => {
                                    writeItemToStorage('true')
                                }}
                            >
                                {!wishedlisted ? (
                                    <Plus size={20} theme="alt1" />
                                ) : (
                                    <Check size={20} theme="alt1" />
                                )}

                                <SizableText
                                    size="$2"
                                    theme={'alt1'}
                                    style={{
                                        textTransform: 'uppercase',
                                        fontFamily: 'System',
                                    }}
                                >
                                    Watchlist
                                </SizableText>
                            </YStack>
                            <YStack alignItems="center" padding="$2">
                                <Download size={20} theme="alt1" />
                                <SizableText
                                    size="$2"
                                    style={{
                                        textTransform: 'uppercase',
                                        fontFamily: 'System',
                                    }}
                                    theme={'alt1'}
                                >
                                    Download
                                </SizableText>
                            </YStack>
                        </XStack>
                        <Separator px="$4" />
                        <Paragraph
                            m="$4"
                            style={{
                                fontFamily: 'System',
                            }}
                            fontSize={18}
                        >
                            {showMore
                                ? movieData.overview
                                : movieData.overview.slice(0, 100)}
                            {}
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
                        <DetailedTabView
                            movieType={type}
                            movieId={id!!}
                            episodes={info?.episodes}
                            moreDetails={moreDetails}
                        />
                    </>
                )}

                <PlayerWrapper
                    data={data}
                    loading={loading}
                    id={id!!}
                    mediaType={type}
                />
            </ScrollView>
        </YStack>
    )
}

function ExtraInfo(movieData) {
    return (
        <View
            style={{
                marginHorizontal: 20,
            }}
        >
            <XStack
                flex={1}
                style={{
                    opacity: 0.8,
                }}
                alignSelf="center"
            >
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
                            : `${movieData?.number_of_seasons} Seasons`}
                    </SizableText>

                    <SizableText
                        theme={'alt1'}
                        style={{ fontFamily: 'System' }}
                    >
                        {''} • {''}
                    </SizableText>
                    {movieData.genres.map((item, index) => {
                        return (
                            // return only first 3 genres
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

interface Props {
    progressVal?: number
}
function ShowProgressIndicator({ progressVal = 0 }: Props) {
    const [progress, setProgress] = useState(progressVal)
    const sizeProp = `$${1}` as SizeTokens

    useEffect(() => {
        setProgress(progressVal)
    }, [progressVal])

    return (
        <>
            <Paragraph height={10} opacity={0.5}></Paragraph>
            <XStack
                flex={1}
                borderWidth={2}
                borderColor="transparent"
                padding="$2"
                height="$3"
                alignSelf="center"
                alignItems="center"
            >
                <YStack padding="$1">
                    <Progress size={sizeProp} value={progress}>
                        <Progress.Indicator animation="medium" />
                    </Progress>
                </YStack>
                <YStack padding="$1" opacity={0.8}>
                    <Text> {progressVal}% Completed </Text>
                </YStack>
            </XStack>
        </>
    )
}
