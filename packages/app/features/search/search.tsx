import { YStack } from '@my/ui'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { View, StyleSheet, Pressable, ScrollView } from 'react-native'
import { Image } from 'react-native'
import { useEffect, useLayoutEffect, useState } from 'react'
import { Base } from 'app/@types/types'
import { resolveMetaAndNavigateToDetails } from 'app/lib/movies/movies'
import { Stack } from 'expo-router'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ParamListBase } from '@react-navigation/native'
import { getMultiSearch } from 'app/lib/movies/genre'

export const SearchScreen = ({
    navigation,
}: NativeStackScreenProps<ParamListBase>) => {
    const [searchResults, setSearchResults] = useState<Base[]>([])
    const bottomTabBarHeight = useBottomTabBarHeight()
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const onTextChange = async (text: string) => {
        if (text === '') {
            setLoading(false)
            setSearchQuery('')
            return
        }
        setLoading(true)
        setSearchQuery(text)
        console.log('searchQuery', searchQuery)
        const res = await getMultiSearch(searchQuery)
        console.log('res', res)
        setSearchResults(res)
    }

    const resetSearch = () => {
        setSearchQuery('')
        setSearchResults([])
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                onChangeText: event => setSearchQuery(event.nativeEvent.text),
                placeholder: 'Search Shows and Movies',
                autoFocus: true,
                onCancelButtonPress: () => resetSearch(),
            },
        })
    }, [navigation])

    useEffect(() => {
        onTextChange(searchQuery)
    }, [searchQuery])

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
        >
            <YStack
                style={{ paddingBottom: bottomTabBarHeight, height: '100%' }}
            >
                <YStack f={1} p="$2" space>
                    <YStack space="$2" pt={'4'} pb={'6'} maw={600}>
                        {/*<SearchBar setResults={setSearchResults} />*/}
                        {!searchResults.length && (
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
                                                height: '90%',
                                                borderRadius: 10,
                                                padding: 10,
                                            }}
                                        />
                                    </View>
                                )}
                                numColumns={2}
                            />
                        )}
                        {searchResults && (
                            <GridView
                                data={searchResults}
                                renderItem={item => (
                                    <Pressable
                                        onPress={() =>
                                            resolveMetaAndNavigateToDetails(
                                                item.title,
                                                item.tmdbId
                                            )
                                        }
                                    >
                                        <View
                                            style={
                                                styles.searchResultItemContainer
                                            }
                                        >
                                            <Image
                                                source={{ uri: item.imageUrl }}
                                                resizeMode={'cover'}
                                                style={{
                                                    width: '90%',
                                                    height: '100%',
                                                    borderRadius: 10,
                                                    padding: 5,
                                                }}
                                            />
                                        </View>
                                    </Pressable>
                                )}
                                numColumns={2}
                            />
                        )}
                    </YStack>
                </YStack>
            </YStack>
        </ScrollView>
    )
}

interface Props<T> {
    data: T[]
    renderItem: (item: T) => React.ReactNode
    numColumns: number
    gap?: number
}

export const GridView = <T extends any>(props: Props<T>) => {
    const { data, renderItem, numColumns, gap = 5 } = props
    return (
        <View style={styles.container}>
            {data.map((item, index) => {
                return (
                    <View
                        key={index}
                        //@ts-ignore
                        style={{
                            width: 100 / numColumns + '%',
                        }}
                    >
                        <View style={{ padding: gap }}>{renderItem(item)}</View>
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
    searchResultItemContainer: {
        borderRadius: 10,
        height: 250,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
