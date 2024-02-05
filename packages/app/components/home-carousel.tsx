import * as React from 'react'
import {
    Dimensions,
    ImageBackground,
    View,
    StyleSheet,
    Pressable,
} from 'react-native'
import Animated, {
    Extrapolate,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'
import { Base, TAnimationStyle } from 'app/@types/types'
import { Image } from '@my/ui'
import { LinearGradient } from 'expo-linear-gradient'
import { resolveMetaAndNavigateToDetails } from 'app/lib/movies/movies'
const { width } = Dimensions.get('window')

export function HomeTopCarousel(props: { data: Array<Base> | null }) {
    const progressValue = useSharedValue<number>(0)
    let { data } = props
    data = data?.filter((item, index) => item.backdropUrl && item.logoUrl)!!
    const animationStyle: TAnimationStyle = React.useCallback(
        (value: number) => {
            'worklet'
            const zIndex = interpolate(value, [-1, 0, 1], [-1000, 0, 1000])
            const translateX = interpolate(value, [-1, 0, 1], [0, 0, width])

            return {
                transform: [{ translateX }],
                zIndex,
            }
        },
        []
    )
    if (data === null) {
        return null
    }
    return (
        <>
            <View>
                <Carousel
                    mode="parallax"
                    loop={true}
                    autoPlay={true}
                    style={{ height: 250, borderRadius: 10 }}
                    width={width - 15}
                    onProgressChange={(_, absoluteProgress) =>
                        (progressValue.value = absoluteProgress)
                    }
                    modeConfig={{
                        parallaxScrollingScale: 0.9,
                        parallaxScrollingOffset: 50,
                    }}
                    sliderWidth={width - 15}
                    itemWidth={width - 15}
                    data={[...data!!]}
                    renderItem={({ index, animationValue }) => {
                        return (
                            <View>
                                <CarouselCard
                                    key={index}
                                    imageUrl={data!![index]!!.backdropUrl!!}
                                    logoUrl={data!![index]!!.logoUrl!!}
                                    name={data!![index]!!.title}
                                    onPress={resolveMetaAndNavigateToDetails}
                                />
                            </View>
                        )
                    }}
                    autoPlayInterval={1500}
                />
            </View>
            {!!progressValue && (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 100,
                        alignSelf: 'center',
                    }}
                ></View>
            )}
        </>
    )
}

function CarouselCard(props: {
    imageUrl: string
    logoUrl?: string
    name: string
    onPress: (string) => void
}) {
    const { imageUrl, onPress, logoUrl, name } = props
    console.log('imageUrl', imageUrl, 'logoUrl', logoUrl)
    return (
        <Pressable onPress={() => onPress(name)}>
            <ImageBackground
                resizeMode={'cover'}
                style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 10,
                }}
                source={{
                    uri: `https://image.tmdb.org/t/p/original${imageUrl}`,
                }}
            >
                <LinearGradient
                    colors={['black', 'transparent']}
                    style={styles.gradient}
                    start={{ x: 0, y: 1.0 }}
                    end={{ x: 0, y: 0 }}
                >
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/original${logoUrl}`,
                        }}
                        width="100%"
                        height={50}
                        resizeMode="contain"
                        position="absolute"
                        bottom={0}
                        pb="$2"
                    />
                </LinearGradient>
            </ImageBackground>
        </Pressable>
    )
}

const PaginationItem: React.FC<{
    index: number
    backgroundColor: string
    length: number
    animValue: Animated.SharedValue<number>
    isRotate?: boolean
}> = props => {
    const { animValue, index, length, backgroundColor, isRotate } = props
    const width = 10

    const animStyle = useAnimatedStyle(() => {
        let inputRange = [index - 1, index, index + 1]
        let outputRange = [-width, 0, width]

        if (index === 0 && animValue?.value > length - 1) {
            inputRange = [length - 1, length, length + 1]
            outputRange = [-width, 0, width]
        }

        return {
            transform: [
                {
                    translateX: interpolate(
                        animValue?.value,
                        inputRange,
                        outputRange,
                        Extrapolate.CLAMP
                    ),
                },
            ],
        }
    }, [animValue, index, length])
    return (
        <View
            style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                width,
                height: width,
                borderRadius: 50,
                overflow: 'hidden',
                transform: [
                    {
                        rotateZ: isRotate ? '90deg' : '0deg',
                    },
                ],
            }}
        >
            <Animated.View
                style={[
                    {
                        borderRadius: 50,
                        backgroundColor,
                        flex: 1,
                        padding: 2,
                    },
                    animStyle,
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 40,
        height: '90%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
})
