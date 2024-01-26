import { useEffect, useState } from 'react'
import { Base } from 'app/@types/types'
import { getMovieByCategory, getTVByCategory } from 'app/lib/movies/genre'

export function useMovieDataFromCategories() {
    const [trendingToday, setTrendingToday] = useState<Array<Base> | null>(null)
    const [trendingSeriesToday, setTrendingSeriesToday] =
        useState<Array<Base> | null>(null)
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
    useEffect(() => {
        const trendingToday = async () => await getMovieByCategory('TRENDING')
        trendingToday().then(out => {
            setTrendingToday(out)
        })

        const trendingSeriesToday = async () => await getTVByCategory()
        trendingSeriesToday().then(out => {
            setTrendingSeriesToday(out)
        })
        const weeklyTrending = async () => await getMovieByCategory('ACTION')
        weeklyTrending().then(out => {
            setTrendingWeekly(out)
        })

        const adventure = async () => await getMovieByCategory('ADVENTURE')
        adventure().then(out => {
            setAdventureMovies(out)
        })

        const documentaries = async () =>
            await getMovieByCategory('DOCUMENTARY')
        documentaries().then(out => {
            setDocumentaryMovies(out)
        })

        const drama = async () => await getMovieByCategory('DRAMA')
        drama().then(out => {
            setDramaMovies(out)
        })

        const comedy = async () => await getMovieByCategory('COMEDY')
        comedy().then(out => {
            setComedyMovies(out)
        })

        const animation = async () => await getMovieByCategory('ANIMATION')
        animation().then(out => {
            setAnimationMovies(out)
        })
    }, [])

    return {
        trendingToday,
        trendingWeekly,
        adventureMovies,
        comedyMovies,
        animationMovies,
        dramaMovies,
        documentaryMovies,
        trendingSeriesToday,
    }
}
