import {
    Button,
    H3,
    H5,
    Paragraph,
    Spinner,
    Tabs,
    TabsContentProps,
    XStack,
    YStack,
} from '@my/ui'
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
import { Dimensions, ImageBackground, ScrollView, View } from 'react-native'
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
    const { setItem: setProgressInfo, getItem: getProgressInfo } = useAsyncStorage(
        `PROGRESS_INFO_${type}_${id}`
    )
    const readItemFromWishlistStorage = async () => {
        const item = await getItem()
        if (item !== null) {
            setWishedlisted(true)
        }
    }

 const getProgress = async () => {
        const progressInfo = await getProgressInfo()
        if (!progressInfo) return
        const res = JSON.parse(progressInfo) as ProgressInfo
        setProgress(res)
    }


    const BadgesUrl: Array<string> = [
        'https://tv.apple.com/assets/badges/MetadataBadge%204K%20OnDark-c90195dae0171c69694b4d7386421ad8.svg',
        'https://tv.apple.com/assets/badges/MetadataBadge%20AD%20OnDark-4731d380509cdd9c3e59e73cb9dc09d5.svg',
        'https://tv.apple.com/assets/badges/MetadataBadge%20SDH%20OnDark-45f29ce5e07128bf67d924a31a003cf3.svg',
        'https://tv.apple.com/assets/badges/MetadataBadge%20CC%20OnDark-7b5b00df263bfee5af843510f708c307.svg',
        // 'https://tv.apple.com/assets/badges/MetadataBadge%20Atmos%20OnDark-007278edac4076aaf1bc01dedf68e3cd.svg',
        // 'https://tv.apple.com/assets/badges/MetadataBadge%20Dolby%20OnDark-2c6afeb5b02b2c48655606bd9d178bfd.svg',
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
            return `Play S${info!!.season.number} E${info!!.episode.number}`
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
                episode: info!!.episode,
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

    return (
        <ScrollView>
            <YStack f={1} space pb="$8">
                {movieData === null && (
                    <>
                        <Spinner alignSelf={'center'} size="large" />
                    </>
                )}
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
                                            maskImage:
                                                'linear-gradient(to bottom,transparent,rgba(0,0,0,.068) 3.3%,rgba(0,0,0,.145) 5.9%,rgba(0,0,0,.227) 8.1%,rgba(0,0,0,.313) 10.1%,rgba(0,0,0,.401) 12.1%,rgba(0,0,0,.49) 14.6%,rgba(0,0,0,.578) 17.7%,rgba(0,0,0,.661) 21.8%,rgba(0,0,0,.74) 27.1%,rgba(0,0,0,.812) 33.9%,rgba(0,0,0,.875) 42.4%,rgba(0,0,0,.927) 53%,rgba(0,0,0,.966) 66%,rgba(0,0,0,.991) 81.5%,rgba(0,0,0,.991) 100%)',
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
                            <H3 fontWeight="bold" m="$4" fontFamily="System">
                                {movieData?.title ?? movieData.name}
                            </H3>
                        )}

                        <Button
                            mt="$2"
                            fontFamily="System"
                            icon={Play}
                            width={'80%'}
                            alignSelf="center"
                            style={{ textTransform: 'uppercase' }}
                            onPress={() =>
                                getMetaAndPlay(
                                    movieData?.title ?? movieData.name
                                )
                            }
                        >
                            {playButtonText()}
                        </Button>
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
                                    fontFamily="System"
                                    size="$2"
                                    theme={'alt1'}
                                    style={{ textTransform: 'uppercase' }}
                                >
                                    Watchlist
                                </SizableText>
                            </YStack>
                            <YStack alignItems="center" padding="$2">
                                <Download size={20} theme="alt1" />
                                <SizableText
                                    size="$2"
                                    style={{ textTransform: 'uppercase' }}
                                    fontFamily="System"
                                    theme={'alt1'}
                                >
                                    Download
                                </SizableText>
                            </YStack>
                        </XStack>
                        <Separator />
                        <Paragraph m="$4" fontFamily="System" fontSize={18}>
                            {showMore
                                ? movieData.overview
                                : movieData.overview.slice(0, 100)}
                            {}
                            <SizableText
                                onPress={() => setShowMore(!showMore)}
                                fontFamily="System"
                                theme={'alt1'}
                                fontSize={18}
                            >
                                ...{showMore ? 'less' : 'more'}
                            </SizableText>
                        </Paragraph>
                        <TabsAdvancedUnderline />

                        {/*<HorizontalTabs />*/}
                        {/*<TabsAdvancedUnderline />*/}
                    </>
                )}
            </YStack>
            <PlayerWrapper
                data={data}
                loading={loading}
                id={id!!}
                mediaType={type}
            />
        </ScrollView>
    )
}

function ExtraInfo(movieData) {
    return (
        <XStack
            flex={1}
            style={{
                fontSize: 18,
                opacity: 0.8,
            }}
            alignSelf="center"
        >
            <>
                <SizableText fontFamily="System">
                    {movieData.release_date?.split('-')[0] ??
                        movieData.seasons[0]!!.air_date?.split('-')[0]}
                </SizableText>
                <SizableText theme={'alt1'} fontFamily="System">
                    {''} • {''}
                </SizableText>

                <SizableText fontSize={18} fontFamily="System">
                    {movieData?.runtime !== undefined
                        ? convertMinutesToHours(movieData.runtime)
                        : `${movieData?.number_of_seasons} Seasons`}
                </SizableText>

                <SizableText theme={'alt1'} fontSize={18} fontFamily="System">
                    {''} • {''}
                </SizableText>
                {movieData.genres.map((item, index) => {
                    return (
                        // return only first 3 genres
                        index < 2 && (
                            <>
                                <SizableText
                                    key={index}
                                    fontSize={18}
                                    fontFamily="System"
                                >
                                    {item.name}
                                </SizableText>
                                {index !== 1 && (
                                    <SizableText
                                        theme={'alt1'}
                                        fontSize={18}
                                        fontFamily="System"
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
    )
}

const TabsAdvancedUnderline = () => {
    const [tabState, setTabState] = useState<{
        currentTab: string
        /**
         * Layout of the Tab user might intend to select (hovering / focusing)
         */
        intentAt: TabLayout | null
        /**
         * Layout of the Tab user selected
         */
        activeAt: TabLayout | null
        /**
         * Used to get the direction of activation for animating the active indicator
         */
        prevActiveAt: TabLayout | null
    }>({
        activeAt: null,
        currentTab: 'tab1',
        intentAt: null,
        prevActiveAt: null,
    })

    const setCurrentTab = (currentTab: string) =>
        setTabState({ ...tabState, currentTab })
    const setIntentIndicator = intentAt =>
        setTabState({ ...tabState, intentAt })
    const setActiveIndicator = activeAt =>
        setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })
    const { activeAt, intentAt, prevActiveAt, currentTab } = tabState

    /**
     * -1: from left
     *  0: n/a
     *  1: from right
     */
    const direction = (() => {
        if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
            return 0
        }
        return activeAt.x > prevActiveAt.x ? -1 : 1
    })()

    const enterVariant =
        direction === 1
            ? 'isLeft'
            : direction === -1
            ? 'isRight'
            : 'defaultFade'
    const exitVariant =
        direction === 1
            ? 'isRight'
            : direction === -1
            ? 'isLeft'
            : 'defaultFade'

    const handleOnInteraction: TabsTabProps['onInteraction'] = (
        type,
        layout
    ) => {
        if (type === 'select') {
            setActiveIndicator(layout)
        } else {
            setIntentIndicator(layout)
        }
    }

    return (
        <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            orientation="horizontal"
            size="$4"
            height={150}
            flexDirection="column"
            backgroundColor="transparent"
            borderRadius="$4"
        >
            <YStack>
                <AnimatePresence>
                    {intentAt && (
                        <TabsRovingIndicator
                            width={intentAt.width}
                            height="$0.5"
                            x={intentAt.x}
                            bottom={0}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {activeAt && (
                        <TabsRovingIndicator
                            theme="active"
                            active
                            width={activeAt.width}
                            height="$0.5"
                            x={activeAt.x}
                            bottom={0}
                        />
                    )}
                </AnimatePresence>
                <Tabs.List
                    disablePassBorderRadius
                    loop={false}
                    aria-label="Manage your account"
                    borderBottomLeftRadius={0}
                    borderBottomRightRadius={0}
                    paddingBottom="$1.5"
                    borderColor="$color3"
                    borderBottomWidth="$0.5"
                    backgroundColor="transparent"
                >
                    <Tabs.Tab
                        unstyled
                        padding="$5"
                        transparent
                        value="tab1"
                        onInteraction={handleOnInteraction}
                        flex={1}
                        justifyContent="center"
                    >
                        <H3 style={{ color: 'white', opacity: 1 }}>
                            SUGGESTED
                        </H3>
                    </Tabs.Tab>
                    <Tabs.Tab
                        unstyled
                        padding="$5"
                        value="tab2"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText>DETAILS</SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab
                        unstyled
                        padding="$5"
                        value="tab3"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText>Notifications</SizableText>
                    </Tabs.Tab>
                </Tabs.List>
            </YStack>

            <AnimatePresence
                exitBeforeEnter
                enterVariant={enterVariant}
                exitVariant={exitVariant}
            >
                <AnimatedYStack
                    key={currentTab}
                    animation="100ms"
                    x={0}
                    opacity={1}
                    flex={1}
                >
                    <Tabs.Content
                        value={currentTab}
                        forceMount
                        flex={1}
                        justifyContent="center"
                    >
                        <H5 textAlign="center">{currentTab}</H5>
                    </Tabs.Content>
                </AnimatedYStack>
            </AnimatePresence>
        </Tabs>
    )
}

const TabsRovingIndicator = ({
    active,
    ...props
}: { active?: boolean } & StackProps) => {
    return (
        <YStack
            position="absolute"
            backgroundColor="$color5"
            opacity={0.7}
            animation="100ms"
            enterStyle={{
                opacity: 0,
            }}
            exitStyle={{
                opacity: 0,
            }}
            {...(active && { backgroundColor: '$color8', opacity: 0.6 })}
            {...props}
        />
    )
}

const AnimatedYStack = styled(YStack, {
    variants: {
        isLeft: { true: { x: -25, opacity: 0 } },
        isRight: { true: { x: 25, opacity: 0 } },
        defaultFade: { true: { opacity: 0 } },
    } as const,
})
