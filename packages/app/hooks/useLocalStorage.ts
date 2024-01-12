import {
    removeDataFromLocalStore,
    retrieveDataFromLocalStore,
    storeDataToLocalStore,
} from 'app/lib/storage/local-strorage'
import { useState } from 'react'

type LocalStorage = {
    storeDataToLocalStore: (key: string, value: string | object) => void
    retrieveDataFromLocalStore: (
        key: string
    ) => Promise<string | null | undefined>
    removeDataFromLocalStore: (key: string) => void
}
export function useLocalStorage(): LocalStorage {
    return {
        storeDataToLocalStore,
        retrieveDataFromLocalStore,
        removeDataFromLocalStore,
    }
}
