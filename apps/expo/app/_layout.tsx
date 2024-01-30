import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native'
import { TamaguiProvider } from 'tamagui'

import { Provider } from 'app/provider'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import config from '../tamagui.config'
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
                    {/* <TamaguiProvider config={config} defaultTheme="dark"> */}
                    <StatusBar
                        style={'auto'}
                        hideTransitionAnimation="fade"
                        animated={true}
                    />
                    <Stack />
                    {/* </TamaguiProvider> */}
                </ThemeProvider>
            </SafeAreaProvider>
        </Provider>
    )
}
