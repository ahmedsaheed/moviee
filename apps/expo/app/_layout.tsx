import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native'
import { Provider } from 'app/provider'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Tabs } from 'expo-router/tabs'
import { HomeScreen } from 'app/features/home/screen'
import { UserDetailScreen } from 'app/features/user/detail-screen'

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
                    value={scheme === 'dark' ? DarkTheme : DefaultTheme}
                >
                    <StatusBar
                        style={'auto'}
                        hideTransitionAnimation="fade"
                        animated={true}
                    />
                    {/*<MyTabs />*/}
                    <Stack />
                </ThemeProvider>
            </SafeAreaProvider>
        </Provider>
    )
}
export function MyTabs() {
    return (
        <Tabs.Navigator>
            <Tabs.Screen name="Home" component={HomeScreen} />
            <Tabs.Screen name="Settings" component={UserDetailScreen} />
        </Tabs.Navigator>
    )
}
