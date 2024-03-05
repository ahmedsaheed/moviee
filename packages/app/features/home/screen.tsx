import { SizableText, Spinner, View, YStack } from '@my/ui'
import { resolveMetaAndNavigateToDetails } from 'app/lib/movies/movies'
import { HeadingAndMovies } from 'app/@types/types'
import { MovieCards } from 'app/components/card'
import { HomeTopCarousel } from 'app/components/home-carousel'
import { useMovieDataFromCategories } from 'app/hooks/useMovieDataFromCategory'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { ScrollView } from 'react-native'
import { Stack } from 'expo-router'
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
        currentlyWatching,
        isLoading,
    } = useMovieDataFromCategories()

    const bottomTabBarHeight = useBottomTabBarHeight()

    const genre: HeadingAndMovies[] = [
        {
            heading: 'Bingeable Series',
            movies: trendingSeriesToday,
        },
        {
            heading: 'Currently Watching',
            movies: currentlyWatching,
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
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
        >
            <YStack style={{ height: '100%', paddingBottom: bottomTabBarHeight}}>
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
                                                key={item.heading}
                                                // theme="alt1"
                                                size="$2"
                                                style={{
                                                    fontFamily: 'System',
                                                }}
                                                fontWeight="bold"
                                                px="$1"
                                                py="$2"
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
                                                key={index}
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
        </ScrollView>
    )
}
