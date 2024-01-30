import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
    useFonts,
    Inter_900Black,
    Inter_400Regular,
} from '@expo-google-fonts/inter'
import { UserDetailScreen } from 'app/features/user/detail-screen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import { BottomTabBar } from '@react-navigation/bottom-tabs'
import { View } from 'react-native'
import { GalleryVerticalEnd, Home, Search, Tv2 } from '@tamagui/lucide-icons'
import { StyleSheet } from 'react-native'
import { SearchScreen } from 'app/features/search/search'
import { Wishlist } from 'app/features/library/wishlist'

const Tab = createBottomTabNavigator()
export default function Screen() {
    let [fontsLoaded, fontError] = useFonts({
        Inter_400Regular,
    })

    if (!fontsLoaded && !fontError) {
        return null
    }
    return (
        <>
            {/*<NavigationContainer>*/}
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack.Screen
                    options={{
                        title: 'Home',
                        headerShown: false,
                        headerBackVisible: true,
                    }}
                />

                <MyTabs />
            </GestureHandlerRootView>
            {/*</NavigationContainer>*/}
        </>
    )
}

function BottomBar(props) {
    return (
        <View>
            {/*// @ts-ignore*/}
            <BlurView
                tint="dark"
                intensity={90}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}
            >
                <BottomTabBar {...props} />
            </BlurView>
        </View>
    )
}

export function MyTabs() {
    return (
        <Tab.Navigator
            tabBar={props => {
                return <BottomBar {...props} />
            }}
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    elevation: 0,
                },
                tabBarBackground: () => (
                    // @ts-ignore
                    <BlurView
                        tint="dark"
                        intensity={90}
                        style={StyleSheet.absoluteFill}
                    />
                ),
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Tv2 color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Library"
                component={Wishlist}
                options={{
                    tabBarLabel: 'Library',
                    tabBarIcon: ({ color, size }) => (
                        <GalleryVerticalEnd color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SearchScreen}
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <Search color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}
