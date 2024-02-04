import { SizeTokens, XStack, YStack, Progress } from 'tamagui'
import { convertMilliSecToReadableTime } from 'app/utils'
import { useState, useEffect } from 'react'
import { Text } from '@my/ui'

interface ProgressIndicatorProps {
    progressPercentVal?: number
    timeLeft?: number
}

export function ShowProgressIndicator({
    progressPercentVal = 0,
    timeLeft = 0,
}: ProgressIndicatorProps) {
    const [progress, setProgress] = useState(progressPercentVal)
    const [timeLeftVal, setTimeLeft] = useState(timeLeft)
    const sizeProp = `$${1}` as SizeTokens

    useEffect(() => {
        setProgress(progressPercentVal)
        setTimeLeft(timeLeft)
    }, [progressPercentVal, timeLeft])

    return (
        <>
            <XStack
                flex={1}
                padding="$2"
                height="$3"
                alignSelf="center"
                alignItems="center"
                w={'80%'}
            >
                <YStack padding="$1" w={'70%'}>
                    <Progress size={sizeProp} value={progress}>
                        <Progress.Indicator animation="medium" />
                    </Progress>
                </YStack>
                <YStack padding="$1" opacity={0.8}>
                    <Text>
                        {' '}
                        {convertMilliSecToReadableTime(timeLeftVal)} left{' '}
                    </Text>
                </YStack>
            </XStack>
        </>
    )
}
