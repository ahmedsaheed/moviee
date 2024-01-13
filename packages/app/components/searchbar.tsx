import { SearchBar } from '@rneui/themed'
import { Search } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { useColorScheme } from 'react-native'
import { resolveMetaAndNavigateToDetails } from 'app/lib/movies/movies'

export function Searchbar() {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const scheme = useColorScheme()

    function resetSearch() {
        setSearchQuery('')
        this.search.clear()
        this.search.blur()
    }

    return (
        <SearchBar
            ref={search => (this.search = search)}
            //@ts-ignore
            onChangeText={text => setSearchQuery(text)}
            value={searchQuery}
            placeholder="Search Shows and Movies"
            platform="ios"
            lightTheme={false}
            searchIcon={<Search size="$1" color="grey" />}
            clearIcon={null}
            showCancel={false}
            showLoading={loading}
            onCancel={() => resetSearch()}
            containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
                padding: 0,
                margin: 0,
                paddingTop: 0,
            }}
            onSubmitEditing={async () => {
                setLoading(true)
                await resolveMetaAndNavigateToDetails(searchQuery)
                setLoading(false)
                resetSearch()
            }}
            pt={'$0'}
            showClearIcon={false}
            inputContainerStyle={
                scheme === 'dark' ? { backgroundColor: '#1c1c1c' } : {}
            }
            inputStyle={
                scheme === 'dark'
                    ? {
                          color: 'grey',
                          fontWeight: 'normal',
                          fontSize: 16,
                          fontFamily: 'System',
                      }
                    : {
                          fontSize: 16,
                          fontWeight: 'normal',
                          fontFamily: 'System',
                      }
            }
        />
    )
}
