import {
    makeProviders,
    makeStandardFetcher,
    ScrapeMedia,
    targets,
} from '@movie-web/providers'
import { fetcher } from 'app/lib/fetcher/fetcher'
import { router } from 'expo-router'

const formatMovieName = (movieName: string) => {
    return movieName.replace(/\s/g, '%20')
}
const movieUrl = (movieName: string): string =>
    `https://api.themoviedb.org/3/search/multi?query=${formatMovieName(
        movieName
    )}&include_adult=false&language=en-US&page=1`
const isMovieOrTV = meta =>
    meta?.media_type === 'movie' || meta?.media_type === 'tv'
export const getMoviesMetadata = async (
    movie: string
): Promise<ScrapeMedia | null> => {
    const getMeta = (await fetcher(movieUrl(movie))) as any
    const meta = getMeta?.results[0]
    console.log('meta', meta)
    if (!meta || !isMovieOrTV(meta)) return null

    const isTV = meta?.media_type === 'tv'
    return {
        type: isTV ? 'show' : meta?.media_type,
        title: !isTV ? meta?.original_title : meta?.name,
        tmdbId: meta.id,
        releaseYear: !isTV
            ? meta.release_date.split('-')[0]
            : meta.first_air_date.split('-')[0],
    }
}

export const providers = makeProviders({
    fetcher: makeStandardFetcher(fetch),
    target: targets.NATIVE,
    consistentIpForRequests: true,
})

export async function retrieveFromProvider(media: ScrapeMedia | null = null) {
    return await providers.runAll({
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
}

export async function resolveMetaAndNavigateToDetails(movieName: string) {
    const res = await getMoviesMetadata(movieName)
    const { tmdbId, type } = res!!
    if (!tmdbId) return
    //TODO: add to history
    const hrefObj = {
        pathname: `/user/${tmdbId}`,
        params: { tmdbId, type },
    }

    router.push(hrefObj)
}
