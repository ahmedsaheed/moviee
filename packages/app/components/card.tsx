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
import { useLink } from 'solito/link'
import { Link } from 'solito/link'
import { Skeleton } from '@rneui/base'
import { LinearGradient } from '@tamagui/linear-gradient'

export function Cards(props: HomeScreenCardProps) {
    const { title, releaseYear, onPress, imageUrl, ...rest } = props
    return (
        <Card disabled elevate size="$4" bordered {...rest} onPress={onPress}>
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
    const linkProps = useLink({
        href: '/user/nate',
    })
    const { onPress } = linkProps
    const { movies } = props
    return (
        <ScrollView horizontal={true}>
            <XStack
                $sm={{ flexDirection: 'row' }}
                paddingHorizontal="$1"
                backgroundColor={'transparent'}
                space
            >
                {movies?.map((movie, index) => (
                    <Link href={`/user/${movie.tmdbId}`}>
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
                            onPress={() => onPress}
                            releaseYear={movie.releaseYear}
                            title={movie.title}
                            tmdbId={movie.tmdbId}
                        />
                    </Link>
                ))}
            </XStack>
        </ScrollView>
    )
}

function MovieCardSkeleton() {
    return (
        <>
            <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={100}
                height={140}
            />
            <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={100}
                height={140}
            />
            <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={100}
                height={140}
            />
            <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={100}
                height={140}
            />
        </>
    )
}
