import * as React from 'react'
import { Dimensions, View } from 'react-native'
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

const { width } = Dimensions.get('window')

export function HomeTopCarousel(props: { data: Array<Base> | null }) {
    const progressValue = useSharedValue<number>(0)
    const { data } = props
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
                            <CustomItem
                                key={index}
                                index={index}
                                imageUrl={data[index]!!.backdropUrl!!}
                                animationValue={animationValue}
                                name={data[index]!!.title}
                            />
                        )
                    }}
                    customAnimation={animationStyle}
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
                >
                    {/*{data?.map((backgroundColor, index) => {*/}
                    {/*    return (*/}
                    {/*        <PaginationItem*/}
                    {/*            backgroundColor={'white'}*/}
                    {/*            animValue={progressValue}*/}
                    {/*            index={index}*/}
                    {/*            key={index}*/}
                    {/*            isRotate={false}*/}
                    {/*            length={data.length}*/}
                    {/*        />*/}
                    {/*    )*/}
                    {/*})}*/}
                </View>
            )}
        </>
    )
}

interface ItemProps {
    index: number
    name: string
    imageUrl: string
    animationValue: Animated.SharedValue<number>
}

function CarouselCard(props: {
    imageUrl: string
    name: string
    onPress: (string) => void
}) {
    const { imageUrl, onPress } = props
    return (
        <Image
            resizeMode={'cover'}
            onPress={onPress}
            style={{
                height: '100%',
                width: '100%',
                borderRadius: 10,
            }}
            source={{
                uri: `https://image.tmdb.org/t/p/original${imageUrl}`,
            }}
        />
    )
}

const CustomItem: React.FC<ItemProps> = ({
    imageUrl,
    name,
    index,
    animationValue,
}) => {
    const maskStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            animationValue.value,
            [-1, 0, 1],
            ['#000000dd', 'transparent', '#000000dd']
        )
        return {
            backgroundColor,
        }
    }, [animationValue])

    return (
        <View>
            <CarouselCard
                key={index}
                imageUrl={imageUrl}
                name={name}
                onPress={() => console.log('pressed', new Date())}
            />
            <Animated.View
                pointerEvents="none"
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    },
                    maskStyle,
                ]}
            />
        </View>
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
