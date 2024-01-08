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
    const [showMore, setShowMore] = useState(false);
    const [id] = useParam('id')
    const link = useLink({
        href: '/',
    })
    const { width, height } = Dimensions.get('window')
    const movieData = useMovieData(Number(id!!))
    function convertMinutesToHours(minutes) {
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        return hours + 'h ' + remainingMinutes + 'm '
    }
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
            <YStack f={1} space pb="$8">
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

                        <H3 fontWeight={900} m="$4" fontFamily="System">
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
                            {loading ? 'Loading..' : 'Play Movie'}
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
                                <Film size={20} theme="alt1" />
                                <SizableText fontFamily="System" theme={'alt1'}>
                                    Trailer
                                </SizableText>
                            </YStack>
                            <YStack alignItems="center" padding="$2">
                                <Plus size={20} theme="alt1" />

                                <SizableText fontFamily="System" theme={'alt1'}>
                                    Watchlist
                                </SizableText>
                            </YStack>
                            <YStack alignItems="center" padding="$2">
                                <MoreVertical size={20} theme="alt1" />
                                <SizableText fontFamily="System" theme={'alt1'}>
                                    More
                                </SizableText>
                            </YStack>
                        </XStack>
                        <Separator />
                        <Paragraph m="$4" fontFamily="System" fontSize={18}>
                            {showMore ? movieData.overview : movieData.overview.slice(0, 100)}
                            <SizableText
                                onPress={() => setShowMore(!showMore)}
                                fontFamily="System"
                                theme={'alt1'}
                                fontSize={18}
                            >
                            ...{showMore ? 'less' : 'more'}
                            </SizableText>

                        </Paragraph>

                        <XStack flex={1} m="$4">
                            <>
                                {movieData.genres.map((item, index) => {
                                    return (
                                        <>
                                            <SizableText
                                                key={index}
                                                theme={'alt1'}
                                                fontSize={18}
                                                fontFamily="System"
                                            >
                                                {item.name}
                                            </SizableText>
                                            <Separator
                                                alignSelf="stretch"
                                                vertical
                                                marginHorizontal={5}
                                            />
                                        </>
                                    )
                                })}
                                <SizableText
                                    theme={'alt1'}
                                    fontSize={18}
                                    fontFamily="System"
                                >
                                    {movieData.release_date.split('-')[0]}
                                </SizableText>
                                <Separator
                                    alignSelf="stretch"
                                    vertical
                                    marginHorizontal={5}
                                />
                                <SizableText
                                    theme={'alt1'}
                                    fontSize={18}
                                    fontFamily="System"
                                >
                                    {convertMinutesToHours(movieData.runtime)}
                                </SizableText>
                            </>
                        </XStack>
                    </>
                )}
            </YStack>
            <PlayerWrapper data={data} loading={loading} />
        </ScrollView>
    )
}
