import { Card, Image, ScrollView, XStack } from '@my/ui'
import { Base, HomeScreenCardProps } from 'app/@types/types'
import { Link, useLink } from 'solito/link'
import { LinearGradient } from '@tamagui/linear-gradient'

export function Cards(props: HomeScreenCardProps) {
    const { title, releaseYear, onPress, imageUrl, ...rest } = props
    return (
        <Card elevate bordered {...rest} onPress={onPress}>
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
                        width: '100%',
                        height: '100%',
                        uri: `https://image.tmdb.org/t/p/original/${imageUrl}`,
                    }}
                />
            </Card.Background>
        </Card>
    )
}

export function MovieCards(
    props:
        | {
              movies: Array<Base> | null
              onPress: (movieName: string, id: number) => void
          }
        | undefined
) {
    if (!props) {
        return null
    }
    const { movies, onPress } = props
    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <XStack
                $sm={{ flexDirection: 'row' }}
                paddingHorizontal="$0"
                backgroundColor={'transparent'}
                gap="$2"
            >
                {movies?.map((movie, index) => (
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
                        width={110}
                        height={150}
                        scale={0.9}
                        hoverStyle={{ scale: 0.925 }}
                        pressStyle={{ scale: 0.875 }}
                        imageUrl={movie.imageUrl}
                        key={index}
                        onPress={() => onPress(movie.title, movie.tmdbId)}
                        releaseYear={movie.releaseYear}
                        title={movie.title}
                        tmdbId={movie.tmdbId}
                    />
                ))}
            </XStack>
        </ScrollView>
    )
}
