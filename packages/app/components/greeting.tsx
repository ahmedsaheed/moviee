import { Button, H1, H2, Sheet, useToastController } from '@my/ui'
import {
    Header,
    LargeHeader,
    ScalingView,
} from '@codeherence/react-native-header'
import { View, StyleSheet } from 'react-native'
import { ChevronDown, UserCircle2 } from '@tamagui/lucide-icons'
import { useState } from 'react'

export const HeaderComponent = ({ showNavBar }) => (
    <Header headerStyle={{}} noBottomBorder={true} showNavBar={showNavBar} />
)

export const LargeHeaderComponent = ({ scrollY }) => (
    <LargeHeader>
        <ScalingView scrollY={scrollY} pb="$0">
            <Greeting />
        </ScalingView>
    </LargeHeader>
)
export const Greeting = () => {
    const [open, setOpen] = useState(false)
    const [position, setPosition] = useState(0)
    const toast = useToastController()
    const currentHour = new Date().getHours()
    let greeting

    if (currentHour < 6) {
        greeting = 'Still up'
    } else if (currentHour < 12) {
        greeting = 'Good morning'
    } else if (currentHour < 18) {
        greeting = 'Good afternoon'
    } else {
        greeting = 'Good evening'
    }

    return (
        <View style={styles.container}>
            <H2 fontFamily="System" fontWeight={'bold'} p="$2" pb="$0">
                {greeting}
            </H2>
            <UserCircle2
                size={'$2'}
                style={{
                    alignSelf: 'flex-end',
                    marginLeft: 'auto',
                }}
                pr={'$2'}
                onPress={() => setOpen(x => !x)}
            />
            <Sheet
                modal
                animation="medium"
                open={open}
                onOpenChange={setOpen}
                snapPoints={[80]}
                position={position}
                onPositionChange={setPosition}
                dismissOnSnapToBottom
            >
                <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame ai="center" jc="center">
                    <Sheet.Handle />
                    <Button
                        size="$6"
                        circular
                        icon={ChevronDown}
                        onPress={() => {
                            setOpen(false)
                            toast.show('Sheet closed!', {
                                message: 'Just showing how toast works...',
                            })
                        }}
                    />
                </Sheet.Frame>
            </Sheet>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
})
