import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Provider } from 'app/provider'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { Tabs } from 'expo-router/tabs'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
export default function HomeLayout() {
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
                    />
                </ThemeProvider>
            </SafeAreaProvider>
        </Provider>
    )
}
