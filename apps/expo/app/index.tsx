import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter'

export default function Screen() {
    let [fontsLoaded, fontError] = useFonts({
        Inter_900Black,
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
                    }}
                />
                <HomeScreen />
            </GestureHandlerRootView>
        </>
    )
}
