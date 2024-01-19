import { useTheme, Row, Button, Input, SearchIcon } from 'native-base';
import { useEffect, useRef, useState } from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

type Props = {
    placeholder?: string;
    onSearch: (searchString: string) => any;
    showBack?: boolean;
    onBack?: () => any;
    value?: string;
    onChangeText?: (text: string) => any;
    inputRef?: React.MutableRefObject<HTMLInputElement | undefined>;
    autoSubmit?: true;
};

const SearchBar: React.FC<Props> = ({ placeholder, onSearch, showBack, onBack, value, onChangeText, inputRef, autoSubmit }) => {
    const { space } = useTheme();
    const [searchString, setSearchString] = useState<string>('');
    const searchStringRef = useRef<{ value?: string }>({});

    useEffect(() => {
        const prev = searchStringRef.current.value;
        searchStringRef.current.value = searchString;

        // Do not trigger when the user starts to enter
        if (!prev) return;

        if (autoSubmit) {
            const timer = setTimeout(() => {
                // search string has not changed for 3 seconds
                if (searchStringRef.current.value === searchString) {
                    onSearch(searchString);
                }
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [autoSubmit, onSearch, searchString]);
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
