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
import { Image, Separator, SizableText } from 'tamagui'
import { useEffect, useState } from 'react'
import { RunOutput, ScrapeMedia } from '@movie-web/providers'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { useMovieData } from 'app/hooks/useMovieData'
import { Dimensions, ImageBackground, ScrollView, View } from 'react-native'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import {
    Check,
    Download,
    Film,
    MoreVertical,
    Play,
    Plus,
    ChevronLeft,
    Share,
} from '@tamagui/lucide-icons'
import { getMoviesMetadata, retrieveFromProvider } from 'app/lib/movies/movies'
import { PlayerWrapper } from 'app/components/av'
import { CannotPlayMovieDialog, convertMinutesToHours } from 'app/utils'
import { ShowType } from 'app/@types/types'
import { useSeasonsAndEpisodes } from 'app/hooks/useSeasonsAndEpisodes'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'

const { useParam } = createParam<{ id: string; type: string }>()

export function UserDetailScreen() {
    const [media, setMedia] = useState<ScrapeMedia | null>(null)
    const [data, setData] = useState<RunOutput | null>(null)
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const [wishedlisted, setWishedlisted] = useState(false)
    const [id] = useParam('id')
    const [type] = useParam('type') as unknown as [ShowType]

    const link = useLink({
        href: '/',
    })
    const { height } = Dimensions.get('window')
    const { data: movieData, images } = useMovieData(type, Number(id!!))
    const info = useSeasonsAndEpisodes(type, Number(id!!))
    const { setItem, getItem, removeItem } = useAsyncStorage(`WATCHLIST_${id}`)
    const readItemFromStorage = async () => {
        const item = await getItem()
        if (item !== null) {
            setWishedlisted(true)
        }
    }

    const removeItemFromStorage = async () => {
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
        readItemFromStorage()
    }, [])
    function playButtonText() {
        if (loading) {
            return 'Loading...'
        }
        if (type === 'movie') {
            return 'Play Movie'
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
                                    uri: `https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`,
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
                                    padding="$2"
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
                                                    removeItemFromStorage()
                                                }
                                            />
                                        )}
                                    </BlurView>
                                </XStack>
                                {images?.logos[0] !== undefined && (
                                    // <Image
                                    //     source={{
                                    //         uri: `https://image.tmdb.org/t/p/original/${images?.logos[0].file_path}`,
                                    //     }}
                                    //     width="100%"
                                    //     height={100}
                                    //     resizeMode="contain"
                                    //     bottom={0}
                                    //     position="absolute"
                                    // />
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
                                            //fade top of blur
                                        }}
                                    >
                                        <Image
                                            source={{
                                                uri: `https://image.tmdb.org/t/p/original/${images?.logos[0].file_path}`,
                                            }}
                                            width="100%"
                                            height={100}
                                            resizeMode="contain"
                                            bottom={5}
                                            position="absolute"

                                            // px="$8"
                                        />
                                    </BlurView>
                                )}
                            </ImageBackground>
                        </View>

                        {images?.logos[0] === undefined && (
                            <H3 fontWeight={900} m="$4" fontFamily="System">
                                {movieData?.title ?? movieData.name}
                            </H3>
                        )}

                        <Button
                            mt="$2"
                            fontFamily="System"
                            icon={Play}
                            width={'80%'}
                            alignSelf="center"
                            onPress={() =>
                                getMetaAndPlay(
                                    movieData?.title ?? movieData.name
                                )
                            }
                        >
                            {playButtonText()}
                        </Button>
                        <Button
                            mt="$2"
                            alignSelf="center"
                            fontFamily="System"
                            {...link}
                            icon={Download}
                            width={'80%'}
                        >
                            Download
                        </Button>

                        <XStack
                            flex={1}
                            space="$8"
                            borderWidth={2}
                            borderColor="transparent"
                            padding="$2"
                            alignSelf="center"
                        >
                            <YStack alignItems="center" padding="$2">
                                <Film size={20} theme="alt1" />
                                <SizableText fontFamily="System" theme={'alt1'}>
                                    Trailer
                                </SizableText>
                            </YStack>
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

                                <SizableText fontFamily="System" theme={'alt1'}>
                                    Watchlist
                                </SizableText>
                            </YStack>
                            <YStack alignItems="center" padding="$2">
                                <MoreVertical size={20} theme="alt1" />
                                <SizableText fontFamily="System" theme={'alt1'}>
                                    More
                                </SizableText>
                            </YStack>
                        </XStack>
                        <Separator />
                        <Paragraph m="$4" fontFamily="System" fontSize={18}>
                            {showMore
                                ? movieData.overview
                                : movieData.overview.slice(0, 100)}
                            <SizableText
                                onPress={() => setShowMore(!showMore)}
                                fontFamily="System"
                                theme={'alt1'}
                                fontSize={18}
                            >
                                ...{showMore ? 'less' : 'more'}
                            </SizableText>
                        </Paragraph>

                        <XStack flex={1} m="$4">
                            <>
                                {movieData.genres.map((item, index) => {
                                    return (
                                        <>
                                            <SizableText
                                                key={index}
                                                theme={'alt1'}
                                                fontSize={18}
                                                fontFamily="System"
                                            >
                                                {item.name}
                                            </SizableText>
                                            <Separator
                                                alignSelf="stretch"
                                                vertical
                                                marginHorizontal={5}
                                            />
                                        </>
                                    )
                                })}
                                <SizableText
                                    theme={'alt1'}
                                    fontSize={18}
                                    fontFamily="System"
                                >
                                    {movieData.release_date?.split('-')[0] ??
                                        movieData.seasons[0]!!.air_date.split(
                                            '-'
                                        )[0]}
                                </SizableText>
                                <Separator
                                    alignSelf="stretch"
                                    vertical
                                    marginHorizontal={5}
                                />
                                <SizableText
                                    theme={'alt1'}
                                    fontSize={18}
                                    fontFamily="System"
                                >
                                    {movieData?.runtime !== undefined
                                        ? convertMinutesToHours(
                                              movieData.runtime
                                          )
                                        : `${movieData?.number_of_seasons} Seasons`}
                                </SizableText>
                            </>
                        </XStack>
                        {/*<HorizontalTabs />*/}
                        {/*<TabsAdvancedUnderline /> */}
                    </>
                )}
            </YStack>
            <PlayerWrapper data={data} loading={loading} />
        </ScrollView>
    )
}

const HorizontalTabs = () => {
    return (
        <Tabs
            defaultValue="tab1"
            orientation="horizontal"
            flexDirection="column"
            width={'100%'}
            height={150}
            borderRadius="$4"
            borderWidth="$0.25"
            overflow="hidden"
            borderColor="$borderColor"
        >
            <Tabs.List
                separator={<Separator vertical />}
                disablePassBorderRadius="bottom"
                aria-label="Manage your account"
            >
                <Tabs.Tab flex={1} value="tab1">
                    <SizableText fontFamily="$body">Profile</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} value="tab2">
                    <SizableText fontFamily="$body">Connections</SizableText>
                </Tabs.Tab>
            </Tabs.List>
            <Separator />
            <TabsContent value="tab1">
                <H5>Profile</H5>
            </TabsContent>

            <TabsContent value="tab2">
                <H5>Connections</H5>
            </TabsContent>
        </Tabs>
    )
}
const TabsContent = (props: TabsContentProps) => {
    return (
        <Tabs.Content
            backgroundColor="transparent"
            key="tab3"
            padding="$2"
            alignItems="center"
            justifyContent="center"
            flex={1}
            borderColor="none"
            borderRadius="$"
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            borderWidth={0}
            {...props}
        >
            {props.children}
        </Tabs.Content>
    )
}
