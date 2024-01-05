import * as React from 'react'
import { Dimensions, View } from 'react-native'
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
} from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'
import { Base, HomeScreenCardProps, TAnimationStyle } from 'app/@types/types'
import { Card, Image, XStack } from '@my/ui'

const { width } = Dimensions.get('window')

export function HomeTopCarousel(props: { data: Array<Base> | null }) {
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

    return (
        <View>
            <Carousel
                loop={true}
                autoPlay={true}
                style={{ height: 200, borderRadius: 10 }}
                width={width - 15}
                data={[...data!!]}
                renderItem={({ index, animationValue }) => {
                    return (
                        <CustomItem
                            key={index}
                            index={index}
                            imageUrl={data!![index].imageUrl}
                            animationValue={animationValue}
                            name={data[index].title}
                        />
                    )
                }}
                customAnimation={animationStyle}
                scrollAnimationDuration={10000}
            />
        </View>
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
    style: { borderRadius: number }
}) {
    const { imageUrl, onPress, ...rest } = props
    return (
        <Image
            resizeMode={'cover'}
            alignSelf={'auto'}
            onPress={onPress}
            style={{
                flex: 1,
                width: undefined,
                height: undefined,
                borderRadius: 10,
                aspectRatio: 2,
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
        <View style={{ flex: 1 }}>
            <CarouselCard
                key={index}
                style={{ borderRadius: 0 }}
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
