import { Alert } from 'react-native'
import { router } from 'expo-router'

export function convertMinutesToHours(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return hours + 'h ' + remainingMinutes + 'm '
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
