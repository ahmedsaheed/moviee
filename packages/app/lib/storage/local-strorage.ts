import AsyncStorage from '@react-native-async-storage/async-storage'

async function storeObjectToLocalStore(key: string, value: object) {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        console.error(e)
    }
}

export const storeDataToLocalStore = async (
    key: string,
    value: string | object
) => {
    try {
        console.log('type of value: ', typeof value)
        typeof value === 'string'
            ? await AsyncStorage.setItem(key, value)
            : await storeObjectToLocalStore(key, value)
    } catch (e) {
        console.error(e)
    }
}

export const retrieveDataFromLocalStore = async (key: string) => {
    try {
        const respromise = await AsyncStorage.getItem(key)
        return respromise!!

        // return await AsyncStorage.getItem(key)
    } catch (e) {
        console.error(e)
    }
}

export const removeDataFromLocalStore = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (e) {
        console.error(e)
    }
}
