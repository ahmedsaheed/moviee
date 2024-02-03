import { Alert } from 'react-native'
import { router } from 'expo-router'

export function convertMinutesToHours(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return hours + 'h ' + remainingMinutes + 'm '
}

export const convertMilliSecToReadableTime = (duration: number) => {
    const portions: string[] = []

    const msInHour = 1000 * 60 * 60
    const hours = Math.trunc(duration / msInHour)
    if (hours > 0) {
        portions.push(hours + 'h')
        duration = duration - hours * msInHour
    }

    const msInMinute = 1000 * 60
    const minutes = Math.trunc(duration / msInMinute)
    if (minutes > 0) {
        portions.push(minutes + 'm')
        duration = duration - minutes * msInMinute
    }

    const seconds = Math.trunc(duration / 1000)
    if (seconds > 0) {
        portions.push(seconds + 's')
    }

    return portions.join(' ')
}

export const CannotPlayMovieDialog = () =>
    Alert.alert(
        'Cannot play movie',
        "The movie you've requested can't be played at this time",
        [
            {
                text: 'Go Back',
                onPress: () => router.back(),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]
    )
