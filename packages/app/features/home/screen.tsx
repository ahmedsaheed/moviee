import {
    Anchor,
    Button,
    H1,
    Input,
    Paragraph,
    ScrollView,
    Separator,
    Sheet,
    SizableText,
    Spinner,
    useToastController,
    XStack,
    YStack,
} from '@my/ui'
import {
    makeProviders,
    makeStandardFetcher,
    RunOutput,
    ScrapeMedia,
    targets,
} from '@movie-web/providers'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useLink } from 'solito/link'
import { getMoviesMetadata, retrieveFromProvider } from 'app/lib/movies/movies'
import { Base, BaseMovieInfo } from 'app/@types/types'
import { getMovieByCategory } from 'app/lib/movies/trending'
import { Cards } from 'app/components/card'
import { PlayerWrapper, VideoPlayer } from 'app/components/av'

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
    const [documentaryMovies, setDocumentaryMovies] =
        useState<Array<Base> | null>(null)
    const linkProps = useLink({
        href: '/user/nate',
    })

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

    return (
        <YStack f={1} p="$4" space>
            <ScrollView>
                <YStack space="$4" maw={600}>
                    <Input
                        size="$4"
                        borderWidth={2}
                        onChangeText={text => setSearchQuery(text)}
                        placeholder="Search for a movie..."
                        onSubmitEditing={async () =>
                            await getMetaAndPlay(searchQuery)
                        }
                    />
                    {trendingToday && (
                        <>
                            <SizableText
                                theme="alt2"
                                size="$1"
                                fontWeight={600}
                            >
                                {' '}
                                Trending today
                            </SizableText>
                            <MovieCards
                                movies={trendingToday}
                                onPress={getMetaAndPlay}
                            />
                            <SizableText
                                theme="alt2"
                                size="$1"
                                fontWeight={600}
                                p={2}
                            >
                                {' '}
                                Action Movies
                            </SizableText>
                            <MovieCards
                                movies={trendingWeekly}
                                onPress={getMetaAndPlay}
                            />

                            <SizableText
                                theme="alt2"
                                size="$1"
                                fontWeight={600}
                                p={2}
                            >
                                {' '}
                                Adventure Movies
                            </SizableText>
                            <MovieCards
                                movies={adventureMovies}
                                onPress={getMetaAndPlay}
                            />

                            <SizableText
                                theme="alt2"
                                size="$1"
                                fontWeight={600}
                                p={2}
                            >
                                {' '}
                                Documentaries Movies
                            </SizableText>
                            <MovieCards
                                movies={documentaryMovies}
                                onPress={getMetaAndPlay}
                            />
                        </>
                    )}
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
            </ScrollView>
        </YStack>
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

function MovieCards(
    props:
        | { movies: Array<Base> | null; onPress: (movieName: string) => void }
        | undefined
) {
    if (!props) {
        return null
    }
    const { movies, onPress } = props
    return (
        <ScrollView horizontal={true}>
            <XStack $sm={{ flexDirection: 'row' }} paddingHorizontal="$1" space>
                {movies?.map((movie, index) => (
                    <Cards
                        animation="bouncy"
                        size="$4"
                        width={100}
                        height={140}
                        scale={0.9}
                        hoverStyle={{ scale: 0.925 }}
                        pressStyle={{ scale: 0.875 }}
                        imageUrl={movie.imageUrl}
                        key={index}
                        onPress={() => onPress(movie.title)}
                        releaseYear={movie.releaseYear}
                        title={movie.title}
                        tmdbId={movie.tmdbId}
                    />
                ))}
            </XStack>
        </ScrollView>
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
