import { CardProps } from '@my/ui'
import { ScrapeMedia } from '@movie-web/providers'
import type { ViewStyle } from 'react-native'
import type { AnimatedStyleProp } from 'react-native-reanimated'

export type HomeScreenCardProps = {
    onPress: (string) => void
} & CardProps &
    Base

export type Base = {
    tmdbId: number
    imageUrl: string
    title: string
    releaseYear: string
    backdropUrl?: string
    logoUrl?: string
}

type Genre = {
    id: number
    name: string
}

type ProductionCompany = {
    id: number
    logo_path: string | null
    name: string
    origin_country: string
}

type ProductionCountry = {
    iso_3166_1: string
    name: string
}

type SpokenLanguage = {
    english_name: string
    iso_639_1: string
    name: string
}

export type DetailedMovieInfo = {
    adult: boolean
    backdrop_path: string
    belongs_to_collection: null | any // You might want to replace 'any' with a more specific type if you have the collection schema
    budget: number
    genres: Genre[]
    homepage: string
    id: number
    imdb_id: string
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    production_companies: ProductionCompany[]
    production_countries: ProductionCountry[]
    release_date: string
    revenue: number
    runtime: number
    spoken_languages: SpokenLanguage[]
    status: string
    tagline: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
}

export type Movie = {
    adult: boolean
    backdrop_path: string
    id: number
    title: string
    original_language: string
    original_title: string
    overview: string
    poster_path: string
    media_type: string
    genre_ids: number[]
    popularity: number
    release_date: string
    video: boolean
    vote_average: number
    vote_count: number
}

type Results = Movie[] | DetailedMovieInfo

export type ApiResponse = {
    results: Results
    total_pages: number
    total_results: number
}
export type HeadingAndMovies = {
    heading: string
    movies: Array<Base> | null
}

export type TAnimationStyle = (value: number) => AnimatedStyleProp<ViewStyle>

export type MovieCategories =
    | 'TRENDING'
    | 'ACTION'
    | 'COMEDY'
    | 'HORROR'
    | 'ROMANCE'
    | 'DOCUMENTARY'
    | 'DRAMA'
    | 'THRILLER'
    | 'ANIMATION'
    | 'FAMILY'
    | 'FANTASY'
    | 'HISTORY'
    | 'MUSIC'
    | 'MYSTERY'
    | 'SCIENCE_FICTION'
    | 'TV_MOVIE'
    | 'WAR'
    | 'WESTERN'
    | 'ADVENTURE'
    | 'CRIME'

type GenreReverseMap = {
    [name in MovieCategories]: number
}

export const genresReverse: GenreReverseMap = {
    ACTION: 28,
    ADVENTURE: 12,
    ANIMATION: 16,
    COMEDY: 35,
    CRIME: 80,
    DOCUMENTARY: 99,
    DRAMA: 18,
    FAMILY: 10751,
    FANTASY: 14,
    HISTORY: 36,
    HORROR: 27,
    MUSIC: 10402,
    MYSTERY: 9648,
    ROMANCE: 10749,
    SCIENCE_FICTION: 878,
    TV_MOVIE: 10770,
    THRILLER: 53,
    WAR: 10752,
    WESTERN: 37,
    TRENDING: -1,
}

export type ImageDetails = {
    backdrops: Array<{
        aspect_ratio: number
        height: number
        iso_639_1: string | null
        file_path: string
        vote_average: number
        vote_count: number
        width: number
    }>
    id: number
    logos: Array<{
        aspect_ratio: number
        height: number
        iso_639_1: string
        file_path: string
        vote_average: number
        vote_count: number
        width: number
    }>
    posters: Array<{
        aspect_ratio: number
        height: number
        iso_639_1: string | null
        file_path: string
        vote_average: number
        vote_count: number
        width: number
    }>
}
