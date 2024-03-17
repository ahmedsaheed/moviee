import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { YStack } from '@my/ui'
import { useWishlistStorage } from 'app/hooks/useWishlistStorage'
import { ListItem, Separator, YGroup } from 'tamagui'
import { ChevronRight, Play } from '@tamagui/lucide-icons'
import { useLayoutEffect, useState } from 'react'
import { Base } from 'app/@types/types'
import { resolveMetaAndNavigateToDetails } from 'app/lib/movies/movies'
import { ScrollView } from 'react-native'

export function Wishlist() {
    const bottomTabBarHeight = useBottomTabBarHeight()
    const [wishlist, setWishlist] = useState<Base[]>([])
    const { getAllWishlist } = useWishlistStorage()

    useLayoutEffect(() => {
        getAllWishlist().then(list => {
            setWishlist(list)
        })
    }, [])
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
        >
            <YStack
                style={{
                    paddingBottom: bottomTabBarHeight,
                    height: '100%',
                }}
            >
                <YStack f={1} p="$2" space>
                    <YStack space="$2" pt={'4'} pb={'6'} maw={600}>
                        <WishlistList wishlist={wishlist} />
                    </YStack>
                </YStack>
            </YStack>
        </ScrollView>
    )
}

function WishlistList(
    props: {
        wishlist: Base[]
    } = { wishlist: [] }
) {
    const { wishlist } = props

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
                        key={index + wish.tmdbId}
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
