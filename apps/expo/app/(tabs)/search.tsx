import { SearchScreen } from 'app/features/search/search'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ParamListBase } from '@react-navigation/native'
import { View } from '@my/ui'
import { Stack } from 'expo-router'

export default function Tab() {
    //@ts-ignore
    const navigation = useNavigation()
    return (
        <View>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Search',
                    headerLargeStyle: {
                        backgroundColor: 'black',
                    },
                    headerBlurEffect: 'dark',
                }}
            />
            <SearchScreen navigation={navigation} />
        </View>
    )
}
