import { H2 } from '@my/ui'

export const Greeting = () => {
    const currentHour = new Date().getHours()
    let greeting

    if (currentHour < 6) {
        greeting = 'Still awake'
    } else if (currentHour < 12) {
        greeting = 'Good morning'
    } else if (currentHour < 18) {
        greeting = 'Good afternoon'
    } else {
        greeting = 'Good evening'
    }

    return (
        <H2 fontFamily="$body" pt="$8">
            {greeting}
        </H2>
    )
}
