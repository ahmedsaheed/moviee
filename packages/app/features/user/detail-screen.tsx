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
    Download,
    Film,
    MoreVertical,
    Play,
    Plus,
    Check,
} from '@tamagui/lucide-icons'
import { getMoviesMetadata, retrieveFromProvider } from 'app/lib/movies/movies'
import { PlayerWrapper } from 'app/components/av'
import { CannotPlayMovieDialog, convertMinutesToHours } from 'app/utils'
import { TabsAdvancedUnderline } from 'app/components/tabs'
import { ShowType } from 'app/@types/types'

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
    console.log('params', id, type)
    const { data: movieData, images } = useMovieData(type, Number(id!!))

    const { setItem, getItem } = useAsyncStorage(`WATCHLIST_${id}`)
    const readItemFromStorage = async () => {
        const item = await getItem()
        if (item !== null) {
            setWishedlisted(true)
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

    async function getMetaAndPlay(movieName: string) {
        setLoading(true)
        const res = await getMoviesMetadata(movieName)
        if (res?.type === 'show' && res && res !== media) {
            const media: ScrapeMedia = {
                ...res,
                //TODO: use a hook to retrieve the episode and season from id
                /*
                episode: {
                    number: 1,
                    tmdbId: '770993',
                },
                season: {
                    number: 1,
                    tmdbId: '44098',
                },
                */
            }
            console.log('series', media)
            setLoading(false)
            setMedia(media)
        } else {
            if (res && res !== media) {
                setLoading(false)
                setMedia(res)
            }
        }
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
                                    height: height / 1.8,
                                    alignItems: 'center',
                                    position: 'relative',
                                }}
                                resizeMode="cover"
                            >
                                {images?.logos[0] !== undefined && (
                                    <Image
                                        source={{
                                            uri: `https://image.tmdb.org/t/p/original/${images?.logos[0].file_path}`,
                                        }}
                                        width="100%"
                                        height={100}
                                        resizeMode="contain"
                                        bottom={0}
                                        position="absolute"
                                    />
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
                                    movieData?.title ?? movieData.original_name
                                )
                            }
                        >
                            {loading ? 'Loading..' : 'Play Movie'}
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
                                        movieData?.seasons[0].air_date?.split(
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
