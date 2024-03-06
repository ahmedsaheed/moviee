import { Select, Adapt, Sheet, YStack, getFontSize, setupNativeSheet } from 'tamagui'
import type { FontSizeTokens, SelectProps } from 'tamagui'
import { ChevronDown, ChevronUp, Check } from '@tamagui/lucide-icons'
import { useState, useEffect, useMemo } from 'react'
import { ProgressInfo } from './av'
import { LinearGradient } from 'expo-linear-gradient'

interface SeasonSelectorProps extends SelectProps {
    seasonsLength?: number
    updateProgress?: (progressInfo: ProgressInfo) => void
    initialSeason?: number
}


export function SeasonSelector(props: SeasonSelectorProps) {
    const { seasonsLength, updateProgress, initialSeason } = props
    if (seasonsLength!! < 2) {
        return
    }
    const [val, setVal] = useState(`season ${initialSeason ?? 1}`)
    useEffect(() => {
        setVal(`season ${initialSeason ?? 1}`)
    }, [initialSeason])
    const items = useMemo(
        () =>
            Array.from({ length: props.seasonsLength ?? 3 }, (_, i) => {
                return { name: `Season ${i + 1}` }
            }),
        [seasonsLength]
    )

    const onValueChange = (value: string) => {
        setVal(value)
        updateProgress!!({
            positionMillis: 0,
            season: Number(value.split(' ')[1]),
            episode: 1,
            completed: false,
        })
    }

    return (
        <Select
            value={val}
            onValueChange={onValueChange}
            disablePreventBodyScroll
            {...props}
        >
            <Select.Trigger mx="$4" my="$2" py="$1.5" width={"90%"} iconAfter={ChevronDown}>
                <Select.Value placeholder="Something" />
            </Select.Trigger>

            <Adapt when="sm" platform="touch">
                <Sheet
                    native
                    modal
                    dismissOnSnapToBottom
                    animationConfig={{
                        type: 'spring',
                        damping: 20,
                        mass: 1.2,
                        stiffness: 250,
                    }}
                    snapPoints={[50, 40]}
                >
                    <Sheet.Frame>
                        <Sheet.ScrollView>
                            <Adapt.Contents />
                        </Sheet.ScrollView>
                    </Sheet.Frame>
                    <Sheet.Overlay
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                </Sheet>
            </Adapt>

            <Select.Content zIndex={200000}>
                <Select.ScrollUpButton
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    width="100%"
                    height="$3"
                >
                    <YStack zIndex={10}>
                        <ChevronUp size={20} />
                    </YStack>
                    <LinearGradient
                        start={[0, 0]}
                        end={[0, 1]}
                        colors={['black', 'transparent']}
                    />
                </Select.ScrollUpButton>

                <Select.Viewport
                    // to do animations:
                    // animation="quick"
                    // animateOnly={['transform', 'opacity']}
                    // enterStyle={{ o: 0, y: -10 }}
                    // exitStyle={{ o: 0, y: 10 }}
                    minWidth={200}
                >
                    <Select.Group>
                        <Select.Label>Seasons</Select.Label>
                        {/* for longer lists memoizing these is useful */}
                        {useMemo(
                            () =>
                                items.map((item, i) => {
                                    return (
                                        <Select.Item
                                            index={i}
                                            key={item.name}
                                            value={item.name.toLowerCase()}
                                        >
                                            <Select.ItemText>
                                                {item.name}
                                            </Select.ItemText>
                                            <Select.ItemIndicator marginLeft="auto">
                                                <Check size={16} />
                                            </Select.ItemIndicator>
                                        </Select.Item>
                                    )
                                }),
                            [items]
                        )}
                    </Select.Group>
                    {/* Native gets an extra icon */}
                    {props.native && (
                        <YStack
                            position="absolute"
                            right={0}
                            top={0}
                            bottom={0}
                            alignItems="center"
                            justifyContent="center"
                            width={'$4'}
                            pointerEvents="none"
                        >
                            <ChevronDown
                                size={getFontSize(
                                    (props.size as FontSizeTokens) ?? '$true'
                                )}
                            />
                        </YStack>
                    )}
                </Select.Viewport>

                <Select.ScrollDownButton
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    width="100%"
                    height="$3"
                >
                    <YStack zIndex={10}>
                        <ChevronDown size={20} />
                    </YStack>
                    <LinearGradient
                        start={[0, 0]}
                        end={[0, 1]}
                        colors={['transparent', 'black']}
                    />
                </Select.ScrollDownButton>
            </Select.Content>
        </Select>
    )
}
