import { Button, Card, CardProps, H2, Paragraph, XStack, Image } from '@my/ui'
import { HomeScreenCardProps } from 'app/@types/types'

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
                    resizeMode="contain"
                    alignSelf="center"
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
