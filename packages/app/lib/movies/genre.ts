import { fetcher } from 'app/lib/fetcher/fetcher'
import {
    ApiResponse,
    Base,
    DetailedMovieInfo,
    DetailedSeriesInfo,
    genresReverse,
    ImageDetails,
    Movie,
    MovieCategories,
    SeasonAndEpisode,
    ShowType,
} from 'app/@types/types'

const PREFIX = 'https://api.themoviedb.org/3'
const TRENDING_URI = `${PREFIX}/trending/movie/day?language=en-US`
const MOVIE_GENRES_URI = (id: number | undefined) =>
    id !== undefined
        ? `${PREFIX}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${id}`
        : ''

const MOVIE_DETAILS_URI = (id: number | undefined) =>
    `${PREFIX}/movie/${id!!}?language=en-US`

const SERIES_DETAILS_URI = (id: number | undefined) =>
    `${PREFIX}/tv/${id}?language=en-US`

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

const getTVSeriesDetails = async (id: number) => {
    const uri = SERIES_DETAILS_URI(id)
    const response = (await fetcher(uri)) as DetailedSeriesInfo
    console.log(response)
    return response
}
export const getTVDataAndImages = async (id: number) => {
    const data = await getTVSeriesDetails(id)
    const images = await getShowImagesAndLogo(id, 'show')
    return { data, images }
}
const getShowImagesAndLogo = async (id: number, showType: ShowType) => {
    const ext = '/images?include_image_language=en'
    const uri =
        showType === 'movie'
            ? MOVIE_DETAILS_URI(id).split('?')[0] + ext
            : SERIES_DETAILS_URI(id).split('?')[0] + ext
    console.log(uri)
    const response = (await fetcher(uri)) as ImageDetails
    console.log(response)
    return response
}

export const getSeasonAndEpisodeDetails = async (
    seasonTmdbId: number,
    seasonNumber: number
): Promise<SeasonAndEpisode> => {
    const url = `${PREFIX}tv/${seasonTmdbId}/season/${seasonNumber}?language=en-US`
    const response = (await fetcher(url)) as SeasonAndEpisode
    console.log(response)
    return response
}

export const getMovieDataAndImages = async (id: number) => {
    const data = await getMovieDetails(id)
    const images = await getShowImagesAndLogo(id, 'movie')
    return { data, images }
}

const getMovieDetails = async (
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
