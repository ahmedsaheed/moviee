import {
    LargeLibraryHeaderComponent,
    LargeSearchHeaderComponent,
    SearchHeaderComponent,
} from 'app/components/greeting'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { YStack } from '@my/ui'
import { ScrollViewWithHeaders } from '@codeherence/react-native-header'

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
                    <YStack space="$2" pt={'4'} pb={'6'} maw={600}></YStack>
                </YStack>
            </ScrollViewWithHeaders>
        </YStack>
    )
}
