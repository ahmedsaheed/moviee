import { fetcher } from 'app/lib/fetcher/fetcher'
import {
    ApiResponse,
    Base,
    genresReverse,
    Movie,
    MovieCategories,
} from 'app/@types/types'

const TRENDING_URI =
    'https://api.themoviedb.org/3/trending/movie/day?language=en-US'

const MOVIE_GENRES_URI = (id: number | undefined) =>
    id !== undefined
        ? `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${id}`
        : ''

const getUriFromCategory = (category: MovieCategories): string => {
    const genreID = genresReverse[category]
    if (category === 'TRENDING') return TRENDING_URI
    return MOVIE_GENRES_URI(genreID)
}

export const getMovieByCategory = async (
    category: MovieCategories
): Promise<Array<Base> | null> => {
    const uri = getUriFromCategory(category)
    const response = (await fetcher(uri)) as ApiResponse
    const data = response.results
    if (!data) return null
    return data.map(movie => {
        return extractToBase(movie)
    })
}
function extractToBase(movie: Movie): Base {
    return {
        imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        title: movie.title,
        tmdbId: movie.id,
        releaseYear: movie.release_date.split('-')[0]!!,
        backdropUrl: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
    }
}
