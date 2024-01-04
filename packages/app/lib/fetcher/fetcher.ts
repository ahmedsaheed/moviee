const KEY = process.env.EXPO_PUBLIC_API_KEY!!
const GET: RequestInit = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Y2FjNGVmMDU3ZTJlYzAzM2Y5MmUwMWQ1ZTg2MzcxMSIsInN1YiI6IjY1OTQ5NjcwMzUyMGU4MDUxYmM5NzMxMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.J5nCHqPkakTXkiCHFNSOBQXdmsXr4ZfRLnmLiHsUgs4',
    },
}

function baseFetcher(url: RequestInfo, init: RequestInit) {
    return fetch(url, init).then(async response => {
        if (response.ok) {
            return response
        }
        throw new Error(response.statusText)
    })
}

/**
 * Fetcher : A simple HTTP request handler
 **/
export async function fetcher<T>(
    url: RequestInfo,
    init: RequestInit = GET
): Promise<T> {
    const response = await baseFetcher(url, init)
    return await response.json()
}
