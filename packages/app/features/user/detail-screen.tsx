import { Button, H3, Paragraph, Spinner, YStack, XStack } from '@my/ui'
import { Image, SizableText, Separator } from 'tamagui'
import React, { useState, useEffect } from 'react'
import { ScrapeMedia, RunOutput } from '@movie-web/providers'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { useMovieData } from 'app/hooks/useMovieData'
const { useParam } = createParam<{ id: string }>()
import { Dimensions, View, ScrollView } from 'react-native'
import { Play, Download, Film, Plus, MoreVertical } from '@tamagui/lucide-icons'
import { getMoviesMetadata, retrieveFromProvider } from 'app/lib/movies/movies'
import { PlayerWrapper } from 'app/components/av'

export function UserDetailScreen() {
    const [media, setMedia] = useState<ScrapeMedia | null>(null)
    const [data, setData] = useState<RunOutput | null>(null)
    const [loading, setLoading] = useState(false)
    const [id] = useParam('id')
    const link = useLink({
        href: '/',
    })
    const { width, height } = Dimensions.get('window')
    const movieData = useMovieData(Number(id!!))

    async function getMetaAndPlay(movieName: string) {
        setLoading(true)
        const res = await getMoviesMetadata(movieName)
        if (res && res !== media) {
            setLoading(false)
            setMedia(res)
        }
        setLoading(false)
        console.log('res', res)
    }

    useEffect(() => {
        const out = async () => await retrieveFromProvider(media)
        setLoading(true)
        out().then(out => {
            console.log('out', out)
            setData(out)
        })
        setLoading(false)
    }, [media])
    return (
        <ScrollView>
            <YStack f={1} space>
                {movieData === null && (
                    <>
                        <Spinner alignSelf={'center'} size="large" />
                    </>
                )}
                {!!movieData && (
                    <>
                        <Image
                            source={{
                                uri: `https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`,
                            }}
                            resizeMode="cover"
                            height={height / 1.8}
                            width={'100%'}
                        />

                        <H3 fontWeight={900} fontFamily="System">
                            {movieData.title}
                        </H3>
                        <Button
                            mt="$2"
                            fontFamily="System"
                            icon={Play}
                            width={'80%'}
                            alignSelf="center"
                            onPress={() => getMetaAndPlay(movieData.title)}
                        >
                            Play movie
                        </Button>
                        <Button
                            mt="$2"
                            alignSelf="center"
                            fontFamily="System"
                            {...link}
                            icon={Download}
                            width={'80%'}
                        >
                            Download
                        </Button>

                        <XStack
                            flex={1}
                            space="$8"
                            borderWidth={2}
                            borderColor="transparent"
                            padding="$2"
                            alignSelf="center"
                        >
                            <YStack alignItems="center" padding="$2">
                                <Film size={30} />
                                <SizableText fontFamily="System" theme={'alt2'}>
                                    Trailer
                                </SizableText>
                            </YStack>
                            <YStack alignItems="center" padding="$2">
                                <Plus size={30} />

                                <SizableText fontFamily="System" theme={'alt2'}>
                                    Watchlist
                                </SizableText>
                            </YStack>
                            <YStack alignItems="center" padding="$1">
                                <MoreVertical size={30} />
                                <SizableText fontFamily="System" theme={'alt2'}>
                                    Watch
                                </SizableText>
                            </YStack>
                        </XStack>
                        <Separator />
                        <Paragraph mt="$4" fontFamily="System" fontSize={16}>
                            {movieData.overview}
                        </Paragraph>
                    </>
                )}
            </YStack>
            <PlayerWrapper data={data} loading={loading} />
        </ScrollView>
    )
}
