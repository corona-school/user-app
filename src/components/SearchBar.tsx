import { IconSearch } from '@tabler/icons-react';
import { ChangeEventHandler, KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

type Props = {
    placeholder?: string;
    onSearch: (searchString: string) => any;
    value?: string;
    onChangeText?: (text: string) => any;
    inputRef?: React.MutableRefObject<HTMLInputElement | undefined>;
    autoSubmit?: true;
    isLoading?: boolean;
};

const SearchBar: React.FC<Props> = ({ placeholder, onSearch, value, onChangeText, autoSubmit, inputRef, isLoading }) => {
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
                if (prev !== searchString && searchStringRef.current.value === searchString) {
                    onSearch(searchString);
                }
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [autoSubmit, onSearch, searchString]);

    const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.nativeEvent.key === 'Enter') {
            onSearch(searchString);
        }
    };

    const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (onChangeText) onChangeText(e.target.value);
        else setSearchString(e.target.value);
    };

    return (
        <div className="flex flex-row flex-1 px-1 gap-x-2">
            <Input
                className="flex-1"
                value={value || searchString}
                onChange={handleOnChange}
                placeholder={placeholder || 'Suchbegriff eingeben'}
                onKeyDown={handleKeyPress}
            />
            <Button className="p-1" onClick={() => onSearch(searchString)} size="icon" isLoading={isLoading}>
                <IconSearch />
            </Button>
        </div>
    );
};
export default SearchBar;
