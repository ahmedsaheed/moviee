import {
    makeProviders,
    makeStandardFetcher,
    ScrapeMedia,
    targets,
} from '@movie-web/providers'
import { fetcher } from 'app/lib/fetcher/fetcher'

const formatMovieName = (movieName: string) => {
    return movieName.replace(/\s/g, '%20')
}
const movieUrl = (movieName: string): string =>
    `https://api.themoviedb.org/3/search/movie?query=${formatMovieName(
        movieName
    )}&include_adult=false&language=en-US&page=1`

export const getMoviesMetadata = async (
    movie: string
): Promise<ScrapeMedia | null> => {
    const getMeta = (await fetcher(movieUrl(movie))) as any
    const meta = getMeta?.results[0]
    if (!meta) return null
    return {
        type: 'movie',
        title: meta?.original_title,
        tmdbId: meta.id,
        releaseYear: meta.release_date.split('-')[0],
    }
}

export const providers = makeProviders({
    fetcher: makeStandardFetcher(fetch),
    target: targets.NATIVE,
    consistentIpForRequests: true,
})

export async function retrieveFromProvider(media: ScrapeMedia | null = null) {
    const output = await providers.runAll({
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
    return output
}
