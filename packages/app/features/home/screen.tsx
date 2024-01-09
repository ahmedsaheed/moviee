import { Separator, SizableText, YStack } from '@my/ui'
import { RunOutput, ScrapeMedia } from '@movie-web/providers'
import { AnimatePresence } from 'tamagui'
import { useEffect, useState } from 'react'
import { StyleSheet, useColorScheme } from 'react-native'
import { getMoviesMetadata, retrieveFromProvider } from 'app/lib/movies/movies'
import { HeadingAndMovies } from 'app/@types/types'
import { MovieCards } from 'app/components/card'
import { PlayerWrapper } from 'app/components/av'
import { HomeTopCarousel } from 'app/components/home-carousel'
import { HeaderComponent, LargeHeaderComponent } from 'app/components/greeting'
import { ScrollViewWithHeaders } from '@codeherence/react-native-header'
import { SearchBar } from '@rneui/themed'
import { Search } from '@tamagui/lucide-icons'
import { useMovieDataFromCategories } from 'app/hooks/useMovieDataFromCategory'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
export function HomeScreen() {
    const [data, setData] = useState<RunOutput | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [media, setMedia] = useState<ScrapeMedia | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const {
        trendingToday,
        trendingWeekly,
        adventureMovies,
        comedyMovies,
        animationMovies,
        dramaMovies,
        documentaryMovies,
    } = useMovieDataFromCategories()
    const { bottom } = useSafeAreaInsets()
    const scheme = useColorScheme()

    async function getMetaAndPlay(movieName: string) {
        setLoading(true)
        const res = await getMoviesMetadata(movieName)
        const { tmdbId } = res!!
        if (!tmdbId) return
        router.push(`/user/${tmdbId}`)
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
                            //@ts-ignore
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

                        <PlayerWrapper data={data} loading={loading} />
                    </YStack>
                </YStack>
            </ScrollViewWithHeaders>
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
