import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
    useFonts,
    Inter_900Black,
    Inter_400Regular,
} from '@expo-google-fonts/inter'

export default function Screen() {
    let [fontsLoaded, fontError] = useFonts({
        Inter_400Regular,
    })

    if (!fontsLoaded && !fontError) {
        return null
    }
    return (
        <>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack.Screen
                    options={{
                        title: 'Home',
                        headerShown: false,
                        headerBackVisible: true,
                    }}
                />
                <HomeScreen />
            </GestureHandlerRootView>
        </>
    )
}
