import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Provider } from 'app/provider'
import { useFonts } from '@expo-google-fonts/inter'
import { Text } from '@my/ui'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(tabs)',
}

export default function AppLayout() {
    const [loaded] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    })
    const scheme = useColorScheme()

    if (!loaded) {
        return null
    }

    return (
        <Provider>
            <SafeAreaProvider>
                <ThemeProvider
                    value={scheme === 'dark' ? DarkTheme : DarkTheme}
                >
                    <StatusBar
                        style={'light'}
                        hideTransitionAnimation="fade"
                        animated={true}
                    />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    >
                        <Stack.Screen
                            name="index"
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="(tabs)"
                            options={{
                                headerShown: false,
                            }}
                        />
                    </Stack>
                </ThemeProvider>
            </SafeAreaProvider>
        </Provider>
    )
}
