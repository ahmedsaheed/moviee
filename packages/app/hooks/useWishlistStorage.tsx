import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { Base } from 'app/@types/types'

export const useWishlistStorage = () => {
    const { getItem, setItem } = useAsyncStorage('wishlist')

    const isWishlisted = async (item: Base) => {
        const wishlist = await getItem()
        const wishlistArray = (wishlist ? JSON.parse(wishlist) : []) as Base[]
        return wishlistArray.some((i: Base) => i.tmdbId === item.tmdbId)
    }

    const updateWishlist = async (operation: 'add' | 'remove', item: Base) => {
        const wishlist = await getItem()
        const wishlistArray = (wishlist ? JSON.parse(wishlist) : []) as Base[]
        const index = wishlistArray.findIndex(
            (i: Base) => i.tmdbId === item.tmdbId
        )
        if (index !== -1) {
            wishlistArray.splice(index, 1)
        }
        if (operation === 'add') {
            wishlistArray.unshift(item)
        }
        await setItem(JSON.stringify(wishlistArray))
    }

    const getAllWishlist = async () => {
        const wishlist = await getItem()
        const wishlistArray = (wishlist ? JSON.parse(wishlist) : []) as Base[]
        return wishlistArray
    }

    return { isWishlisted, updateWishlist, getAllWishlist }
}
