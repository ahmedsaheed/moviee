import { H1, H2 } from '@my/ui'
import {
    Header,
    LargeHeader,
    ScalingView,
} from '@codeherence/react-native-header'
import { View, StyleSheet } from 'react-native'
import { Tv, UserCircle2 } from '@tamagui/lucide-icons'

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
            />
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
