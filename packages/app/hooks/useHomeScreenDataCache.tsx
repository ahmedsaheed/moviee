import { useCacheBase } from 'app/hooks/useCacheBase'

export function useHomeScreenDataCache() {
    const { retrieveData, storeToCache } = useCacheBase('homeScreenData')
    const getHomeScreenData = async () => {
        const { isCached, value } = await retrieveData()
        return isCached ? value : null
    }
    const setHomeScreenData = async (data: any) => await storeToCache(data)
    return { getHomeScreenData, setHomeScreenData }
}
