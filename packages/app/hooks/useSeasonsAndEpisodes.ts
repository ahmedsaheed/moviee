import { ShowMedia } from '@movie-web/providers'
import { useEffect, useState } from 'react'
import { SeasonAndEpisode, ShowType } from 'app/@types/types'
import { getSeasonAndEpisodeDetails } from 'app/lib/movies/genre'

export function useSeasonsAndEpisodes(
    movieType: ShowType,
    seasonTmdbId: number
) {
    const [data, setData] = useState<SeasonAndEpisode | null>(null)
    if (movieType === 'movie') return null
    useEffect(() => {
        const getSeasonsAndEpisodes = async () => {
            const response = await getSeasonAndEpisodeDetails(seasonTmdbId, 1)
            setData(response)
        }
        getSeasonsAndEpisodes()
    }, [])
    return {
        season: {
            number: 1,
            tmdbId: String(data?.id!!),
        },
        episodes: data?.episodes,
        currentEpisode: {
            number: 1,
            tmdbId: String(data?.episodes[0]!!.id!!),
        },
    }
}
