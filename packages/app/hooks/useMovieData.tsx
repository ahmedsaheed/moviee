import {
    Base,
    DetailedMovieInfo,
    DetailedSeriesInfo,
    ImageDetails,
    ShowType,
} from 'app/@types/types'
import { useEffect, useState } from 'react'
import {
    getMovieByCategory,
    getMovieDataAndImages,
    getSimilarMovies,
    getTVDataAndImages,
} from 'app/lib/movies/genre'

/**
 * Gets a specified movie details and images
 * @param movieType
 * @param id - the movie IMDb id
 */
export function useMovieData(
    movieType: ShowType,
    id: number
): {
    data: DetailedSeriesInfo | null
    images: ImageDetails | null
    similarMovies?: Base[] | null
} {
    const [data, setData] = useState<DetailedSeriesInfo | null>(null)
    const [images, setImages] = useState<ImageDetails | null>(null)
    const [similarMovies, setSimilarMovies] = useState<Base[] | null>(null)

    useEffect(() => {
        const resolve = async () => {
            if (movieType === 'movie') {
                const out = await getMovieDataAndImages(id!!)
                const similar = await getSimilarMovies(id!!)
                const { data, images } = out
                setData(data as DetailedSeriesInfo)
                setSimilarMovies(similar)
                setImages(images)
            } else {
                const out = await getTVDataAndImages(id!!)
                const { data, images } = out
                setData(data)
                setImages(images)
            }
        }
        resolve()
    }, [])

    return { data, images, similarMovies }
}
