import React from 'react'
import { Tabs } from 'expo-router'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import { GalleryVerticalEnd, Search, Home } from '@tamagui/lucide-icons'
import { StyleSheet, View } from 'react-native'
import { BottomTabBar } from '@react-navigation/bottom-tabs'
import { SearchScreen } from 'app/features/search/search'
import { HomeScreen } from 'app/features/home/screen'
import { Wishlist } from 'app/features/library/wishlist'
const RouteStack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

export default function TabLayout() {
    return <MyTabs />
}

export function MyTabs() {
    return (
        <Tab.Navigator
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
                name="home"
                component={HomeStack}
                options={{
                    tabBarLabel: 'Home',
                    headerTitle: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="wishlist"
                component={WishListStack}
                options={{
                    tabBarLabel: 'Library',
                    tabBarIcon: ({ color, size }) => (
                        <GalleryVerticalEnd color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="search"
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
                }}
            />
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
                }}
            />
        </RouteStack.Navigator>
    )
}
