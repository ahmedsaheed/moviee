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
    TvShowAPIResponse,
    TvShowResult,
} from 'app/@types/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PREFIX = 'https://api.themoviedb.org/3'
const TRENDING_URI = (showType: ShowType) =>
    `${PREFIX}/trending/${
        showType === 'show' ? 'tv' : 'movie'
    }/day?language=en-US`
const MOVIE_GENRES_URI = (id: number | undefined) =>
    id !== undefined
        ? `${PREFIX}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${id}`
        : ''

const MOVIE_DETAILS_URI = (id: number | undefined) =>
    `${PREFIX}/movie/${id!!}?language=en-US`

const SERIES_DETAILS_URI = (id: number | undefined) =>
    `${PREFIX}/tv/${id}?language=en-US`

const SIMILAR_MOVIES_URI = (id: number | undefined) =>
    `${PREFIX}/movie/${id}/similar?language=en-US&page=1`

const getUriFromCategory = (category: MovieCategories): string => {
    const genreID = genresReverse[category]
    if (category === 'TRENDING') return TRENDING_URI('movie')
    return MOVIE_GENRES_URI(genreID)
}

export const storeToCache = async (key: string, value: any) => {
    try {
        const now = new Date()
        const time = now.getTime()
        const expireTime = time + 1000 * 60 * 60 * 24
        now.setTime(expireTime)
        const expireDate = now.toUTCString()
        const data = { value, expireDate }
        const jsonValue = JSON.stringify(data)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        console.log(e)
    }
}

export const isCached = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value === null) return { isCached: false }
        const data = JSON.parse(value!!)
        const now = new Date()
        const time = now.getTime()
        const expireDate = new Date(data.expireDate).getTime()
        const isExpired = time > expireDate
        console.log('isExpired', isExpired, time, expireDate)
        if (isExpired) {
            console.log('data expired')
            return { isCached: false }
        }
        return { isCached: true, value: data.value }
    } catch (e) {
        console.error(e)
    }
}

const getTrendingMoviesLogo = async (
    trending: Array<Movie>
): Promise<
    Array<{
        id: number
        logoUri: string | undefined
    }>
> => {
    const logoPromises = trending.map(async movie => {
        const data = await getShowImagesAndLogo(movie.id, 'movie')
        console.log('image from trending', data)
        console.log('trending movies logo not cached: storing data')
        return { id: movie.id, logoUri: data.logos[0]?.file_path }
    })
    const res = await Promise.all(logoPromises)
    console.log('whats in res', res)
    return res
}

export const getMovieByCategory = async (
    category: MovieCategories
): Promise<Array<Base> | null> => {
    const isTrending = category === 'TRENDING'
    const uri = getUriFromCategory(category)
    const cached = await isCached(uri)
    if (cached?.isCached) {
        console.log('cached: returning cached data')
        const data = cached!!.value as Array<Movie>
        const logos = await getTrendingMoviesLogo(data)
        return data?.map(movie => {
            const base = extractToBase(movie)
            if (isTrending) {
                const logo = logos.find(logo => logo.id === movie.id)
                console.log('found logo for id', movie.id, logo?.logoUri)
                base.logoUrl = logo?.logoUri
                return base
            }
            return base
        })
    }
    const response = (await fetcher(uri)) as ApiResponse
    const data = response.results as Movie[]
    const logos = await getTrendingMoviesLogo(data)
    if (!data) return null
    console.log('not cached: storing data')
    storeToCache(uri, data)
    return data?.map(movie => {
        const base = extractToBase(movie)
        if (isTrending) {
            const logo = logos.find(logo => logo.id === movie.id)
            console.log('found logo for id', movie.id, logo?.logoUri)
            base.logoUrl = logo?.logoUri
            return base
        }
        return base
    })
}

export const getSimilarMovies = async (
    id: number
): Promise<Array<Base> | null> => {
    const uri = SIMILAR_MOVIES_URI(id)
    const cached = await isCached(uri)
    if (cached?.isCached) {
        console.log('similar cached: returning cached data')
        const data = cached!!.value as Array<Movie>
        return data?.map(movie => {
            return extractToBase(movie)
        })
    }
    const response = (await fetcher(uri)) as ApiResponse
    const data = response.results as Movie[]
    if (!data) return null
    console.log('similar not cached: storing data')
    storeToCache(uri, data)
    return data?.map(movie => {
        return extractToBase(movie)
    })
}

export const getTVByCategory = async (): Promise<Array<Base> | null> => {
    const uri = TRENDING_URI('show')
    const cached = await isCached(uri)
    if (cached?.isCached) {
        console.log('cached tv shows: returning cached data')
        const data = cached!!.value as Array<TvShowResult>
        return data?.map(movie => {
            return extractToBase(movie)
        })
    }
    const response = (await fetcher(uri)) as TvShowAPIResponse
    const data = response.results
    if (!data) return null
    console.log('not cached: storing data')
    storeToCache(uri, data)
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
    const cacheKey = imagesuri(id, 'show')
    const cached = await isCached(cacheKey)
    if (cached?.isCached) {
        console.log('tv images cached: returning cached data')
        const data = cached!!.value
        console.log(data)
        return data
    }
    const data = await getTVSeriesDetails(id)
    const images = await getShowImagesAndLogo(id, 'show')
    console.log('tv images not cached: storing data')
    storeToCache(cacheKey, { data, images })
    return { data, images }
}

const imagesuri = (id: number, showType: ShowType) => {
    const ext = '/images?include_image_language=en'
    return showType === 'movie'
        ? MOVIE_DETAILS_URI(id).split('?')[0] + ext
        : SERIES_DETAILS_URI(id).split('?')[0] + ext
}

const getShowImagesAndLogo = async (id: number, showType: ShowType) => {
    const uri = imagesuri(id, showType)
    console.log(uri)
    const response = (await fetcher(uri)) as ImageDetails
    console.log(response)
    return response
}

export const getSeasonAndEpisodeDetails = async (
    seasonTmdbId: number,
    seasonNumber: number
): Promise<SeasonAndEpisode> => {
    const url = `${PREFIX}/tv/${seasonTmdbId}/season/${seasonNumber}?language=en-US`
    const cached = await isCached(url)
    if (cached?.isCached) {
        console.log('season and episode details cached: returning cached data')
        const data = cached!!.value
        console.log(data)
        return data as SeasonAndEpisode
    }
    console.log('season and episode details not cached: storing data')
    const response = (await fetcher(url)) as SeasonAndEpisode
    storeToCache(url, response)
    console.log(response)
    return response
}

export const getMovieDataAndImages = async (id: number) => {
    const cacheKey = imagesuri(id, 'movie')
    const cached = await isCached(cacheKey)
    if (cached?.isCached) {
        console.log('movie images cached: returning cached data')
        const data = cached!!.value
        console.log(data)
        return data
    }
    const data = await getMovieDetails(id)
    const images = await getShowImagesAndLogo(id, 'movie')
    console.log('movie images not cached: storing data')
    storeToCache(cacheKey, { data, images })
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
function extractToBase(movie: Movie | TvShowResult): Base {
    if ('title' in movie) {
        return {
            imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            title: movie.title,
            tmdbId: movie.id,
            releaseYear: movie.release_date.split('-')[0]!!,
            backdropUrl: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
        }
    } else {
        return {
            imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            title: movie.name,
            tmdbId: movie.id,
            releaseYear: movie.first_air_date?.split('-')[0]!!,
            backdropUrl: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
        }
    }
}
