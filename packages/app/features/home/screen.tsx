import { SizableText, YStack } from '@my/ui'
import { AnimatePresence } from 'tamagui'
import { useState } from 'react'
import { useColorScheme } from 'react-native'
import { resolveMetaAndNavigateToDetails } from 'app/lib/movies/movies'
import { HeadingAndMovies } from 'app/@types/types'
import { MovieCards } from 'app/components/card'
import { HomeTopCarousel } from 'app/components/home-carousel'
import { HeaderComponent, LargeHeaderComponent } from 'app/components/greeting'
import { ScrollViewWithHeaders } from '@codeherence/react-native-header'
import { useMovieDataFromCategories } from 'app/hooks/useMovieDataFromCategory'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Searchbar } from 'app/components/searchbar'

export function HomeScreen() {
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
                        <Searchbar />
                        {trendingToday && (
                            <HomeTopCarousel data={trendingToday} />
                        )}

                        {genre.map(
                            (item, index) =>
                                item.movies && (
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
                                            onPress={
                                                resolveMetaAndNavigateToDetails
                                            }
                                        />
                                    </>
                                )
                        )}
                    </YStack>
                </YStack>
            </ScrollViewWithHeaders>
        </>
    )
}
