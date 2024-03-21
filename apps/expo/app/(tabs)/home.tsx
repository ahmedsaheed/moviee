import { View } from '@my/ui'
import { HomeScreen } from 'app/features/home/screen'
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'

export default function Tab() {
    return (
        <View>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <HomeScreen />
        </View>
    )
}
