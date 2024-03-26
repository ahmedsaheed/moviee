import {
    makeProviders,
    makeStandardFetcher,
    ScrapeMedia,
    targets,
} from '@movie-web/providers'
import { fetcher } from 'app/lib/fetcher/fetcher'
import { router } from 'expo-router'
import {
    getSeasonAndEpisodeDetails,
    isCached,
    movieUrl,
    storeToCache,
} from './genre'

export const providers = makeProviders({
    fetcher: makeStandardFetcher(fetch),
    target: targets.NATIVE,
    consistentIpForRequests: true,
})

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
            episode: {
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
        tmdbId: String(meta.id),
        releaseYear: !isTV
            ? Number(meta.release_date.split('-')[0])
            : Number(meta.first_air_date.split('-')[0]),
        ...(seriesInfo ?? {}),
    }
}

export async function retrieveFromProvider(media: ScrapeMedia | null = null) {
    console.log('Original res: ', media)
    console.log('Providers are: ', providers.listSources())
    const cacheKey =
        media?.type === 'movie'
            ? `PROVIDER_CACHE_${media?.type}_${media?.tmdbId}`
            : `PROVIDER_CACHE_${media?.type}_${media?.tmdbId}_${media?.season?.number}_${media?.episode?.number}`
    const cached = await isCached(cacheKey)
    if (cached?.isCached) return cached!!.value
    const runOutput = await providers.runAll({
        media: media!!,
        sourceOrder: ['vidsrc', 'hdrezka'],
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
    console.log('Run output: ', runOutput.stream.type)
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
