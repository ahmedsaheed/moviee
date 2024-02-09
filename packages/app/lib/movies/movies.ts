import {
    makeProviders,
    makeStandardFetcher,
    ScrapeMedia,
    targets,
} from '@movie-web/providers'
import { fetcher } from 'app/lib/fetcher/fetcher'
import { router } from 'expo-router'
import { getSeasonAndEpisodeDetails, isCached, storeToCache } from './genre'

const formatMovieName = (movieName: string) => {
    return movieName.replace(/\s/g, '%20')
}

export const movieUrl = (movieName: string): string =>
    `https://api.themoviedb.org/3/search/multi?query=${formatMovieName(
        movieName
    )}&include_adult=false&language=en-US&page=1`

const isMovieOrTV = meta =>
    meta?.media_type === 'movie' || meta?.media_type === 'tv'

export const getMoviesMetadata = async (
    movie: string,
    id: number,
    seriesOptions?: { seasonNumber: number; episodeNumber: number }
): Promise<ScrapeMedia | null> => {
    let meta
    let seriesInfo
    const url = movieUrl(movie)
    const cached = await isCached(url)
    if (cached?.isCached) {
        const initialData = cached!!.value as any
        const res = initialData?.results
        if (!res) return null
        meta = res.find((result: any) => result.id === id)
    } else {
        const getMeta = await fetcher<any>(url)
        const results = getMeta?.results
        if (!results) return null
        meta = results.find((result: any) => result.id === id)
        await storeToCache(url, getMeta)
    }

    if (seriesOptions) {
        const { seasonNumber, episodeNumber } = seriesOptions
        const moreSeriesInfo = await getSeasonAndEpisodeDetails(
            meta.id,
            seasonNumber
        )

        seriesInfo = {
            season: {
                number: seasonNumber,
                tmdbId: String(moreSeriesInfo?.id!!),
            },
            episodes: {
                number: episodeNumber,
                tmdbId: String(moreSeriesInfo?.episodes[episodeNumber]!!.id!!),
            },
        }
    }

    if (!meta || !isMovieOrTV(meta)) return null

    const isTV = meta?.media_type === 'tv'
    return {
        type: isTV ? 'show' : meta?.media_type,
        title: !isTV ? meta?.original_title : meta?.name,
        tmdbId: meta.id,
        releaseYear: !isTV
            ? meta.release_date.split('-')[0]
            : meta.first_air_date.split('-')[0],
        ...(seriesInfo ?? {}),
    }
}

export const providers = makeProviders({
    fetcher: makeStandardFetcher(fetch),
    target: targets.NATIVE,
    consistentIpForRequests: true,
})

export async function retrieveFromProvider(media: ScrapeMedia | null = null) {
    const cacheKey = `PROVIDER_CACHE_${media?.type}_${media?.tmdbId}`
    const cached = await isCached(cacheKey)
    if (cached?.isCached) return cached!!.value
    const runOutput = await providers.runAll({
        media: media!!,
        sourceOrder: ['flixhq'],
        events: {
            init: evt => {
                console.log('init', evt)
            },
            start: id => {
                console.log('start', id)
            },
            update: evt => {
                console.log('update', evt.reason, evt)
            },
            discoverEmbeds: evt => {
                console.log('discoverEmbeds', evt)
            },
        },
    })
    if (runOutput === null) return null
    await storeToCache(cacheKey, runOutput)
    return runOutput
}

export async function resolveMetaAndNavigateToDetails(
    movieName: string,
    id: number
) {
    const res = await getMoviesMetadata(movieName, id)
    const { tmdbId, type } = res!!
    if (!tmdbId) return
    //TODO: add to history
    const hrefObj = {
        pathname: `/user/${tmdbId}`,
        params: { tmdbId, type },
    }

    router.push(hrefObj)
}
