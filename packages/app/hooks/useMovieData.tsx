import { Base, DetailedMovieInfo, ImageDetails } from 'app/@types/types'
import { useEffect, useState } from 'react'
import {
    getMovieByCategory,
    getMovieDataAndImages,
    getMovieDetails,
} from 'app/lib/movies/genre'

/**
 * Gets a specified movie details and images
 * @param id - the movie IMDb id
 */
export function useMovieData(id: number): {
    data: DetailedMovieInfo | null
    images: ImageDetails | null
} {
    const [data, setData] = useState<DetailedMovieInfo | null>(null)
    const [images, setImages] = useState<ImageDetails | null>(null)
    useEffect(() => {
        const out = async () => await getMovieDataAndImages(id!!)
        out().then(out => {
            console.log('out', out)
            setData(out.data)
            setImages(out.images)
        })
    }, [])

    return { data, images }
}
