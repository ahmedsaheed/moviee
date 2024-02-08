import { useEffect, useState } from 'react'
import { Base } from 'app/@types/types'
import { getMovieByCategory, getTVByCategory } from 'app/lib/movies/genre'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
type MovieData = {
    trendingToday: Array<Base> | null
    trendingSeriesToday: Array<Base> | null
    trendingWeekly: Array<Base> | null
    adventureMovies: Array<Base> | null
    comedyMovies: Array<Base> | null
    animationMovies: Array<Base> | null
    dramaMovies: Array<Base> | null
    documentaryMovies: Array<Base> | null
    currentlyWatching: Array<Base> | null
}

export function useMovieDataFromCategories() {
    const { getItem: getContinueWatching } =
        useAsyncStorage('continue_watching')
    const [isLoading, setIsLoading] = useState(true)
    const [movieData, setMovieData] = useState({
        trendingToday: null,
        trendingSeriesToday: null,
        trendingWeekly: null,
        adventureMovies: null,
        comedyMovies: null,
        animationMovies: null,
        dramaMovies: null,
        documentaryMovies: null,
        currentlyWatching: null,
    } as MovieData)

    const getCurrentlyWatching = async () => {
        try {
            const data = await getContinueWatching()
            if (data) {
                const currentlyWatching = JSON.parse(data) as Array<Base>
                return currentlyWatching
            }
        } catch (error) {
            console.error('Error fetching currently watching:', error)
        }
        return null
    }

    useEffect(() => {
        let isActive = true

        const fetchData = async () => {
            try {
                const data = await Promise.all([
                    getMovieByCategory('TRENDING'),
                    getTVByCategory(),
                    getMovieByCategory('ACTION'),
                    getMovieByCategory('ADVENTURE'),
                    getMovieByCategory('DOCUMENTARY'),
                    getMovieByCategory('DRAMA'),
                    getMovieByCategory('COMEDY'),
                    getMovieByCategory('ANIMATION'),
                    getCurrentlyWatching(),
                ])
                if (isActive) {
                    setMovieData({
                        trendingToday: data[0],
                        trendingSeriesToday: data[1],
                        trendingWeekly: data[2],
                        adventureMovies: data[3],
                        comedyMovies: data[4],
                        animationMovies: data[5],
                        dramaMovies: data[6],
                        documentaryMovies: data[7],
                        currentlyWatching: data[8],
                    })
                    setIsLoading(false)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                setIsLoading(false)
            }
        }
        fetchData()

        return () => {
            isActive = false
        }
    }, [])

    return {
        isLoading,
        ...movieData,
    }
}
