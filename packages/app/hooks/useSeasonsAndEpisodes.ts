import { ShowMedia } from '@movie-web/providers'
import { useEffect, useState } from 'react'
import { SeasonAndEpisode, ShowType } from 'app/@types/types'
import { getSeasonAndEpisodeDetails } from 'app/lib/movies/genre'

export function useSeasonsAndEpisodes(
    movieType,
    seasonTmdbId,
    seasonNumber?,
    episodeNumber?
) {
    if (movieType === 'movie') return null
    const [data, setData] = useState<SeasonAndEpisode | null>(null)
    seasonNumber = seasonNumber ?? 1
    episodeNumber = episodeNumber ?? 1

    useEffect(() => {
        const getSeasonsAndEpisodes = async () => {
            const response = await getSeasonAndEpisodeDetails(
                seasonTmdbId,
                seasonNumber!!
            )
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
