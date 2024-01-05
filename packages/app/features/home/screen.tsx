import {
    Button,
    Separator,
    Sheet,
    SizableText,
    useToastController,
    YStack,
} from '@my/ui'
import { RunOutput, ScrapeMedia } from '@movie-web/providers'
import { AnimatePresence } from 'tamagui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { getMoviesMetadata, retrieveFromProvider } from 'app/lib/movies/movies'
import { Base, HeadingAndMovies } from 'app/@types/types'
import { getMovieByCategory } from 'app/lib/movies/genre'
import { Cards, MovieCards } from 'app/components/card'
import { PlayerWrapper, VideoPlayer } from 'app/components/av'
import { HomeTopCarousel } from 'app/components/home-carousel'
import { HeaderComponent, LargeHeaderComponent } from 'app/components/greeting'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollViewWithHeaders } from '@codeherence/react-native-header'
import { SearchBar } from '@rneui/themed'
import { Search, X } from '@tamagui/lucide-icons'
import { useColorScheme } from 'react-native'
export function HomeScreen() {
    const [data, setData] = useState<RunOutput | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [media, setMedia] = useState<ScrapeMedia | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [trendingToday, setTrendingToday] = useState<Array<Base> | null>(null)
    const [trendingWeekly, setTrendingWeekly] = useState<Array<Base> | null>(
        null
    )
    const [adventureMovies, setAdventureMovies] = useState<Array<Base> | null>(
        null
    )
    const [comedyMovies, setComedyMovies] = useState<Array<Base> | null>(null)
    const [animationMovies, setAnimationMovies] = useState<Array<Base> | null>(
        null
    )

    const [dramaMovies, setDramaMovies] = useState<Array<Base> | null>(null)
    const [documentaryMovies, setDocumentaryMovies] =
        useState<Array<Base> | null>(null)
    const { bottom } = useSafeAreaInsets()
    const scheme = useColorScheme()
    useEffect(() => {
        const trendingToday = async () => await getMovieByCategory('TRENDING')
        trendingToday().then(out => {
            console.log('out', out)
            setTrendingToday(out)
        })
        const weeklyTrending = async () => await getMovieByCategory('ACTION')
        weeklyTrending().then(out => {
            console.log('out', out)
            setTrendingWeekly(out)
        })

        const adventure = async () => await getMovieByCategory('ADVENTURE')
        adventure().then(out => {
            console.log('out', out)
            setAdventureMovies(out)
        })

        const documentaries = async () =>
            await getMovieByCategory('DOCUMENTARY')
        documentaries().then(out => {
            console.log('out', out)
            setDocumentaryMovies(out)
        })

        const drama = async () => await getMovieByCategory('DRAMA')
        drama().then(out => {
            console.log('out', out)
            setDramaMovies(out)
        })

        const comedy = async () => await getMovieByCategory('COMEDY')
        comedy().then(out => {
            console.log('out', out)
            setComedyMovies(out)
        })

        const animation = async () => await getMovieByCategory('ANIMATION')
        animation().then(out => {
            console.log('out', out)
            setAnimationMovies(out)
        })
    }, [])

    async function getMetaAndPlay(movieName: string) {
        setLoading(true)
        const res = await getMoviesMetadata(movieName)
        setSearchQuery('')
        if (res && res !== media) {
            setLoading(false)
            setMedia(res)
        }
        setLoading(false)
        console.log('res', res)
    }

    useEffect(() => {
        const out = async () => await retrieveFromProvider(media)
        setLoading(true)
        out().then(out => {
            console.log('out', out)
            setData(out)
        })
        setLoading(false)
    }, [media])

    const genre: HeadingAndMovies[] = [
        {
            heading: 'Trending Today',
            movies: trendingToday,
        },
        {
            heading: 'Action Movies',
            movies: trendingWeekly,
        },
        {
            heading: 'Comedy Movies',
            movies: comedyMovies,
        },
        {
            heading: 'Adventure Movies',
            movies: adventureMovies,
        },
        {
            heading: 'Drama Movies',
            movies: dramaMovies,
        },
        {
            heading: 'Documentary Movies',
            movies: documentaryMovies,
        },

        {
            heading: 'Adult Animation',
            movies: animationMovies,
        },
    ]

    return (
        <>
            <ScrollViewWithHeaders
                HeaderComponent={HeaderComponent}
                LargeHeaderComponent={LargeHeaderComponent}
                contentContainerStyle={{ paddingBottom: bottom }}
            >
                <YStack f={1} p="$2" space>
                    <YStack space="$2" pt={'4'} pb={'6'} maw={600}>
                        <SearchBar
                            ref={search => (this.search = search)}
                            onChangeText={text => setSearchQuery(text)}
                            value={searchQuery}
                            placeholder="Search Shows and Movies"
                            platform="ios"
                            lightTheme={false}
                            searchIcon={<Search size="$1" color="grey" />}
                            clearIcon={null}
                            showCancel={false}
                            containerStyle={{
                                backgroundColor: 'transparent',
                                borderWidth: 0,
                                padding: 0,
                                margin: 0,
                                paddingTop: 0,
                            }}
                            onSubmitEditing={async () =>
                                await getMetaAndPlay(searchQuery)
                            }
                            pt={'$0'}
                            showClearIcon={false}
                            inputContainerStyle={
                                scheme === 'dark'
                                    ? { backgroundColor: '#1c1c1c' }
                                    : {}
                            }
                            inputStyle={
                                scheme === 'dark'
                                    ? {
                                          color: 'grey',
                                          fontWeight: 'normal',
                                          fontSize: 16,
                                          fontFamily: 'System',
                                      }
                                    : {
                                          fontSize: 16,

                                          fontWeight: 'normal',
                                          fontFamily: 'System',
                                      }
                            }
                        />
                        {trendingToday && (
                            <HomeTopCarousel data={trendingToday} />
                        )}

                        {genre.map((item, index) => (
                            <AnimatePresence key={index}>
                                {item.movies && (
                                    <>
                                        <SizableText
                                            theme="alt1"
                                            size="$1"
                                            fontFamily={'System'}
                                            fontWeight="bold"
                                            p={2}
                                            enterStyle={{
                                                opacity: 0,
                                                y: 10,
                                                scale: 0.9,
                                            }}
                                            exitStyle={{
                                                opacity: 0,
                                                y: -10,
                                                scale: 0.9,
                                            }}
                                        >
                                            {' '}
                                            {item.heading}
                                        </SizableText>
                                        <MovieCards
                                            movies={item.movies}
                                            onPress={getMetaAndPlay}
                                        />
                                    </>
                                )}
                            </AnimatePresence>
                        ))}
                        <Separator />

                        <PlayerWrapper
                            data={data}
                            searchQuery={searchQuery}
                            loading={loading}
                        />
                    </YStack>

                    {/*<XStack>*/}
                    {/*    <Button {...linkProps}>Link to user</Button>*/}
                    {/*</XStack>*/}

                    {/*<SheetDemo />*/}
                </YStack>
            </ScrollViewWithHeaders>
        </>
    )
}

function SheetDemo() {
    const [open, setOpen] = useState(false)
    const [position, setPosition] = useState(0)
    const toast = useToastController()

    return (
        <>
            <Button
                size="$6"
                icon={open ? ChevronDown : ChevronUp}
                circular
                onPress={() => setOpen(x => !x)}
            />
            <Sheet
                modal
                animation="medium"
                open={open}
                onOpenChange={setOpen}
                snapPoints={[80]}
                position={position}
                onPositionChange={setPosition}
                dismissOnSnapToBottom
            >
                <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame ai="center" jc="center">
                    <Sheet.Handle />
                    <Button
                        size="$6"
                        circular
                        icon={ChevronDown}
                        onPress={() => {
                            setOpen(false)
                            toast.show('Sheet closed!', {
                                message: 'Just showing how toast works...',
                            })
                        }}
                    />
                </Sheet.Frame>
            </Sheet>
        </>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
