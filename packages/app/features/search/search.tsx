import {
    LargeSearchHeaderComponent,
    SearchHeaderComponent,
} from 'app/components/greeting'
import { ScrollViewWithHeaders } from '@codeherence/react-native-header'
import { H1, H2, H4, H6, YStack } from '@my/ui'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { Searchbar } from 'app/components/searchbar'
import { View, StyleSheet } from 'react-native'
import { H3 } from '@my/ui'
import { Image } from 'react-native'

export const SearchScreen = () => {
    const bottomTabBarHeight = useBottomTabBarHeight()
    return (
        <YStack style={{ paddingBottom: bottomTabBarHeight, height: '100%' }}>
            <ScrollViewWithHeaders
                HeaderComponent={SearchHeaderComponent}
                LargeHeaderComponent={LargeSearchHeaderComponent}
                contentContainerStyle={{}}
            >
                <YStack f={1} p="$2" space>
                    <YStack space="$2" pt={'4'} pb={'6'} maw={600}>
                        <Searchbar />
                        <H6
                            px="$2"
                            fontFamily="System"
                            fontWeight="bold"
                            style={{ opacity: 0.9 }}
                        >
                            Explore Popular Series, Films, and More
                        </H6>
                        <GridView
                            data={[
                                {
                                    uri: 'https://is1-ssl.mzstatic.com/image/thumb/Features116/v4/dd/bc/78/ddbc78cc-471e-b5b4-fa93-3ae6405b81a6/5e429832-bfa3-45b9-8edd-54572ffe0a91.lsr/670x377.webp',
                                    name: 'Featured',
                                },
                                {
                                    uri: 'https://is1-ssl.mzstatic.com/image/thumb/Features116/v4/3b/9e/2c/3b9e2c89-c3e9-017b-b5ff-a270a4a83acd/41c8b453-6dd9-4ed1-abf4-58f8dd1f50d2.lsr/670x377.webp',
                                    name: 'Non-Fiction',
                                },
                                {
                                    uri: 'https://is1-ssl.mzstatic.com/image/thumb/Features116/v4/a7/22/06/a722068e-c62b-bdee-b583-d5e7f4e4ba28/52d46995-94c3-41d8-b77b-c9ab88fb5e63.lsr/670x377.webp',
                                    name: 'kids & Family',
                                },
                                {
                                    uri: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/98/6b/ca/986bca3f-cad5-e203-de89-7b76ce65959e/ac0f729f-393e-43c9-93b2-33fc843da1fb.lsr/670x377.webp',
                                    name: 'Drama Series',
                                },
                            ]}
                            renderItem={item => (
                                <View style={styles.itemContainer}>
                                    <Image
                                        source={{ uri: item.uri }}
                                        resizeMode={'cover'}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 10,
                                        }}
                                    />
                                </View>
                            )}
                            numColumns={2}
                        />
                    </YStack>
                </YStack>
            </ScrollViewWithHeaders>
        </YStack>
    )
}

interface Props<T> {
    data: T[]
    renderItem: (item: T) => React.ReactNode
    numColumns: number
}

const GridView = <T extends any>(props: Props<T>) => {
    const { data, renderItem, numColumns } = props
    return (
        <View style={styles.container}>
            {data.map(item => {
                return (
                    <View
                        style={{
                            width: 100 / numColumns + '%',
                        }}
                    >
                        <View style={{ padding: 5 }}>{renderItem(item)}</View>
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    itemContainer: {
        borderRadius: 10,
        height: 120,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
