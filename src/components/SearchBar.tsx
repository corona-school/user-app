import {
  useTheme,
  Row,
  Button,
  ArrowBackIcon,
  Input,
  SearchIcon
} from 'native-base'
import { useState } from 'react'
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'

type Props = {
  placeholder?: string
  onSearch: (searchString: string) => any
  showBack?: boolean
  onBack?: () => any
  value?: string
  onChangeText?: (text: string) => any
}

const SearchBar: React.FC<Props> = ({
  placeholder,
  onSearch,
  showBack,
  onBack,
  value,
  onChangeText
}) => {
  const { space } = useTheme()
  const [searchString, setSearchString] = useState<string>('')

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === 'Enter') {
      onSearch(searchString)
    }
  }

  return (
    <Row>
      {showBack && (
        <Button padding={space['1']} onPress={onBack}>
          <ArrowBackIcon />
        </Button>
      )}
      <Input
        flex="1"
        value={value || searchString}
        onChangeText={onChangeText || setSearchString}
        placeholder={placeholder || 'Suchbegriff eingeben'}
        onKeyPress={handleKeyPress}
      />
      <Button onPress={() => onSearch(searchString)} padding={space['1']}>
        <SearchIcon />
      </Button>
    </Row>
  )
}
export default SearchBar
