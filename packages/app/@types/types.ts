import { CardProps } from '@my/ui'
import { ScrapeMedia } from '@movie-web/providers'

export type HomeScreenCardProps = {
    onPress: (string) => void
} & CardProps &
    Base

export type Base = {
    tmdbId: number
    imageUrl: string
    title: string
    releaseYear: string
}

export type BaseMovieInfo = {
    imageUrl: string
} & ScrapeMedia

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

type Results = Movie[]

export type ApiResponse = {
    results: Results
    total_pages: number
    total_results: number
}
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
