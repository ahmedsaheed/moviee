import {
    Button,
    Card,
    CardProps,
    H2,
    Paragraph,
    XStack,
    Image,
    ScrollView,
} from '@my/ui'
import { Base, HomeScreenCardProps } from 'app/@types/types'
import { AnimatePresence } from 'tamagui'

export function Cards(props: HomeScreenCardProps) {
    const { title, releaseYear, onPress, imageUrl, ...rest } = props
    return (
        <Card elevate size="$4" bordered {...rest} onPress={onPress}>
            <Card.Header padded></Card.Header>
            <Card.Footer padded>
                <XStack flex={1} />
            </Card.Footer>
            <Card.Background>
                <Image
                    resizeMode="cover"
                    bordered
                    borderRadius="$4"
                    source={{
                        width: 100,
                        height: 145,
                        uri: `https://image.tmdb.org/t/p/original/${imageUrl}`,
                    }}
                />
            </Card.Background>
        </Card>
    )
}
export function MovieCards(
    props:
        | { movies: Array<Base> | null; onPress: (movieName: string) => void }
        | undefined
) {
    if (!props) {
        return null
    }
    const { movies, onPress } = props
    return (
        <ScrollView horizontal={true}>
            <XStack
                $sm={{ flexDirection: 'row' }}
                paddingHorizontal="$1"
                backgroundColor={'transparent'}
                space
            >
                {movies?.map((movie, index) => (
                    <AnimatePresence key={index}>
                        <Cards
                            animation="bouncy"
                            enterStyle={{
                                opacity: 0,
                                y: 10,
                                scale: 0.9,
                            }}
                            exitStyle={{
                                opacity: 0,
                                y: -10,
                                scale: 0.9,
                            }}
                            size="$4"
                            width={100}
                            height={140}
                            scale={0.9}
                            hoverStyle={{ scale: 0.925 }}
                            pressStyle={{ scale: 0.875 }}
                            imageUrl={movie.imageUrl}
                            key={index}
                            onPress={() => onPress(movie.title)}
                            releaseYear={movie.releaseYear}
                            title={movie.title}
                            tmdbId={movie.tmdbId}
                        />
                    </AnimatePresence>
                ))}
            </XStack>
        </ScrollView>
    )
}
