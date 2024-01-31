import { ChevronRight, Play, Star, Sun } from '@tamagui/lucide-icons'
import { useState } from 'react'
import {
    YStack,
    ListItem,
    Separator,
    YGroup,
    AnimatePresence,
    SizableText,
    StackProps,
    styled,
    TabLayout,
    TabsTabProps,
} from 'tamagui'
import { H5, Tabs } from '@my/ui'
import { Episode, ShowType } from 'app/@types/types'
interface MoreDetailsTabProps {
    genre?: string
    director?: string
    starring?: string
    studio?: string
}

interface DetailedTabViewProps {
    movieType: ShowType
    movieId: string
    episodes?: Episode[]
    moreDetails?: MoreDetailsTabProps
}
export const DetailedTabView = (props: DetailedTabViewProps) => {
    const { movieId, movieType, episodes, moreDetails } = props
    const [tabState, setTabState] = useState<{
        currentTab: string
        /**
         * Layout of the Tab user might intend to select (hovering / focusing)
         */
        intentAt: TabLayout | null
        /**
         * Layout of the Tab user selected
         */
        activeAt: TabLayout | null
        /**
         * Used to get the direction of activation for animating the active indicator
         */
        prevActiveAt: TabLayout | null
    }>({
        activeAt: null,
        currentTab: 'tab1',
        intentAt: null,
        prevActiveAt: null,
    })

    const setCurrentTab = (currentTab: string) =>
        setTabState({ ...tabState, currentTab })
    const setIntentIndicator = intentAt =>
        setTabState({ ...tabState, intentAt })
    const setActiveIndicator = activeAt =>
        setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })
    const { activeAt, intentAt, prevActiveAt, currentTab } = tabState

    /**
     * -1: from left
     *  0: n/a
     *  1: from right
     */
    const direction = (() => {
        if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
            return 0
        }
        return activeAt.x > prevActiveAt.x ? -1 : 1
    })()

    const enterVariant =
        direction === 1
            ? 'isLeft'
            : direction === -1
            ? 'isRight'
            : 'defaultFade'
    const exitVariant =
        direction === 1
            ? 'isRight'
            : direction === -1
            ? 'isLeft'
            : 'defaultFade'

    const handleOnInteraction: TabsTabProps['onInteraction'] = (
        type,
        layout
    ) => {
        if (type === 'select') {
            setActiveIndicator(layout)
        } else {
            setIntentIndicator(layout)
        }
    }

    const renderByTab = (tab: string) => {
        switch (tab) {
            case 'tab1':
                return episodes ? (
                    <EpisodeList episodes={episodes!!} />
                ) : (
                    <H5>Related</H5>
                )
            case 'tab2':
                return <MoreDetailsTab {...moreDetails} />
            case 'tab3':
                return <H5>Notifications</H5>
            default:
                return <H5>Related</H5>
        }
    }

    return (
        <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            orientation="horizontal"
            size="$4"
            flexDirection="column"
            backgroundColor="transparent"
            borderRadius="$4"
            px="$4"
        >
            <YStack>
                <AnimatePresence>
                    {intentAt && (
                        <TabsRovingIndicator
                            width={intentAt.width}
                            height="$0.5"
                            x={intentAt.x}
                            bottom={0}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {activeAt && (
                        <TabsRovingIndicator
                            theme="active"
                            active
                            width={activeAt.width}
                            height="$0.5"
                            x={activeAt.x}
                            bottom={0}
                        />
                    )}
                </AnimatePresence>
                <Tabs.List
                    disablePassBorderRadius
                    loop={false}
                    borderBottomLeftRadius={0}
                    borderBottomRightRadius={0}
                    paddingBottom="$1.5"
                    borderColor="$color3"
                    borderBottomWidth="$0.5"
                    backgroundColor="transparent"
                >
                    <Tabs.Tab
                        unstyled
                        padding="$5"
                        value="tab1"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText style={{ fontFamily: 'System' }} h="$2">
                            {movieType === 'movie' ? 'Related' : 'Episodes'}
                        </SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab
                        unstyled
                        padding="$5"
                        value="tab2"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText style={{ fontFamily: 'System' }} h="$2">
                            More Details
                        </SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab
                        unstyled
                        padding="$5"
                        value="tab3"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText style={{ fontFamily: 'System' }} h="$2">
                            Notifications
                        </SizableText>
                    </Tabs.Tab>
                </Tabs.List>
            </YStack>

            <AnimatePresence
                exitBeforeEnter
                enterVariant={enterVariant}
                exitVariant={exitVariant}
            >
                <AnimatedYStack
                    key={currentTab}
                    animation="100ms"
                    x={0}
                    opacity={1}
                    flex={1}
                >
                    <Tabs.Content
                        value={currentTab}
                        forceMount
                        flex={1}
                        justifyContent="center"
                        w="100%"
                    >
                        <H5>{renderByTab(currentTab)}</H5>
                    </Tabs.Content>
                </AnimatedYStack>
            </AnimatePresence>
        </Tabs>
    )
}

const TabsRovingIndicator = ({
    active,
    ...props
}: { active?: boolean } & StackProps) => {
    return (
        <YStack
            position="absolute"
            backgroundColor="$color5"
            opacity={0.7}
            animation="100ms"
            enterStyle={{
                opacity: 0,
            }}
            exitStyle={{
                opacity: 0,
            }}
            {...(active && { backgroundColor: '$color8', opacity: 0.6 })}
            {...props}
        />
    )
}

const AnimatedYStack = styled(YStack, {
    variants: {
        isLeft: { true: { x: -25, opacity: 0 } },
        isRight: { true: { x: 25, opacity: 0 } },
        defaultFade: { true: { opacity: 0 } },
    } as const,
})

interface EpisodeListProps {
    episodes: Episode[]
}

function EpisodeList({ episodes }: EpisodeListProps): JSX.Element {
    return (
        <YGroup
            alignSelf="center"
            width={'100%'}
            size="$5"
            separator={<Separator />}
            backgroundColor="$transparent"
        >
            {episodes.map((episode, index) => (
                <YGroup.Item backgroundColor="$transparent">
                    <ListItem
                        backgroundColor="$transparent"
                        title={`Episode ${index + 1}`}
                        subTitle={episode.name}
                        icon={Play}
                        iconAfter={ChevronRight}
                        style={{ fontFamily: 'System' }}
                    />
                </YGroup.Item>
            ))}
        </YGroup>
    )
}

function MoreDetailsTab({
    genre,
    director,
    starring,
    studio,
}: MoreDetailsTabProps = {}) {
    return (
        <YGroup
            alignSelf="center"
            width={'100%'}
            size="$5"
            separator={<Separator />}
            backgroundColor="$transparent"
        >
            <YGroup.Item backgroundColor="$transparent">
                <ListItem
                    backgroundColor="$transparent"
                    // hoverTheme
                    // pressTheme
                    title="Genre"
                    subTitle={genre}
                    icon={null}
                    iconAfter={null}
                />
            </YGroup.Item>
            <YGroup.Item backgroundColor="$transparent">
                <ListItem
                    backgroundColor="$transparent"
                    // hoverTheme
                    // pressTheme
                    title="Director"
                    subTitle={director}
                    icon={null}
                    iconAfter={null}
                />
            </YGroup.Item>
            <YGroup.Item backgroundColor="$transparent">
                <ListItem
                    backgroundColor="$transparent"
                    // hoverTheme
                    // pressTheme
                    title="Starring"
                    subTitle={starring}
                    icon={null}
                    iconAfter={null}
                />
            </YGroup.Item>
            <YGroup.Item backgroundColor="$transparent">
                <ListItem
                    backgroundColor="$transparent"
                    // hoverTheme
                    // pressTheme
                    title="Studio"
                    subTitle={studio}
                    icon={null}
                    iconAfter={null}
                />
            </YGroup.Item>
        </YGroup>
    )
}
