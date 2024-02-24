import { useAsyncStorage } from '@react-native-async-storage/async-storage'

export function useCacheBase(key: string) {
    const { getItem, setItem } = useAsyncStorage(key)

    const retrieveData = async (): Promise<{
        isCached: boolean
        value: any
    }> => {
        try {
            const dataFromCache = await getItem()
            if (!dataFromCache) return { isCached: false, value: null }
            const parsedData = JSON.parse(dataFromCache)
            console.log(`Retrieved data ${parsedData.value}`)
            const dataMaxAge = new Date(parsedData.maxAge).getTime()
            const { isExpired } = await revalidateCache(dataMaxAge)
            return isExpired
                ? { isCached: false, value: null }
                : { isCached: true, value: parsedData.value }
        } catch (e) {
            console.error(e)
            return { isCached: false, value: null }
        }
    }

    const revalidateCache = async (maxAge: number) => {
        const now = new Date()
        const time = now.getTime()
        return { isExpired: time > maxAge }
    }

    const storeToCache = async (value: any) => {
        console.log(`Writing data ${value.toString()}`)
        try {
            const now = new Date()
            const maxAge = now.getTime() + 1000 * 60 * 60 * 24
            now.setTime(maxAge)
            const utcString = now.toUTCString()
            const data = { value, maxAge: utcString }
            const cacheValue = JSON.stringify(data)
            await setItem(cacheValue)
        } catch (e) {
            console.log(e)
        }
    }
    return { retrieveData, storeToCache }
}
