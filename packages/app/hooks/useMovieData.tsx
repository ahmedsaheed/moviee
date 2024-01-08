import { Base, DetailedMovieInfo } from 'app/@types/types'
import { useEffect, useState } from 'react'
import { getMovieByCategory, getMovieDetails } from 'app/lib/movies/genre'

export function useMovieData(id: number): DetailedMovieInfo | null {
    const [data, setData] = useState<DetailedMovieInfo | null>(null)
    useEffect(() => {
        const datas = async () => await getMovieDetails(id)
        datas().then(res => setData(res))
    }, [])
    return data ?? null
}
