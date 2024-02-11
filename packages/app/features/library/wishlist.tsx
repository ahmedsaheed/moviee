import {
    LargeLibraryHeaderComponent,
    LargeSearchHeaderComponent,
    SearchHeaderComponent,
} from 'app/components/greeting'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { YStack } from '@my/ui'
import { ScrollViewWithHeaders } from '@codeherence/react-native-header'
import { useWishlistStorage } from 'app/hooks/useWishlistStorage'
import { ListItem, Separator, YGroup } from 'tamagui'
import { ChevronRight, Play } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { Base } from 'app/@types/types'
import { resolveMetaAndNavigateToDetails } from 'app/lib/movies/movies'

export const Wishlist = () => {
    const bottomTabBarHeight = useBottomTabBarHeight()
    return (
        <YStack style={{ paddingBottom: bottomTabBarHeight, height: '100%' }}>
            <ScrollViewWithHeaders
                HeaderComponent={SearchHeaderComponent}
                LargeHeaderComponent={LargeLibraryHeaderComponent}
                contentContainerStyle={{}}
            >
                <YStack f={1} p="$2" space>
                    <YStack space="$2" pt={'4'} pb={'6'} maw={600}>
                        <WishlistList />
                    </YStack>
                </YStack>
            </ScrollViewWithHeaders>
        </YStack>
    )
}

function WishlistList() {
    const [wishlist, setWishlist] = useState<Base[]>([])
    const { getAllWishlist } = useWishlistStorage()

    useEffect(() => {
        getAllWishlist().then(list => {
            setWishlist(list)
        })
    }, [])

    if (wishlist.length === 0) {
        return (
            <YGroup
                alignSelf="center"
                width={'100%'}
                size="$5"
                separator={<Separator />}
                backgroundColor="$transparent"
            >
                <YGroup.Item backgroundColor="$transparent">
                    <ListItem
                        backgroundColor="$transparent"
                        title="Wishlist is empty"
                        style={{ fontFamily: 'System' }}
                    />
                </YGroup.Item>
            </YGroup>
        )
    }

    return (
        <YGroup
            alignSelf="center"
            width={'100%'}
            size="$5"
            separator={<Separator />}
            backgroundColor="$transparent"
        >
            {wishlist.map((wish, index) => (
                <YGroup.Item backgroundColor="$transparent">
                    <ListItem
                        key={index}
                        backgroundColor="$transparent"
                        title={wish.title}
                        subTitle={`id: ${wish.tmdbId}, `}
                        icon={Play}
                        iconAfter={ChevronRight}
                        onPress={() =>
                            resolveMetaAndNavigateToDetails(
                                wish.title,
                                wish.tmdbId
                            )
                        }
                        style={{ fontFamily: 'System' }}
                    />
                </YGroup.Item>
            ))}
        </YGroup>
    )
}
