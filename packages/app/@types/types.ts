import { CardProps } from '@my/ui'
import { ScrapeMedia } from '@movie-web/providers'
import type { ViewStyle } from 'react-native'
import type { AnimatedStyleProp } from 'react-native-reanimated'
import { Dispatch, SetStateAction } from 'react'

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

export type ShowType = 'show' | 'movie'

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

type SeriesInfo = {
    name: string
    number_of_seasons: number
    number_of_episodes: number
    seasons: Array<{
        air_date: string
        episode_count: number
        id: number
        name: string
        overview: string
        poster_path: string
        season_number: number
        vote_average: number
    }>
}

export type DetailedSeriesInfo = DetailedMovieInfo & SeriesInfo

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
    name?: string
}

type Results = Movie[] | DetailedMovieInfo
export type Dispatcher<S> = Dispatch<SetStateAction<S>>
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

export type Provider =
    | 'NETFLIX'
    | 'HULU'
    | 'DISNEY_PLUS'
    | 'AMAZON_PRIME'
    | 'APPLE_TV'
export type ProviderMap = {
    [name in Provider]: number
}
export const providerId: ProviderMap = {
    NETFLIX: 8,
    HULU: 15,
    DISNEY_PLUS: 337,
    AMAZON_PRIME: 9,
    APPLE_TV: 2,
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

export type SeasonAndEpisode = {
    id: string
    airDate: Date
    episodes: Episode[]
    name: string
    overview: string
    welcomeID: number
    posterPath: string
    seasonNumber: number
    voteAverage: number
}

export type Episode = {
    airDate: Date
    episodeNumber: number
    episodeType: EpisodeType
    id: number
    name: string
    overview: string
    productionCode: string
    runtime: number
    seasonNumber: number
    showID: number
    stillPath: string
    voteAverage: number
    voteCount: number
    crew: Crew[]
    guestStars: Crew[]
}

export type Crew = {
    department?: Department
    job?: Job
    creditID: string
    adult: boolean
    gender: number
    id: number
    knownForDepartment: Department
    name: string
    originalName: string
    popularity: number
    profilePath: null | string
    character?: string
    order?: number
}

export type TvShowAPIResponse = {
    page: number
    results: TvShowResult[]
    total_pages: number
    total_results: number
}

export type TvShowResult = {
    adult: boolean
    backdrop_path: string
    id: number
    name: string
    original_language: string
    original_name: string
    overview: string
    poster_path: string
    media_type: MediaType
    genre_ids: number[]
    popularity: number
    first_air_date: string
    vote_average: number
    vote_count: number
    origin_country: string[]
}

export type MediaType = 'tv'

export type Department = 'Directing' | 'Writing' | 'Production' | 'Acting'

export type Job = 'Director' | 'Writer'

export type EpisodeType = 'standard' | 'finale'
