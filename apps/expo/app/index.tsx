import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import { BottomTabBar } from '@react-navigation/bottom-tabs'
import { View } from 'react-native'
import { GalleryVerticalEnd, Search, Tv2, Home } from '@tamagui/lucide-icons'
import { StyleSheet } from 'react-native'
import { SearchScreen } from 'app/features/search/search'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Wishlist } from 'app/features/library/wishlist'

const RouteStack = createNativeStackNavigator()
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
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
                <MyTabs />
            </GestureHandlerRootView>
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

function WishListStack() {
    return (
        <RouteStack.Navigator>
            <RouteStack.Screen
                name="Wishlist"
                component={Wishlist}
                options={{
                    title: 'Wishlist',
                    headerLargeTitle: true,
                    headerLargeStyle: { backgroundColor: 'black' },
                    headerShown: true,
                    headerTransparent: true,
                    headerBlurEffect: 'dark',
                }}
            />
        </RouteStack.Navigator>
    )
}

function HomeStack() {
    return (
        <RouteStack.Navigator>
            <RouteStack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'For you',
                    headerLargeTitle: true,
                    headerLargeStyle: { backgroundColor: 'black' },
                    headerShown: true,
                    headerTransparent: true,
                    headerBlurEffect: 'dark',
                    // headerBackVisible: true,
                }}
            />
            {/*<RouteStack.Screen*/}
            {/*    name="wishlist"*/}
            {/*    component={Wishlist}*/}
            {/*    options={{*/}
            {/*        title: 'Wishlist',*/}
            {/*        headerLargeTitle: true,*/}
            {/*        headerLargeStyle: { backgroundColor: 'black' },*/}
            {/*        headerShown: true,*/}
            {/*        headerTransparent: true,*/}
            {/*        headerBlurEffect: 'dark',*/}
            {/*        // headerBackVisible: true,*/}
            {/*    }}*/}
            {/*/>*/}
            {/*<RouteStack.Screen*/}
            {/*    name="search"*/}
            {/*    component={SearchScreen}*/}
            {/*    options={{*/}
            {/*        title: 'Search',*/}
            {/*        headerLargeTitle: true,*/}
            {/*        headerLargeStyle: { backgroundColor: 'black' },*/}
            {/*        headerShown: true,*/}
            {/*        headerTransparent: true,*/}
            {/*        headerBlurEffect: 'dark',*/}
            {/*        // headerBackVisible: true,*/}
            {/*    }}*/}
            {/*/>*/}
        </RouteStack.Navigator>
    )
}

function SearchStack() {
    return (
        <RouteStack.Navigator>
            <RouteStack.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    title: 'Search',
                    headerLargeTitle: true,
                    headerLargeStyle: { backgroundColor: 'black' },
                    headerShown: true,
                    headerTransparent: true,
                    headerBlurEffect: 'dark',
                    // headerBackVisible: true,
                }}
            />
        </RouteStack.Navigator>
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
                component={HomeStack}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Wishlist"
                component={WishListStack}
                options={{
                    tabBarLabel: 'Library',
                    tabBarIcon: ({ color, size }) => (
                        <GalleryVerticalEnd color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchStack}
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
