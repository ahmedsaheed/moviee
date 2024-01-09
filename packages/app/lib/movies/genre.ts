import { fetcher } from 'app/lib/fetcher/fetcher'
import {
    ApiResponse,
    Base,
    DetailedMovieInfo,
    genresReverse,
    ImageDetails,
    Movie,
    MovieCategories,
} from 'app/@types/types'

const TRENDING_URI =
    'https://api.themoviedb.org/3/trending/movie/day?language=en-US'

const MOVIE_GENRES_URI = (id: number | undefined) =>
    id !== undefined
        ? `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${id}`
        : ''

const MOVIE_DETAILS_URI = (id: number | undefined) =>
    `https://api.themoviedb.org/3/movie/${id!!}?language=en-US`

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
    const data = response.results as Movie[]
    if (!data) return null
    return data?.map(movie => {
        return extractToBase(movie)
    })
}

export const getMovieImagesAndLogo = async (id: number) => {
    const uri =
        MOVIE_DETAILS_URI(id).split('?')[0] +
        '/images?include_image_language=en'
    console.log(uri)
    const response = (await fetcher(uri)) as ImageDetails
    console.log(response)
    return response
}

export const getMovieDataAndImages = async (id: number) => {
    const data = await getMovieDetails(id)
    const images = await getMovieImagesAndLogo(id)
    return { data, images }
}

export const getMovieDetails = async (
    id: number
): Promise<DetailedMovieInfo | null> => {
    const uri = MOVIE_DETAILS_URI(id)
    console.log(uri)
    const response = (await fetcher(uri)) as DetailedMovieInfo
    return response ?? null
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
