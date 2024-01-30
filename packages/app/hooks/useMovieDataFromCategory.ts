import { useEffect, useState } from 'react'
import { Base } from 'app/@types/types'
import { getMovieByCategory, getTVByCategory } from 'app/lib/movies/genre'

type MovieData = {
    trendingToday: Array<Base> | null
    trendingSeriesToday: Array<Base> | null
    trendingWeekly: Array<Base> | null
    adventureMovies: Array<Base> | null
    comedyMovies: Array<Base> | null
    animationMovies: Array<Base> | null
    dramaMovies: Array<Base> | null
    documentaryMovies: Array<Base> | null
}

export function useMovieDataFromCategories() {
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
    } as MovieData)

    // const [trendingToday, setTrendingToday] = useState<Array<Base> | null>(null)
    // const [trendingSeriesToday, setTrendingSeriesToday] =
    //     useState<Array<Base> | null>(null)
    // const [trendingWeekly, setTrendingWeekly] = useState<Array<Base> | null>(
    //     null
    // )
    // const [adventureMovies, setAdventureMovies] = useState<Array<Base> | null>(
    //     null
    // )
    // const [comedyMovies, setComedyMovies] = useState<Array<Base> | null>(null)
    // const [animationMovies, setAnimationMovies] = useState<Array<Base> | null>(
    //     null
    // )

    // const [dramaMovies, setDramaMovies] = useState<Array<Base> | null>(null)
    // const [documentaryMovies, setDocumentaryMovies] =
    //     useState<Array<Base> | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const trendingToday = await getMovieByCategory('TRENDING')
                // setTrendingToday(trendingToday)

                const data = await Promise.all([
                    getMovieByCategory('TRENDING'),
                    getTVByCategory(),
                    getMovieByCategory('ACTION'),
                    getMovieByCategory('ADVENTURE'),
                    getMovieByCategory('DOCUMENTARY'),
                    getMovieByCategory('DRAMA'),
                    getMovieByCategory('COMEDY'),
                    getMovieByCategory('ANIMATION'),
                ])

                setMovieData({
                    trendingToday: data[0],
                    trendingSeriesToday: data[1],
                    trendingWeekly: data[2],
                    adventureMovies: data[3],
                    comedyMovies: data[4],
                    animationMovies: data[5],
                    dramaMovies: data[6],
                    documentaryMovies: data[7],
                })

                setIsLoading(false)

                // const trendingSeriesToday = await getTVByCategory()
                // setTrendingSeriesToday(trendingSeriesToday)

                // const weeklyTrending = await getMovieByCategory('ACTION')
                // setTrendingWeekly(weeklyTrending)

                // const adventure = await getMovieByCategory('ADVENTURE')
                // setAdventureMovies(adventure)

                // const documentaries = await getMovieByCategory('DOCUMENTARY')
                // setDocumentaryMovies(documentaries)

                // const drama = await getMovieByCategory('DRAMA')
                // setDramaMovies(drama)

                // const comedy = await getMovieByCategory('COMEDY')
                // setComedyMovies(comedy)

                // const animation = await getMovieByCategory('ANIMATION')
                // setAnimationMovies(animation)
                // setIsLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error)
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    return {
        isLoading,
        ...movieData,
        // trendingToday,
        // trendingWeekly,
        // adventureMovies,
        // comedyMovies,
        // animationMovies,
        // dramaMovies,
        // documentaryMovies,
        // trendingSeriesToday,
    }
}
