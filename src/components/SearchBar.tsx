import { useTheme, Row, Button, Input, SearchIcon } from 'native-base';
import { useState } from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

type Props = {
    placeholder?: string;
    onSearch: (searchString: string) => any;
    showBack?: boolean;
    onBack?: () => any;
    value?: string;
    onChangeText?: (text: string) => any;
    inputRef?: React.MutableRefObject<HTMLInputElement | undefined>;
};

const SearchBar: React.FC<Props> = ({ placeholder, onSearch, showBack, onBack, value, onChangeText, inputRef }) => {
    const { space } = useTheme();
    const [searchString, setSearchString] = useState<string>('');

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (e.nativeEvent.key === 'Enter') {
            onSearch(searchString);
        }
    };

    return (
        <Row flex="1">
            <Input
                ref={inputRef}
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
    );
};
export default SearchBar;
