import { SizableText, Spinner, View, YStack } from '@my/ui'
import { resolveMetaAndNavigateToDetails } from 'app/lib/movies/movies'
import { HeadingAndMovies } from 'app/@types/types'
import { MovieCards } from 'app/components/card'
import { HomeTopCarousel } from 'app/components/home-carousel'
import { HeaderComponent, LargeHeaderComponent } from 'app/components/greeting'
import { ScrollViewWithHeaders } from '@codeherence/react-native-header'
import { useMovieDataFromCategories } from 'app/hooks/useMovieDataFromCategory'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

export function HomeScreen() {
    const {
        trendingToday,
        trendingWeekly,
        adventureMovies,
        comedyMovies,
        animationMovies,
        dramaMovies,
        documentaryMovies,
        trendingSeriesToday,
        isLoading,
    } = useMovieDataFromCategories()

    const bottomTabBarHeight = useBottomTabBarHeight()
    const genre: HeadingAndMovies[] = [
        {
            heading: 'Trending Today',
            movies: trendingToday,
        },
        {
            heading: 'Bingeable Series',
            movies: trendingSeriesToday,
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
        <YStack style={{ paddingBottom: bottomTabBarHeight, height: '100%' }}>
            <ScrollViewWithHeaders
                showsVerticalScrollIndicator={false}
                HeaderComponent={HeaderComponent}
                LargeHeaderComponent={LargeHeaderComponent}
                contentContainerStyle={{}}
            >
                <YStack f={1} p="$2" space>
                    <YStack space="$2" pt={'4'} pb={'6'} maw={600}>
                        {isLoading ? (
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
                        ) : (
                            <>
                                <HomeTopCarousel data={trendingToday} />
                                {genre.map(
                                    (item, index) =>
                                        item.movies && (
                                            <>
                                                <SizableText
                                                    theme="alt1"
                                                    size="$1"
                                                    style={{
                                                        fontFamily: 'System',
                                                    }}
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
                            </>
                        )}
                    </YStack>
                </YStack>
            </ScrollViewWithHeaders>
        </YStack>
    )
}
