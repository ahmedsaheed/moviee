import { Base, DetailedMovieInfo, ImageDetails } from 'app/@types/types'
import { useEffect, useState } from 'react'
import {
    getMovieByCategory,
    getMovieDataAndImages,
    getMovieDetails,
} from 'app/lib/movies/genre'

export function useMovieData(id: number): {
    images: ImageDetails | null
    data: DetailedMovieInfo | null
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
        // const { data, images } = await getMovieDataAndImages(id!!)
        // setData(data)
        //
        // const datas = async () => await getMovieDetails(id)
        // datas().then(res => setData(res))
    }, [])

    return { data, images }
}
